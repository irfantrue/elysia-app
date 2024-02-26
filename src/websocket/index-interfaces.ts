type IActions = 'JOIN'

export interface IWebsokcetMessage {
    action: IActions
    content: {
        text: string
        url: string
        ext: string
    }
}
