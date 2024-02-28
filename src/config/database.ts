import { MongoProvider } from './provider/mongo'

export class Database {
    readonly #mongo: MongoProvider

    constructor() {
        this.#mongo = new MongoProvider()
    }

    public static connect(): void {
        void new Database().#mongoClient()
    }

    /**
     * --------------------------------------------------------------------------
     * Mongodb Connection
     * --------------------------------------------------------------------------
     * For configuration issue just see the file imported
     */
    async #mongoClient(): Promise<void> {
        await this.#mongo.connect()
    }
}
