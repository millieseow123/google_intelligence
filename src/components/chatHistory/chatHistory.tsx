import { Box, Paper } from '@mui/material';
import { renderSlateContent } from '@/utils/renderSlateContent';
import FilePreview from '../filePreview/filePreview';
import { ChatMessage, Sender } from '@/types/chat';
import LoadingSpinner from '../loadingSpinner/loadingSpinner';
import LoadingDots from '../loadingDots/loadingDots';

interface ChatHistoryProps {
    messages: ChatMessage[]
    scrollRef?: React.RefObject<HTMLDivElement | null>
    loading?: boolean
}

export default function ChatHistory({ messages, scrollRef, loading }: ChatHistoryProps) {
    if (messages.length === 0) return null

    if (loading) {
        return (
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'black',
                    borderRadius: 3,
                    height: '100%',
                }}
            >
                <LoadingSpinner />
            </Box>
        )
      }
    
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
            }}
        >
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
                            px: 1.5,
                            py: 1,
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
                        {msg.isLoading ? <LoadingDots /> : renderSlateContent(msg.text)}

                    </Box>
                </Box>
            ))}
        </Paper>
    )
}
