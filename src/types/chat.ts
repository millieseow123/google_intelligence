export enum Sender {
    USER = 'user',
    BOT = 'bot',
}

export interface ChatMessage {
    sender: Sender
    text: any[]
    file?: File | null
    isLoading?: boolean
}