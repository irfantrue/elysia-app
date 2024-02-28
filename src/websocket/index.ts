import { Elysia } from 'elysia'
import { ChatRoomModel } from 'models/chat/chat-model'

export class WebSocket {
    public handle(): Elysia {
        const app = new Elysia({
            name: 'WebSocket',
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

                // const chatRoom = new ChatRoomModel({
                //     type: 'room',
                //     room_id: '',
                //     max_members: 10,
                //     participants: [],
                //     messages: [],
                // })

                // await chatRoom.save()

                const chatRoom = await ChatRoomModel.isRoomExists('')

                await chatRoom.addMember(chatRoom.room_id, [])
            },

            close: (ws, code, message) => {
                console.log('tutup')
                console.log(code, message)
            },
        })

        return app
    }
}
