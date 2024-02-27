type IActions = 'JOIN'

export interface IMessage {
    content: {
        text: string | null
        source: string | null
        ext: string | null
    }
    sender: string
    timestamp: string
    read_timestamp: Array<{
        user: string
        timestamp: string
    }>
}

export interface IModelChat {
    type: 'room' | 'personal'
    room_id: string
    max_members: number
    participants: string[]
    messages: IMessage[]
}

// should interface payload
export interface IPayloadMessage {
    action: IActions
    // add more
}
