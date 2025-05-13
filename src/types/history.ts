import { ChatMessage } from "./chat";

export type GroupedHistory = {
    label: string 
    items: HistoryItem[]
}

export type HistoryItem = {
    id: string
    title: string
    createdAt: string
    messages: ChatMessage[]
  }