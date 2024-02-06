import { AES, enc } from "crypto-ts"
import { IDBPDatabase, openDB, deleteDB } from "idb"

const { Utf8 } = enc

// Represents a simple cache key with a name
export type CacheKey = {
    name: string 
}
// Represents a more complex cache key for IndexedDB with a name and database
export type CacheDBKey = {
    name: string
    database: string
}
// Defines the structure for cache expiration
export type CacheExpire = {
    date: Date // The date when the item was stored
    life: number // The lifespan of the cache item in milliseconds
}
// Properties for setting a cache value
export type CacheProps<T> = {
    key: CacheKey | CacheDBKey, // The key to store the item under
    fallback?: CacheKey | CacheDBKey | undefined
    value: T, // The value to be stored
    life?: number, // Optional lifespan of the item
    singleUse?: boolean, // Optional flag for single use
    encode?: boolean, // Flag indicating if the value should be base64 encoded
    password?: string // Optional password for AES encryption
}
// Enum for possible statuses of a cache retrieval operation
export enum CacheStatus {
    Success,
    Expired,
    NotFound,
    Invalid
}
// Response type for cache retrieval operations
export type CacheResponse<T> = {
    value: T | undefined // The retrieved value or undefined
    status: CacheStatus // The status of the retrieval operation
}

export enum CacheLocation { 
    Nowhere, 
    LocalStorage, 
    IndexedDB 
}

// Generic type representing a cached item
type CacheItem<T> = {
    value: T // The actual value being stored
    expiration?: CacheExpire | undefined // Optional expiration details
    singleUse?: boolean // Flag indicating if the item should be deleted after first use
}

/**
 * Saves a value in the cache. Encrypts and encodes the value if specified. 
 * Stores the value in localStorage or IndexedDB based on the provided key.
 *
 * @param {CacheProps<T>} { key, value, life, singleUse, encode, password } - Cache properties.
 */
export const SetValue = async <T> ({ key, fallback, value, life, singleUse, encode, password }: CacheProps<T>) : Promise<CacheLocation> => {

    try {
        const item : CacheItem<T> = {
            value: value,
            expiration: life === undefined ? undefined : {
                date: new Date(),
                life: life
            },
            singleUse: singleUse
        }
        let text = JSON.stringify(item)

        if (encode) {
            text = btoa(text)
        }
        if (password) {
            text = AES.encrypt(text, password).toString()
        }
        if (!('database' in key)) {
            try {
                localStorage.setItem(key.name, text)

                return CacheLocation.LocalStorage
            } catch (e) {
                
                if (!(e instanceof DOMException && e.name === 'QuotaExceededError')) {
                    throw e
                }
                // Fallback to IndexedDB if localStorage is full
                if (fallback && 'database' in fallback) {
                    return await PushToDatabase(fallback, text)
                }
                return CacheLocation.Nowhere
            }
        }
        if (await PushToDatabase(key, text) === CacheLocation.IndexedDB) {
            return CacheLocation.IndexedDB
        }
        if (!fallback || ('database' in fallback)) {
            return CacheLocation.Nowhere
        }
        try {
            localStorage.setItem(fallback.name, text)
            return CacheLocation.LocalStorage

        } catch (e) {
            return CacheLocation.Nowhere
        }
    }
    catch (error) {
        console.error('Error while caching data:', error)
        return CacheLocation.Nowhere
    }
}

/**
 * Pushes a text value into IndexedDB.
 *
 * @param {CacheDBKey} key - The key specifying the IndexedDB name and object store.
 * @param {string} text - The text to be stored in IndexedDB.
 */
const PushToDatabase = async (key: CacheDBKey, text: string) : Promise<CacheLocation> => {

    const db = await OpenDB(key)
    
    try {
        const tx = db.transaction(key.name, 'readwrite')

        await tx.store.put(text, key.name)
        await tx.done

        return CacheLocation.IndexedDB
    }
    catch (error) {

        console.error('Error saving data to IndexedDB:', error)
        return CacheLocation.Nowhere
    }
    finally {
        db.close()
    }
}
/**
 * Retrieves a cached value using the provided key. Decrypts and decodes the value if necessary. 
 * Checks for expiration and single-use conditions. Returns the value with its retrieval status.
 *
 * @param {CacheKey | CacheDBKey} key - The cache key for retrieval.
 * @param {boolean} [encoded=false] - Flag indicating if the value is base64 encoded.
 * @param {string} [password] - Optional AES decryption password.
 * @returns {Promise<CacheResponse<T>>} Response object with value and status.
 */
