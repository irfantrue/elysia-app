import type mongoose from 'mongoose'
import type { HydratedDocument, ObjectId } from 'mongoose'

type IMessage = mongoose.Document & {
    sender: ObjectId
    content: {
        text: string | null
        source: string | null
        ext: string | null
    }
    read_timestamp: Array<{
        user: mongoose.ObjectId
        timestamp: mongoose.Date
    }>
    created_at: mongoose.Date
    updated_at: mongoose.Date
}

export type IChatRoomSchema = mongoose.Document & {
    type: 'room' | 'personal'
    room_id: string
    max_members: number
    participants: mongoose.ObjectId[]
    messages: IMessage[]
    created_at: mongoose.Date
    updated_at: mongoose.Date
}

export interface IChatRoomMethods {
    addMember: (room_id: string, user: ObjectId[]) => Promise<void>
}

export type IChatRoomModel = mongoose.Model<
IChatRoomSchema, Record<string, unknown>, IChatRoomMethods> & {
    isRoomExists: (room_id: string) => Promise<HydratedDocument<IChatRoomSchema, IChatRoomMethods>>
}
