import { Redis } from "ioredis";
import { Client } from "ssh2";
import dotenv from "dotenv";

dotenv.config();

interface ConnectionInfo {
  host: string;
  username: string;
  password: string;
  port: number;
  lastAccessed: number;
}

class ConnectionManager {
  private connections: Map<string, Client>;
  public redisClient: Redis; // Make client public for WS server access
  private readonly REDIS_PREFIX = "ssh_session:";
  private readonly SESSION_TTL = 10200; // 2 hours in seconds

  constructor() {
    this.connections = new Map();

    // Ensure REDIS_URL is defined
    if (!process.env.REDIS_URL) {
      throw new Error("REDIS_URL is not defined in environment variables.");
    }

    try {
      this.redisClient = new Redis(process.env.REDIS_URL, {
        retryStrategy: (times) => {
          if (times > 3) {
            console.error("Failed to connect to Redis after 3 attempts");
            return null;
          }
          return Math.min(times * 500, 3000);
        },
      });

      this.redisClient.on("error", (err) =>
        console.error("Redis Client Error", err)
      );
      this.redisClient.on("connect", () =>
        console.log("Redis Client Connected")
      );
    } catch (error) {
      console.error("Failed to initialize Redis:", error);
      throw error;
    }

    this.startCleanupInterval();
  }

  private startCleanupInterval() {
    // Clean up inactive connections every 5 minutes
    setInterval(() => this.cleanupInactiveConnections(), 5 * 60 * 1000);
  }

  // This method is primarily used by the Next.js API to create sessions
  // In WS server it's mainly for testing/completeness
  async createConnection(connectionInfo: ConnectionInfo): Promise<string> {
    const conn = new Client();
    const sessionId = crypto.randomUUID();

    try {
      await new Promise<void>((resolve, reject) => {
        conn
          .on("ready", () => {
            this.connections.set(sessionId, conn);
            resolve();
          })
          .on("error", (err) => {
            reject(err);
          })
          .connect({
            host: connectionInfo.host,
            port: connectionInfo.port,
            username: connectionInfo.username,
            password: connectionInfo.password,
          });
      });

      // Store connection info in Redis
      const sessionData = JSON.stringify({
        ...connectionInfo,
        lastAccessed: Date.now(),
      });

      await this.redisClient.setex(
        `${this.REDIS_PREFIX}${sessionId}`,
        this.SESSION_TTL,
        sessionData
      );

      return sessionId;
    } catch (error) {
      throw error;
    }
  }

  async getConnection(sessionId: string): Promise<Client> {
    // Check if connection exists in memory
    let conn = this.connections.get(sessionId);

    if (!conn) {
      // Try to recover connection from Redis
      const info = await this.redisClient.get(
        `${this.REDIS_PREFIX}${sessionId}`
      );

      if (info) {
        const connectionInfo: ConnectionInfo = JSON.parse(info);

        // Create new connection
        conn = new Client();
        await new Promise<void>((resolve, reject) => {
          conn!
            .on("ready", () => {
              this.connections.set(sessionId, conn!);
              resolve();
            })
            .on("error", (err) => {
              reject(err);
            })
            .connect({
              host: connectionInfo.host,
              port: connectionInfo.port,
              username: connectionInfo.username,
              password: connectionInfo.password,
            });
        });

        // Update last accessed time
        this.updateSessionExpiry(sessionId);
      } else {
        throw new Error("No active session login again");
      }
    } else {
      // Update last accessed time for existing connection
      this.updateSessionExpiry(sessionId);
    }

    return conn;
  }

  // Check if a session exists in Redis
  async sessionExists(sessionId: string): Promise<boolean> {
    const exists = await this.redisClient.exists(
      `${this.REDIS_PREFIX}${sessionId}`
    );
    return exists === 1;
  }

  private async updateSessionExpiry(sessionId: string) {
    await this.redisClient.expire(
      `${this.REDIS_PREFIX}${sessionId}`,
      this.SESSION_TTL
    );
  }

  async closeConnection(sessionId: string): Promise<void> {
    const conn = this.connections.get(sessionId);
    if (conn) {
      conn.end();
      this.connections.delete(sessionId);
    }

    // Remove from Redis
    await this.redisClient.del(`${this.REDIS_PREFIX}${sessionId}`);
  }

  private async cleanupInactiveConnections() {
    try {
      const keys = await this.redisClient.keys(`${this.REDIS_PREFIX}*`);
      for (const key of keys) {
        const sessionId = key.replace(this.REDIS_PREFIX, "");
        const info = await this.redisClient.get(key);

        if (info) {
          const connectionInfo: ConnectionInfo = JSON.parse(info);
          const inactiveTime = Date.now() - connectionInfo.lastAccessed;

          // Close connections inactive for more than SESSION_TTL
          if (inactiveTime > this.SESSION_TTL * 1000) {
            await this.closeConnection(sessionId);
            console.log(`Cleaned up inactive session: ${sessionId}`);
          }
        }
      }
    } catch (error) {
      console.warn("Failed to clean up inactive Redis sessions:", error);
    }
  }

  // Graceful shutdown - close all connections and Redis
  async shutdown(): Promise<void> {
    console.log("Shutting down connection manager...");

    // Close all SSH connections
    for (const [sessionId, conn] of this.connections.entries()) {
      try {
        conn.end();
        console.log(`Closed SSH connection for session ${sessionId}`);
      } catch (error) {
        console.error(
          `Failed to close SSH connection for ${sessionId}:`,
          error
        );
      }
    }

    // Clear the connections map
    this.connections.clear();

    // Close Redis connection
    await this.redisClient.quit();
    console.log("Redis connection closed");
  }
}

export const connectionManager = new ConnectionManager();
