export enum Sender {
    USER = 'user',
    BOT = 'bot',
}

export interface ChatMessage {
    text: any[]
    file?: File | null
    sender: Sender
}