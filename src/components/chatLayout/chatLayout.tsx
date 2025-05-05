"use client"

import { useState } from 'react'
import { ReactEditor, withReact } from 'slate-react'
import { createEditor, Descendant, Text, Transforms } from 'slate'
import { Box, Container, Typography, Paper } from '@mui/material'
import TextEditor from '../textEditor/textEditor'
import { renderSlateContent } from '@/utils/renderSlateContent'

import styles from './index.module.css'

export default function ChatLayout() {
    const [messages, setMessages] = useState<Descendant[][]>([])
    console.log("messages", messages)
    const [editorValue, setEditorValue] = useState<Descendant[]>([
        {
            type: 'paragraph',
            children: [{ text: '' }]
        }
    ])
    const [editor] = useState(() => withReact(createEditor()))


    const handleSend = () => {
        const hasText = editorValue.some(node =>
            'children' in node && node.children.some(child => Text.isText(child) && child.text.trim() !== '')
        )

        if (!hasText) return
        setMessages(prev => [...prev, editorValue])
        setEditorValue([
            {
                type: 'paragraph',
                children: [{ text: '' }],
            },
        ])

        Transforms.select(editor, {
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [0, 0], offset: 0 }
        })
        ReactEditor.focus(editor)

    }

    return (
        <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', py: 2 }}>
            {/* Header */}
            <Typography variant="h5" textAlign="center">
                Google Intelligence
            </Typography>

            {/* Chat History */}
            {messages.length > 0 && (<Paper
                elevation={3}
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    p: 2,
                    mb: 2,
                    bgcolor: '#f5f5f5',
                    borderRadius: 2
                }}
            >
                {
                    messages.map((msg, idx) => (
                        <Box key={idx} sx={{ mb: 1 }}>
                            <Typography variant="body2" sx={{ p: 1, bgcolor: 'white', borderRadius: 2 }}>
                                {renderSlateContent(msg)}
                            </Typography>
                        </Box>
                    ))
                }
            </Paper>)}

            {/* Input Bar */}
            <Box sx={{
                position: messages.length > 0 ? 'relative' : 'absolute', // Absolute when no messages
                bottom: messages.length > 0 ? '0' : '50%', // Center vertically when no messages
                transform: messages.length > 0 ? 'none' : 'translateY(50%)', // Center alignment
            }}>
                <Box
                    sx={{
                        border: '1px solid #ccc',
                        borderRadius: 2,
                        bgcolor: 'white',
                        p: '12px',
                        minHeight: '60px'
                    }}
                >
                    <TextEditor
                        editor={editor}
                        value={editorValue}
                        onChange={setEditorValue}
                        onSubmit={handleSend}
                    />
                </Box>
            </Box>
        </Container>
    )
}
