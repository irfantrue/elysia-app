import { type Elysia } from 'elysia'

export interface ICompressionMiddleware {
    handle: () => Elysia
}
