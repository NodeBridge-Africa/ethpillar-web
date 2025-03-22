// lib/connectionManager.ts
import { Redis } from "ioredis";
import { Client } from "ssh2";

interface ConnectionInfo {
  host: string;
  username: string;
  password: string;
  port: number;
  lastAccessed: number;
}

class ConnectionManager {
  private connections: Map<string, Client>;
  private redis: Redis;
  private readonly REDIS_PREFIX = "ssh_session:";
  private readonly SESSION_TTL = 10200; // 2 hour

  constructor() {
    this.connections = new Map();
    this.redis = new Redis(process.env.REDIS_URL || "");
    this.startCleanupInterval();
  }

  private startCleanupInterval() {
    // Clean up inactive connections every 5 minutes
    setInterval(() => this.cleanupInactiveConnections(), 5 * 60 * 1000);
  }

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
      await this.redis.setex(
        `${this.REDIS_PREFIX}${sessionId}`,
        this.SESSION_TTL,
        JSON.stringify({
          ...connectionInfo,
          lastAccessed: Date.now(),
        })
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
      const info = await this.redis.get(`${this.REDIS_PREFIX}${sessionId}`);

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
      } else {
        throw new Error("No active session login again");
      }
    }

    // Update last accessed time
    await this.redis.expire(
      `${this.REDIS_PREFIX}${sessionId}`,
      this.SESSION_TTL
    );
    return conn;
  }

  async closeConnection(sessionId: string): Promise<void> {
    const conn = this.connections.get(sessionId);
    if (conn) {
      conn.end();
      this.connections.delete(sessionId);
    }
    await this.redis.del(`${this.REDIS_PREFIX}${sessionId}`);
  }

  private async cleanupInactiveConnections() {
    const keys = await this.redis.keys(`${this.REDIS_PREFIX}*`);
    for (const key of keys) {
      const sessionId = key.replace(this.REDIS_PREFIX, "");
      const info = await this.redis.get(key);

      if (info) {
        const connectionInfo: ConnectionInfo = JSON.parse(info);
        const inactiveTime = Date.now() - connectionInfo.lastAccessed;

        // Close connections inactive for more than SESSION_TTL
        if (inactiveTime > this.SESSION_TTL * 1000) {
          await this.closeConnection(sessionId);
        }
      }
    }
  }
}

export const connectionManager = new ConnectionManager();
