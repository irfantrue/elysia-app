import mongoose from 'mongoose'
import { MONGO } from '../../env.json'

export class MongoProvider {
    #connection!: mongoose.Connection

    public async connect(): Promise<void> {
        await mongoose.connect(MONGO as string)
        this.#connection = mongoose.connection
        console.log('Connected to MongoDB.')
    }

    public async disconnect(): Promise<void> {
        await this.#connection.close()
        console.log('MongoDB connection closed.')
    }
}
