"use client";

import { Box, Paper, Button } from '@mui/material';
import { useState } from 'react';
import { renderSlateContent } from '@/utils/renderSlateContent';
import FilePreview from '../filePreview/filePreview';
import { ChatMessage, Sender } from '@/types/chat';
import LoadingSpinner from '../loadingSpinner/loadingSpinner';
import LoadingDots from '../loadingDots/loadingDots';
import TextEditor from '../textEditor/textEditor';
import { withMentions } from '@/plugins/mentionPlugin';
import { createEditor, Descendant } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import { slateToMarkdown } from '@/utils/slateToMarkdown';
import { sendEmail } from '@/utils/sendEmail';

interface ChatHistoryProps {
    messages: ChatMessage[]
    scrollRef?: React.RefObject<HTMLDivElement | null>
    loading?: boolean
    onUpdateMessage?: (id: string, value: Descendant[]) => void
}

export default function ChatHistory({ messages, scrollRef, loading, onUpdateMessage }: ChatHistoryProps) {
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editor] = useState(() => withMentions(withReact(createEditor())))
    const [editValue, setEditValue] = useState<Descendant[]>([])

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
                    borderRadius: 1,
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
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {messages.slice().map((msg, idx) => {
                if (
                    msg.sender === Sender.BOT &&
                    !msg.isLoading &&
                    (!msg.text || msg.text.length === 0 || msg.text[0]?.children?.[0]?.text.trim() === '')
                ) {
                    return null;
                }
                return (
                <Box
                    key={msg.id}
                    sx={{
                        display: 'flex',
                        justifyContent: msg.sender === Sender.USER ? 'flex-end' : 'flex-start',
                        mb: 2,
                    }}
                >
                    {editingId === msg.id ? (
                        <Box sx={{ width: '100%' }}>
                            <TextEditor
                                editor={editor}
                                value={editValue}
                                onChange={setEditValue}
                                onSubmit={() => {}}
                                isGenerating={false}
                                onStop={() => {}}
                                voiceInput={{
                                    transcript: '',
                                    listening: false,
                                    startListening: () => {},
                                    stopListening: () => {},
                                    resetTranscript: () => {},
                                }}
                                fileUpload={{ uploadedFile: null, onFileSelect: () => {} }}
                            />
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Button variant="contained" size="small" onClick={() => {
                                    onUpdateMessage && onUpdateMessage(msg.id, editValue);
                                    setEditingId(null);
                                }}>✅ Save</Button>
                                <Button variant="outlined" size="small" onClick={async () => {
                                    const markdown = slateToMarkdown(editValue);
                                    const [subjectLine, ...rest] = markdown.split('\n');
                                    await sendEmail({ to: '', subject: subjectLine, body: rest.join('\n') });
                                }}>✉️ Send via Gmail</Button>
                            </Box>
                        </Box>
                    ) : (
                    <Box
                        sx={{
                            px: 1.5,
                            py: 1,
                            borderRadius: 1,
                            boxShadow: 1,
                            maxWidth: '80%',
                            wordBreak: 'break-word',
                            bgcolor: msg.sender === Sender.USER ? '#fff' : '#2e2e2e',
                            color: msg.sender === Sender.USER ? 'black' : 'white',
                            position: 'relative',
                        }}
                    >
                        {msg.file && (
                            <Box>
                                <FilePreview file={msg.file} showRemove={false} />
                            </Box>
                        )}
                        {msg.isLoading ? <LoadingDots /> : renderSlateContent(msg.text)}
                        {msg.isEmail && (
                            <Button
                                size="small"
                                onClick={() => {
                                    setEditingId(msg.id);
                                    setEditValue(msg.text);
                                }}
                                sx={{ position: 'absolute', top: -28, right: 0 }}
                            >✏️ Edit</Button>
                        )}
                    </Box>
                    )}
                </Box>)
            })}
        </Paper>
    )
}
