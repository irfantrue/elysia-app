import { Elysia } from 'elysia'

export class Websocket {
    public handle(): Elysia {
        const app = new Elysia({
            name: 'Websocket',
            websocket: {
                idleTimeout: 10, // 2min
                maxPayloadLength: 16 * 1024 * 1024, // 16mb
            },
        })

        app.ws('/ws', {
            open: (ws) => {
                console.log('open', ws.id)
                ws.subscribe('chat')
            },

            message: async (ws, message) => {
                console.log(ws.id, message)
                ws.publish('chat', message)
                ws.send(message)
            },

            close: (ws, code, message) => {
                console.log('tutup')
                console.log(code, message)
            },
        })

        return app
    }
}
