"use client"

import { useState } from 'react'
import { ReactEditor, withReact } from 'slate-react'
import { createEditor, Descendant, Text, Transforms } from 'slate'
import { Box, Typography, Paper } from '@mui/material'
import TextEditor from '../textEditor/textEditor'
import ChatHistory from '../chatHistory/chatHistory'
import { ChatMessage, Sender } from '@/types/chat'

import styles from './index.module.css'
import { useVoiceInput } from '@/hooks/useVoiceInput'

export default function ChatLayout() {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [editorValue, setEditorValue] = useState<Descendant[]>([
        {
            type: 'paragraph',
            children: [{ text: '' }]
        }
    ])
    const [editor] = useState(() => withReact(createEditor()))
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const {
        transcript,
        listening,
        startListening,
        stopListening,
        resetTranscript
    } = useVoiceInput()

    const handleSend = () => {
        const hasText = editorValue.some(node =>
            'children' in node && node.children.some(child => Text.isText(child) && child.text.trim() !== '')
        )

        if (!hasText && !uploadedFile) return
        setMessages(prev => [
            ...prev,
            { text: editorValue, file: uploadedFile, sender: Sender.USER },
            { text: [{ type: 'paragraph', children: [{ text: 'Waiting for bot...' }] }], sender: Sender.BOT },
        ])

        setEditorValue([
            {
                type: 'paragraph',
                children: [{ text: '' }],
            },
        ])
        setUploadedFile(null);
        resetTranscript();
        setIsGenerating(true)

        // TO REPLACE: Simulate a bot response after 2 seconds
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { text: [{ type: 'paragraph', children: [{ text: 'This is a bot response' }] }], sender: Sender.BOT },
            ])
            setIsGenerating(false)
        }, 2000)

        Transforms.select(editor, {
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [0, 0], offset: 0 }
        })
        ReactEditor.focus(editor)

    }

    const handleStop = () => {
        setIsGenerating(false)
    }

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#1e1e1e',
                padding: '16px 48px',
                borderRadius: 3,
                // boxSizing: 'border-box',
                // mx: 'auto',
            }}
        >
            {/* Header */}
            <Typography variant="h5" textAlign="center">
                Google Intelligence
            </Typography>

            {/* Chat History */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: messages.length === 0 ? 'center' : 'space-between',
                    flexGrow: 1,
                    minHeight: 0,
                }}
            >
                {messages.length > 0 && (
                    <Paper
                        elevation={3}
                        sx={{
                            flexGrow: 1,
                            minHeight: 0,
                            p: 2,
                            borderRadius: 3,
                            bgcolor: 'black',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <ChatHistory messages={messages} />

                    </Paper>
                )}

                {/* Input Bar */}
                <Box
                    sx={{
                        mt: messages.length > 0 ? 2 : 0,
                        border: '1px solid #ccc',
                        borderRadius: 2,
                        bgcolor: 'white',
                        p: 2,
                        boxSizing: 'border-box',
                        maxWidth: '100%',
                        transform: messages.length === 0 ? 'translateY(-50%)' : 'none',
                        transition: 'transform 0.4s ease-in-out',
                        alignSelf: 'center',
                        width: '100%',
                    }}
                >
                    <TextEditor
                        editor={editor}
                        value={editorValue}
                        onChange={setEditorValue}
                        onSubmit={handleSend}
                        fileUpload={{
                            uploadedFile,
                            onFileSelect: setUploadedFile,
                        }}
                        isGenerating={isGenerating}
                        onStop={handleStop}
                        voiceInput={{
                            transcript,
                            listening,
                            startListening,
                            stopListening,
                            resetTranscript,
                        }}
                    />
                </Box>
            </Box>
        </Box>
    )
}
