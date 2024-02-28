import { Elysia } from 'elysia'
import {
    HttpStatusCode,
    type IErrorMiddleware,
} from './index-interfaces'
import { LoggingMiddleware } from 'middlewares/logging'

export class APIError extends Error {
    public statusCode: number
    public statusMessage: string

    constructor(code: keyof typeof HttpStatusCode, message: string) {
        super(message)
        this.statusCode = HttpStatusCode[code]
        this.statusMessage = code
    }
}

export class ErrorMiddleware implements IErrorMiddleware {
    public handle(): Elysia {
        const app = new Elysia({
            name: 'Handling Error',
        })

        app.error({ APIError: APIError })
            .onError((ctx) => {
                if (ctx.code === 'NOT_FOUND') {
                    ctx.set.status = 404
                    new LoggingMiddleware().notFound(
                        ctx.request.method,
                        ctx.request.url,
                        ctx.set.status,
                    )

                    return {
                        status: false,
                        message: 'NOT_FOUND',
                        error: `${ctx.request.url} unreachable`,
                    }
                }

                if (ctx.code === 'APIError') {
                    ctx.set.status = ctx.error.statusCode

                    return {
                        status: false,
                        message: ctx.error.statusMessage,
                        error: ctx.error.message,
                    }
                }

                if (ctx.code === 'VALIDATION') {
                    ctx.set.status = 422

                    return {
                        status: false,
                        message: 'VALIDATION',
                        error: JSON.parse(ctx.error.message),
                    }
                }

                console.error(ctx.error.stack)
                ctx.set.status = 500

                return {
                    status: false,
                    message: 'INTERNAL_SERVER_ERROR',
                    error: ctx.error.message,
                }
            })

        return app
    }
}
