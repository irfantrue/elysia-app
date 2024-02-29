import { Elysia } from 'elysia'
import type { IUserInfo } from './index.type'

export class AuthMiddleware {
    public handle(): Elysia {
        const app = new Elysia()

        app.resolve((ctx) => {
            const user_detail: IUserInfo = {
                user_info: {
                    id: 1,
                    full_name: '',
                },
            }

            return user_detail
        })

        return app
    }
}
