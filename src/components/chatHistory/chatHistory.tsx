import { Box, Paper } from '@mui/material'
import { renderSlateContent } from '@/utils/renderSlateContent'
import FilePreview from '../filePreview/filePreview'
import { ChatMessage, Sender } from '@/types/chat'
import { ArrowDownward } from '@mui/icons-material'
import { useEffect, useRef, useState } from 'react'
import RoundIconButton from '../roundIconButton/roundIconButton'

interface ChatHistoryProps {
    messages: ChatMessage[]
}

export default function ChatHistory({ messages }: ChatHistoryProps) {
    if (messages.length === 0) return null

    const scrollRef = useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    const scrollToBottom = () => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            const isAtBottom =
                container.scrollHeight - container.scrollTop <= container.clientHeight + 10;
            setShowScrollButton(!isAtBottom);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const isNearBottom =
            container.scrollHeight - container.scrollTop <= container.clientHeight + 650;

        if (isNearBottom) {
            scrollToBottom();
        }
    }, [messages]);


    return (
        <Paper
            ref={scrollRef}
            sx={{
                flexGrow: 1,
                overflowY: 'auto',
                
                minHeight: 0,
                bgcolor: 'black',
                p: 2,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
            }}
        >
            {showScrollButton && (
                <RoundIconButton
                    onClick={scrollToBottom}
                    icon={<ArrowDownward fontSize="small" />}
                    sx={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bottom: '200px',
                        zIndex: 10,
                    }}
                />
            )}
            {messages.slice().map((msg, idx) => (
                <Box
                    key={idx}
                    sx={{
                        display: 'flex',
                        justifyContent: msg.sender === Sender.USER ? 'flex-end' : 'flex-start',
                        mb: 2,
                    }}
                >
                    <Box
                        sx={{
                            px: 2,
                            py: 1.5,
                            borderRadius: 2,
                            boxShadow: 1,
                            maxWidth: '80%',
                            wordBreak: 'break-word',
                            bgcolor: msg.sender === Sender.USER ? '#fff' : '#2e2e2e',
                            color: msg.sender === Sender.USER ? 'black' : 'white',
                        }}
                    >
                        {msg.file && (
                            <Box>
                                <FilePreview file={msg.file} showRemove={false} />
                            </Box>
                        )}
                        {renderSlateContent(msg.text)}
                    </Box>
                </Box>
            ))}
        </Paper>
    )
}
