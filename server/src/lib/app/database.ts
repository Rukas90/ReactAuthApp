import { PrismaClient } from "#prisma/client"
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

class Database {
    #pool: Pool | null = null
    #adapter: PrismaPg | null = null
    #client: PrismaClient | null = null

    async connect(connectionString: string): Promise<void> {
        if (this.#client) {
            console.log("Already connected")
            return
        }
        this.#pool = new Pool({ connectionString })
        this.#adapter = new PrismaPg(this.#pool)
        this.#client = new PrismaClient({ adapter: this.#adapter })

        await this.#client.$connect()
    }
    async disconnect(): Promise<void> {
        try {
            if (this.#client) {
                await this.#client.$disconnect()
                this.#client = null
            }
            if (this.#pool) {
                await this.#pool.end()
                this.#pool = null
            }
            this.#adapter = null
        }
        finally {
            console.log("Database disconnected")
        }
    }
    get client(): PrismaClient {
        if (!this.#client) {
            throw new Error("Database not connected. Call connect() first.")
        }
        return this.#client
    }
}
export const database = new Database()