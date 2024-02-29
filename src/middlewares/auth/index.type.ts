export interface IUserInfo {
    user_info: {
        id: number
        full_name: string
    }
}

export interface DecoratorBaseCustomAuth {
    request: Record<string, unknown>
    store: Record<string, unknown>
    derive: Record<string, unknown>
    resolve: Record<string, unknown> & IUserInfo
}
