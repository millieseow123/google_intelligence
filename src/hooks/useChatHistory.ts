import { useEffect, useState } from 'react';
import { HistoryItem } from '@/types/history';

export function useChatHistory() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const res = await fetch('http://localhost:8000/api/chats');
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                const data = await res.json();
                setHistory(data);
            } catch (err) {
                console.error('Failed to fetch chat history:', err);
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, []);

    return { history, setHistory, loading, error };
}
