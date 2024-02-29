import { Elysia } from 'elysia'
import { AuthMiddleware } from 'middlewares/auth'
import type { DecoratorBaseCustomAuth } from 'middlewares/auth/index.type'
import { ChatRoomModel } from 'models/chat/chat-model'

export class WebSocket {
    public handle(): Elysia {
        const app = new Elysia<'', DecoratorBaseCustomAuth>({
            name: 'WebSocket',
            websocket: {
                idleTimeout: 10, // 2min
                maxPayloadLength: 16 * 1024 * 1024, // 16mb
            },
        })

        // Middleware
        app.use(new AuthMiddleware().handle())

        app.ws('/ws', {
            open: (ws) => {
                console.log('open', ws.id)
                ws.subscribe('chat')
            },

            message: async (ws, message) => {
                console.log(ws.data.user_info)
                ws.send(message)

                // const chatRoom = new ChatRoomModel({
                //     type: 'room',
                //     room_id: '',
                //     max_members: 10,
                //     participants: [],
                //     messages: [],
                // })

                // await chatRoom.save()

                // const chatRoom = await ChatRoomModel.isRoomExists('')

            // await chatRoom.addMember(chatRoom.room_id, [])
            },

            close: (ws, code, message) => {
                console.log('tutup')
                console.log(code, message)
            },
        })

        return app
    }
}
