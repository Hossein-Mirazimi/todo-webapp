import fs from 'fs/promises';
import path from 'path';
import { logger } from './logger';


interface CacheInterface {
    get(key: string): Promise<string | null>;
    set(key: string, content: string, ttl: number): Promise<void>;
    delete(key: string): Promise<void>;
}
export class InMemoryCache implements CacheInterface {
    private cache = new Map<string, {content: string; expiresAt: number}>();

    async get(key: string): Promise<string | null> {
        const entry = this.cache.get(key);
        if (!entry || Date.now() > entry.expiresAt) {
            this.delete(key);
            return null;
        }
        return entry.content;
    }
    async set(key: string, content: string, ttl: number) {
        this.cache.set(key, { content, expiresAt: Date.now() + ttl * 1000 })
    }

    async delete (key: string) {
        this.cache.delete(key)
    }
}

interface CacheEntry {
    content: string;
    expiresAt: number;
}

export class FileBaseCache implements CacheInterface {
    private cacheDir: string;
  
    constructor(cacheDir: string) {
      this.cacheDir = cacheDir;
    }
  
    private async ensureCacheDir(): Promise<void> {
      try {
        await fs.mkdir(this.cacheDir, { recursive: true });
      } catch (error) {
        logger.error('[FileBaseCache] Failed to ensure cache directory:', error);
      }
    }
  
    private getFilePath(key: string): string {
      const sanitizedKey = key.replace(/[^a-zA-Z0-9-_]/g, '_');
      return path.join(this.cacheDir, `${sanitizedKey}.json`);
    }
  
    async get(key: string): Promise<string | null> {
      await this.ensureCacheDir();
      const filePath = this.getFilePath(key);
  
      try {
        const data = JSON.parse(await fs.readFile(filePath, 'utf-8')) as CacheEntry;
  
        if (Date.now() > data.expiresAt) {
          await this.delete(key);
          return null;
        }
  
        logger.log('[FileBaseCache] Cache hit:', key);
        return data.content;
      } catch (error) {
        if (error.code === 'ENOENT') {
          // File does not exist
          logger.log('[FileBaseCache] Cache miss:', key);
          return null;
        }
        logger.error('[FileBaseCache] Error reading cache file:', error);
        return null;
      }
    }
  
    async set(key: string, content: string, ttl: number): Promise<void> {
      await this.ensureCacheDir();
      const filePath = this.getFilePath(key);
      const data: CacheEntry = {
        content,
        expiresAt: Date.now() + ttl * 1000,
      };
  
      try {
        await fs.writeFile(filePath, JSON.stringify(data), 'utf-8');
        logger.log('[FileBaseCache] Cache set:', key);
      } catch (error) {
        logger.error('[FileBaseCache] Error writing cache file:', error);
      }
    }
  
    async delete(key: string): Promise<void> {
      await this.ensureCacheDir();
      const filePath = this.getFilePath(key);
  
      try {
        await fs.unlink(filePath);
        logger.log('[FileBaseCache] Cache deleted:', key);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          logger.error('[FileBaseCache] Error deleting cache file:', error);
        }
      }
    }
  }


export class CacheManager {
    private backend: CacheInterface;
  
    constructor(backend: CacheInterface) {
      this.backend = backend;
    }
  
    async get(key: string): Promise<string | null> {
      return this.backend.get(key);
    }
  
    async set(key: string, content: string, ttl: number): Promise<void> {
      await this.backend.set(key, content, ttl);
    }
  
    async delete(key: string): Promise<void> {
      await this.backend.delete(key);
    }
}