export const GetValue = async <T> (key: CacheKey | CacheDBKey, encoded?: boolean, password?: string) : Promise<CacheResponse<T>> => {

    try {
        let text: string | null

        if (!('database' in key)) {
            text = localStorage.getItem(key.name)
        } else {
            text = await PullFromDatabase(key)
        }
        if (text === null) {
            return {
                value: undefined,
                status: CacheStatus.NotFound
            }
        }
        if (password) {
            try {
                const bytes = AES.decrypt(text, password)
                text = bytes.toString(Utf8)
            }
            catch (error) {
                console.error("Cache value could not be decrypted.", error)
                return {
                    value: undefined,
                    status: CacheStatus.Invalid
                }
            }
        }
        if (encoded) {
            try {
                text = atob(text)
            }
            catch (error) {
                console.error("Cache value could not be decoded.", error)
                return {
                    value: undefined,
                    status: CacheStatus.Invalid
                }
            }
        }
        try {
            const item: CacheItem<T> = JSON.parse(text)
    
            const isExpired = item.expiration && Date.now() > new Date(item.expiration.date).getTime() + item.expiration.life
    
            if (isExpired || item.singleUse) {
                await DropValue(key)
            }
            if (isExpired) {
                return {
                    value: undefined,
                    status: CacheStatus.Expired
                }
            }
            return {
                value: item.value,
                status: CacheStatus.Success
            }
        }
        catch (error) {
            console.error("Cache value could not be parsed and returned.", error)

            return {
                value: undefined,
                status: CacheStatus.Invalid
            }
        }
    }
    catch (error) {
        console.error('Error retrieving data:', error)
        return {
            value: undefined,
            status: CacheStatus.Invalid
        }
    }
}
/**
 * Pulls a text value from IndexedDB.
 *
 * @param {CacheDBKey} key - The key specifying the IndexedDB name and object store.
 * @returns {Promise<string | null>} The text retrieved from IndexedDB, or null if not found.
 */
const PullFromDatabase = async (key: CacheDBKey): Promise<string | null> => {

    const db = await OpenDB(key)

    try {
        const tx   = db.transaction(key.name, 'readonly')
        const text = await tx.store.get(key.name)

        return text
    } catch (error) {

        console.error('Error retrieving data from IndexedDB:', error)
        return null
    }
    finally {
        db.close()
    }
}
/**
 * Removes a value from the cache. Works with both localStorage and IndexedDB.
 *
 * @param {CacheKey | CacheDBKey} key - The key indicating where the value is stored.
 */
export const DropValue = async (key: CacheKey | CacheDBKey) => {
    if ('database' in key) {
        await RemoveFromDatabase(key)
        
    } else {
        localStorage.removeItem(key.name)
    }
}
/**
 * Removes a value from IndexedDB.
 *
 * @param {CacheDBKey} key - The key specifying the IndexedDB name and object store to remove the value from.
 */
const RemoveFromDatabase = async (key: CacheDBKey): Promise<void> => {
    const db = await OpenDB(key)

    try {
        const tx = db.transaction(key.name, 'readwrite')

        await tx.store.delete(key.name)
        await tx.done

    } catch (error) {
        console.error('Error removing data from IndexedDB:', error)

    } finally {
        db.close()
    }
}

/**
 * Checks if a value exists in the cache for the specified key.
 * Works with both localStorage and IndexedDB.
 *
 * @param {CacheKey | CacheDBKey} key - The key to check in the cache.
 * @returns {Promise<boolean>} True if a value exists for the key, false otherwise.
 */
export const HasValue = async (key: CacheKey | CacheDBKey) : Promise<boolean> => {
    try {
        if ('database' in key) {
            // Check in IndexedDB
            const value = await PullFromDatabase(key);
            return value !== null;
        } else {
            // Check in localStorage
            return localStorage.getItem(key.name) !== null;
        }
    } catch (error) {
        console.error('Error checking value existence:', error);
        return false
    }
}

const OpenDB = async (key: CacheDBKey) : Promise<IDBPDatabase> => {
    return await openDB(key.database, 2, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(key.name)) {
                db.createObjectStore(key.name)
            }
        },
    })
}

/**
 * Deletes the entire IndexedDB database.
 *
 * @param {string} database - The name of the database to delete.
 */
export const PurgeDB = async (database: string) => {
    try {
        await deleteDB(database);
    } catch (error) {
        console.error('Error deleting database:', error);
    }
}