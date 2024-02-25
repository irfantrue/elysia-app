import { Elysia } from 'elysia'

export class IndexRoutes {
    readonly #router: Elysia

    constructor() {
        this.#router = new Elysia()
    }

    public handle(): Elysia {
        this.#router.get('/', () => {
            const response = {
                status: true,
                message: 'success',
                result: 'Welcome Elysia ',
            }

            return response
        })
        this.#router.get('/html', async () => {
            const response = await Bun.file('src/views/index.html').text()

            return response
        })

        return this.#router
    }
}
