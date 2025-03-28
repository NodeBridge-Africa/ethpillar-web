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
  private redis: Redis | null = null;
  private redisAvailable = false;
  private readonly REDIS_PREFIX = "ssh_session:";
  private readonly SESSION_TTL = 10200; // 2 hour
  private localSessionStorage: Map<string, string> = new Map();

  constructor() {
    this.connections = new Map();

    // Try to connect to Redis, but provide fallback if not available
    try {
      this.redis = new Redis(process.env.REDIS_URL || "", {
        // Add retry strategy, if Redis is not available after 3 tries, fall back to local storage
        retryStrategy: (times) => {
          if (times > 3) {
            // Stop retrying
            console.warn(
              "Redis connection failed after 3 attempts, using in-memory session storage"
            );
            return null;
          }
          // Try reconnecting after a delay (ms)
          return Math.min(times * 100, 3000);
        },
        enableOfflineQueue: false,
      });

      this.redis.on("connect", () => {
        console.log("Redis connected successfully");
        this.redisAvailable = true;
      });

      this.redis.on("error", (err) => {
        console.warn("Redis connection error:", err.message);
        this.redisAvailable = false;
      });
    } catch (error) {
      console.error("Failed to initialize Redis:", error);
      this.redis = null;
      this.redisAvailable = false;
    }

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

      // Store connection info in Redis or local storage
      const sessionData = JSON.stringify({
        ...connectionInfo,
        lastAccessed: Date.now(),
      });

      if (this.redisAvailable && this.redis) {
        try {
          await this.redis.setex(
            `${this.REDIS_PREFIX}${sessionId}`,
            this.SESSION_TTL,
            sessionData
          );
        } catch (error) {
          console.warn(
            "Failed to store session in Redis, using local storage:",
            error
          );
          this.localSessionStorage.set(sessionId, sessionData);
        }
      } else {
        this.localSessionStorage.set(sessionId, sessionData);
      }

      return sessionId;
    } catch (error) {
      throw error;
    }
  }

  async getConnection(sessionId: string): Promise<Client> {
    // Check if connection exists in memory
    let conn = this.connections.get(sessionId);

    if (!conn) {
      // Try to recover connection from Redis or local storage
      let info: string | null = null;

      if (this.redisAvailable && this.redis) {
        try {
          info = await this.redis.get(`${this.REDIS_PREFIX}${sessionId}`);
        } catch (error) {
          console.warn("Failed to get session from Redis:", error);
        }
      }

      // Try local storage if Redis failed or is not available
      if (!info) {
        info = this.localSessionStorage.get(sessionId) || null;
      }

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

  private async updateSessionExpiry(sessionId: string) {
    if (this.redisAvailable && this.redis) {
      try {
        await this.redis.expire(
          `${this.REDIS_PREFIX}${sessionId}`,
          this.SESSION_TTL
        );
      } catch (error) {
        console.warn("Failed to update session expiry in Redis:", error);
      }
    }

    // If using local storage, update the lastAccessed time
    const localSession = this.localSessionStorage.get(sessionId);
    if (localSession) {
      const session = JSON.parse(localSession);
      session.lastAccessed = Date.now();
      this.localSessionStorage.set(sessionId, JSON.stringify(session));
    }
  }

  async closeConnection(sessionId: string): Promise<void> {
    const conn = this.connections.get(sessionId);
    if (conn) {
      conn.end();
      this.connections.delete(sessionId);
    }

    // Remove from Redis if available
    if (this.redisAvailable && this.redis) {
      try {
        await this.redis.del(`${this.REDIS_PREFIX}${sessionId}`);
      } catch (error) {
        console.warn("Failed to delete session from Redis:", error);
      }
    }

    // Always remove from local storage
    this.localSessionStorage.delete(sessionId);
  }

  private async cleanupInactiveConnections() {
    // Clean up Redis sessions if available
    if (this.redisAvailable && this.redis) {
      try {
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
      } catch (error) {
        console.warn("Failed to clean up inactive Redis sessions:", error);
      }
    }

    // Clean up local storage sessions
    for (const [sessionId, infoStr] of this.localSessionStorage.entries()) {
      const connectionInfo: ConnectionInfo = JSON.parse(infoStr);
      const inactiveTime = Date.now() - connectionInfo.lastAccessed;

      // Close connections inactive for more than SESSION_TTL
      if (inactiveTime > this.SESSION_TTL * 1000) {
        await this.closeConnection(sessionId);
      }
    }
  }
}

export const connectionManager = new ConnectionManager();
