import { type Elysia } from 'elysia'

export interface ILoggingMiddleware {
    handle: () => Elysia
}
