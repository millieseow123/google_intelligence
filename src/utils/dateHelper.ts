import { HistoryItem } from "@/types/history"
import { format } from "date-fns"

export const groupHistoryByTime = (history: HistoryItem[]) => {
        const today = format(new Date(), 'yyyy-MM-dd')
        const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')

        const grouped: Record<'Today' | 'Yesterday' | 'Older', HistoryItem[]> = {
            Today: [],
            Yesterday: [],
            Older: [],
        }

        history.forEach((item: HistoryItem) => {
            const date = format(new Date(item.createdAt), 'yyyy-MM-dd')
            if (date === today) grouped.Today.push(item)
            else if (date === yesterday) grouped.Yesterday.push(item)
            else grouped.Older.push(item)
        })

        return Object.entries(grouped)
            .filter(([, items]) => items.length > 0)
            .map(([label, items]) => ({ label, items }))
    }