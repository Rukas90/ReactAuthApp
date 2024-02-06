type BagItem<T> = {
    value: T | undefined
    has: boolean
}

export class Bag {
    protected collection: Map<string, any>

    constructor(initialValues?: Record<string, any>) {
        this.collection = new Map<string, any>()

        if (initialValues) {
            for (const [key, value] of Object.entries(initialValues)) {
                this.collection.set(key, value);
            }
        }
    }

    /**
     * Sets a key-value pair in the Bag collection.
     *
     * @param <T> - Generic type parameter for the value to be stored.
     * @param {string} key - The key associated with the value to store.
     * @param {T} value - The value to be stored in the Bag.
    */
    Set = <T>(key: string, value: T) : void => {
        this.collection.set(key, value)
    }

    /**
     * Attempts to retrieve a value from the Bag collection using the provided key.
     * Returns an object containing the value and a boolean indicating if the key was found.
     *
     * @param <T> - Generic type parameter for the value to be retrieved.
     * @param {string} key - The key for retrieving the value.
     * @param {T} [defaultValue] - A default value to return if the key is not found.
     * @returns {BagItem<T>} An object containing the retrieved value and a boolean indicating retrieval status.
    */
    TryGet = <T>(key: string, defaultValue?: T) : BagItem<T> => {
        const has = this.collection.has(key)
        const value = has ? this.collection.get(key) : defaultValue

        return {
            value,
            has
        }
    }
    /**
     * Checks if a specific key exists in the Bag collection.
     *
     * @param {string} key - The key to check for existence in the Bag.
     * @returns {boolean} True if the key exists, false otherwise.
    */
    Has = (key: string) : boolean => this.collection.has(key)

    /**
     * Clears all values from the Bag collection
    */
    Clear = () : void => this.collection.clear()
}