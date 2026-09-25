/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Resilient IndexedDB Key-Value Store.
 * Provides high-capacity client-side persistence (hundreds of megabytes)
 * to store optimized image data URLs and custom uploads without ever
 * hitting localStorage's strict ~5MB quota.
 */

const DB_NAME = 'tt_portfolio_idb_v1';
const DB_VERSION = 1;
const STORE_NAME = 'keyval';

class IndexedDbService {
  private dbPromise: Promise<IDBDatabase | null> | null = null;
  private memoryCache = new Map<string, string>();

  private getDB(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return Promise.resolve(null);
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve) => {
        try {
          const req = window.indexedDB.open(DB_NAME, DB_VERSION);

          req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              db.createObjectStore(STORE_NAME);
            }
          };

          req.onsuccess = () => {
            resolve(req.result);
          };

          req.onerror = (e) => {
            console.warn('IndexedDB failed to open, using memory cache fallback:', e);
            resolve(null);
          };

          req.onblocked = () => {
            console.warn('IndexedDB open blocked.');
            resolve(null);
          };
        } catch (err) {
          console.warn('IndexedDB initialization failed:', err);
          resolve(null);
        }
      });
    }

    return this.dbPromise;
  }

  /**
   * Set an item in IndexedDB and in-memory cache
   */
  public async setItem(key: string, value: string): Promise<void> {
    this.memoryCache.set(key, value);
    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(value, key);
        req.onsuccess = () => resolve();
        req.onerror = () => {
          console.warn(`IndexedDB put failed for key "${key}"`);
          resolve();
        };
        tx.onabort = () => resolve();
      } catch (err) {
        console.warn(`IndexedDB transaction error for key "${key}":`, err);
        resolve();
      }
    });
  }

  /**
   * Get an item from IndexedDB (or memory cache)
   */
  public async getItem(key: string): Promise<string | null> {
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key) || null;
    }

    const db = await this.getDB();
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => {
          const val = req.result as string | undefined;
          if (val !== undefined && val !== null) {
            this.memoryCache.set(key, val);
            resolve(val);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  /**
   * Synchronously read from memory cache if already hydrated
   */
  public getItemSync(key: string): string | null {
    return this.memoryCache.get(key) || null;
  }

  /**
   * Remove an item from IndexedDB and memory cache
   */
  public async removeItem(key: string): Promise<void> {
    this.memoryCache.delete(key);
    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  /**
   * Prime the memory cache with all keys currently in IndexedDB
   */
  public async primeCache(): Promise<void> {
    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        if ('openCursor' in store) {
          const req = store.openCursor();
          req.onsuccess = () => {
            const cursor = req.result;
            if (cursor) {
              this.memoryCache.set(String(cursor.key), String(cursor.value));
              cursor.continue();
            } else {
              resolve();
            }
          };
          req.onerror = () => resolve();
        } else {
          resolve();
        }
      } catch {
        resolve();
      }
    });
  }
}

export const indexedDbService = new IndexedDbService();
