import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { DateTime } from 'luxon'
import { APIError } from 'middlewares/errors'
import type { IChatRoomMethods, IChatRoomModel, IChatRoomSchema } from './chat-type'

const ChatRoomSchema = new mongoose.Schema<IChatRoomSchema, IChatRoomModel, IChatRoomMethods>({
    room_id: { type: String, required: true, default: uuidv4() },
    type: { type: String, required: true, enum: ['room', 'personal'] },
    max_members: { type: Number },
    participants: [{ type: mongoose.Schema.ObjectId }],
    messages: [
        {
            sender: { type: mongoose.Schema.ObjectId, required: true },
            content: {
                text: { type: String, default: null },
                source: { type: String, default: null },
                ext: { type: String, default: null },
            },
            read_timestamp: [
                {
                    user: { type: mongoose.Schema.ObjectId, required: true },
                    timestamp: {
                        type: Date,
                        required: true,
                        default: DateTime.local(),
                    },
                },
            ],
            created_at: {
                type: Date,
                required: true,
                default: DateTime.local(),
            },
            updated_at: {
                type: Date,
                required: true,
                default: DateTime.local(),
            },
        },
    ],
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    versionKey: false,
})

ChatRoomSchema.static('isRoomExists', async function isRoomExists(roomId: string) {
    const chatRoom = await this.findOne({ room_id: roomId })

    if (chatRoom === null) {
        throw new APIError('Bad Request', 'Room not exists')
    }

    return chatRoom
})

ChatRoomSchema.methods.addMember = async function (roomId, user) {
    this.participants.push(...user)

    if (this.participants.length > this.max_members) {
        throw new APIError('Bad Request', 'Maximum member limit reached!')
    }

    await this.updateOne({ room_id: roomId }, {
        $push: {
            participants: user,
        },
    })
}

const ChatRoomModel = mongoose.model<IChatRoomSchema, IChatRoomModel>('Chat_Rooms', ChatRoomSchema)
export { ChatRoomModel }
