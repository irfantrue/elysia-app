import { Elysia } from 'elysia'
import { type ILoggingMiddleware } from './index-interfaces'

export class LoggingMiddleware implements ILoggingMiddleware {
    #httpStatus(status: number): string {
        let response = ''

        if (status >= 100 && status < 400) {
            response = `\x1b[32m${status}\x1b[0m`
        } else if (status >= 400 && status < 500) {
            response = `\x1b[33m${status}\x1b[0m`
        } else {
            response = `\x1b[31m${status}\x1b[0m`
        }

        return response
    }

    public notFound(method: string, url: string, code: number): void {
        const httpStatus = this.#httpStatus(code)
        const timeRequest = `\x1b[35m${performance.now()}\x1b[0m`
        console.info(method, url, httpStatus, timeRequest)
    }

    public handle(): Elysia {
        const app = new Elysia({
            name: 'Logging Response',
        })

        app.onResponse((ctx) => {
            const httpStatus = this.#httpStatus(ctx.set.status as number)
            const timeRequest = `\x1b[35m${performance.now()}\x1b[0m`
            console.info(
                ctx.request.method,
                ctx.request.url,
                httpStatus,
                timeRequest,
            )
        })

        return app
    }
}
