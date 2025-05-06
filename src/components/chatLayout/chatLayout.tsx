"use client"

import { useState } from 'react'
import { ReactEditor, withReact } from 'slate-react'
import { createEditor, Descendant, Text, Transforms } from 'slate'
import { Box, Typography, Paper } from '@mui/material'
import TextEditor from '../textEditor/textEditor'
import { renderSlateContent } from '@/utils/renderSlateContent'
import FilePreview from '../filePreview/filePreview'
import ChatHistory, { ChatMessage } from '../chatHistory/chatHistory'

import styles from './index.module.css'

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


    const handleSend = () => {
        const hasText = editorValue.some(node =>
            'children' in node && node.children.some(child => Text.isText(child) && child.text.trim() !== '')
        )

        if (!hasText && !uploadedFile) return
        setMessages(prev => [...prev, { text: editorValue, file: uploadedFile }])
        setEditorValue([
            {
                type: 'paragraph',
                children: [{ text: '' }],
            },
        ])
        setUploadedFile(null);
        Transforms.select(editor, {
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [0, 0], offset: 0 }
        })
        ReactEditor.focus(editor)

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
                boxSizing: 'border-box',
                mx: 'auto',
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
                }}
            >
                {messages.length > 0 && (
                    <Paper
                        elevation={3}
                        sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            p: 2,
                            borderRadius: 3,
                            bgcolor: 'black',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
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
                        uploadedFile={uploadedFile}
                        onFileSelect={setUploadedFile}
                    />
                </Box>
            </Box>
        </Box>
    )
}
