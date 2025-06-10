export enum Sender {
    USER = 'user',
    BOT = 'bot',
}

export interface ChatMessage {
    id: string
    sender: Sender
    text: any[]
    file?: File | null
    isLoading?: boolean
    isEmail: boolean
}