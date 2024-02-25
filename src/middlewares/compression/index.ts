import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'
import { minify } from 'html-minifier-terser'
import type { ICompressionMiddleware } from './index-interfaces'

export class CompressionMiddleware implements ICompressionMiddleware {
    #contentTypes: string

    constructor() {
        this.#contentTypes = 'application/json; charset=utf-8'
    }

    async #convertResponseToString(response: unknown): Promise<string> {
        let text = ''

        if (isHtml(response)) {
            // Minify html
            text = await minify(response, {
                collapseWhitespace: true,
                removeComments: true,
                preserveLineBreaks: false,
                minifyJS: true,
                minifyCSS: true,
            })
        } else if (typeof response === 'object') {
            text = JSON.stringify(response, null, 0)
        } else {
            text = response as string
        }

        return text
    }

    #setHeaderContentType(response: unknown): string {
        let contentType = 'application/json; charset=utf-8'

        if (isHtml(response)) {
            contentType = 'text/html; charset=utf8'
        } else if (typeof response === 'object') {
            contentType = 'application/json; charset=utf-8'
        } else {
            contentType = 'text/plain; charset=utf8'
        }

        return contentType
    }

    public handle(): Elysia {
        const app = new Elysia({
            name: 'Compression',
        })

        app.onAfterHandle(async (ctx) => {
            this.#contentTypes = this.#setHeaderContentType(ctx.response)

            // Change response to string
            const text = await this.#convertResponseToString(ctx.response)
            // Change string to uint8array
            const encodeUint8Array = new TextEncoder().encode(text)
            // Compress uint8array
            const zip = Bun.gzipSync(encodeUint8Array, {
                level: 9,
                memLevel: 9,
            })

            ctx.set.headers['Content-Encoding'] = 'gzip'

            return new Response(zip, {
                headers: {
                    'Content-Type': this.#contentTypes,
                },
                status: Number(ctx.set.status),
            })
        })

        return app
    }
}
