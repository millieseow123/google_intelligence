import { useLazyQuery } from '@apollo/client';
import { GENERATE_CHAT_TITLE } from '@/lib/queries';
import { useRef } from 'react';

export function useChatLLM({
    selectedId,
    setHistory
}: {
    selectedId: string | null;
    setHistory: React.Dispatch<React.SetStateAction<any[]>>;
    setMessages: React.Dispatch<React.SetStateAction<any[]>>;
}) {
    const abortControllerRef = useRef<AbortController | null>(null);

    const [generateTitle] = useLazyQuery(GENERATE_CHAT_TITLE, {
        onCompleted: (data) => {
            const aiTitle = data?.generateChatTitle || 'New Chat';
            if (selectedId) {
                setHistory(prev =>
                    prev.map(item =>
                        item.id === selectedId ? { ...item, title: aiTitle } : item
                    )
                );
            }
        },
        onError: () => {
            console.warn('Title generation failed, falling back to default.');
            if (selectedId) {
                setHistory(prev =>
                    prev.map(item =>
                        item.id === selectedId ? { ...item, title: 'Untitled Chat' } : item
                    )
                );
            }
        },
    });


    const generateLLMResponse = async (prompt: string): Promise<string | null> => {
        abortControllerRef.current = new AbortController();

        try {
            const response = await fetch("http://localhost:8000/graphql", {
                method: "POST",
                signal: abortControllerRef.current.signal,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `
              query($prompt: String!) {
                generateAiResponse(prompt: $prompt)
              }
            `,
                    variables: { prompt },
                }),
            });

            const result = await response.json();
            return result?.data?.generateAiResponse ?? 'No response';
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log("LLM generation aborted");
                return null;
            } else {
                console.error("LLM generation failed:", error);
                return 'Sorry, something went wrong.';
            }
        }
    };

    const stopGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    return { generateTitle, generateLLMResponse, stopGeneration };
}
