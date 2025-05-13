"use client"

import { useEffect, useRef, useState } from 'react'
import { ReactEditor, withReact } from 'slate-react'
import { createEditor, Descendant, Text, Transforms } from 'slate'
import { Box, Paper } from '@mui/material'
import TextEditor from '../textEditor/textEditor'
import ChatHistory from '../chatHistory/chatHistory'
import SidebarNav from '../sidebarNav/sidebarNav'
import { ChatMessage, Sender } from '@/types/chat'
import { withMentions } from '@/plugins/mentionPlugin'
import { useVoiceInput } from '@/hooks/useVoiceInput'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { initialHistory } from '@/mock/history'
import { HistoryItem } from '@/types/history'

import styles from './index.module.css'
import { ArrowDownward } from '@mui/icons-material'
import RoundIconButton from '../roundIconButton/roundIconButton'

export default function ChatLayout() {
    const [history, setHistory] = useState(initialHistory)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [editorValue, setEditorValue] = useState<Descendant[]>([
        {
            type: 'paragraph',
            children: [{ text: '' }]
        }
    ])
    const [editor] = useState(() => withMentions(withReact(createEditor())))
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);


    const groupHistoryByTime = (history: HistoryItem[]) => {
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

    const handleNewChat = () => {
        const newChat: HistoryItem = {
            id: uuidv4(),
            title: 'Untitled Chat',
            createdAt: new Date().toISOString(),
            messages: [],
        }

        setHistory(prev => [newChat, ...prev])
        setSelectedId(newChat.id)
        setMessages([])
        setEditorValue([
            {
                type: 'paragraph',
                children: [{ text: '' }],
            },
        ])
        setUploadedFile(null)
        resetTranscript()
    }

    const handleHistorySearch = (query: string) => {
        const filteredHistory = initialHistory.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
        );
        setHistory(filteredHistory);
    };

    const handleSelectChat = (id: string) => {
        setSelectedId(id);
        const selectedChat = history.find((chat) => chat.id === id);
        setMessages(selectedChat?.messages || []);
    }; 

    const handleEditTitle = (id: string, newTitle: string) => {
        setHistory((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, title: newTitle } : item
            )
        )
    } 
    const handleDeleteChat = (idToDelete: string) => {
        setHistory(prev => prev.filter(chat => chat.id !== idToDelete))

        // If deleted chat is currently selected, switch to first available one
        if (selectedId === idToDelete) {
            const nextAvailable = history.find(chat => chat.id !== idToDelete)
            setSelectedId(nextAvailable?.id || null)
            setMessages(nextAvailable?.messages || [])
        }
    }        

    // Focus editor when a new chat is selected
    useEffect(() => {
        if (editor) {
            Transforms.select(editor, {
                anchor: { path: [0, 0], offset: 0 },
                focus: { path: [0, 0], offset: 0 },
            })
            ReactEditor.focus(editor)
        }
    }, [selectedId]) 

    // Scroll to bottom when new messages are added
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
            const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 10;
            setShowScrollButton(!isAtBottom);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [messages.length]);

    // Reset scroll button + scroll to bottom when new messages are added
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const isNearBottom =
            container.scrollHeight - container.scrollTop <= container.clientHeight + 650;

        if (isNearBottom) {
            scrollToBottom();
        } 
        setShowScrollButton(false);
    }, [messages]);

    
    // Voice input
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
                bgcolor: '#1e1e1e',
            }}
        >

            {/* Sidebar */}
            {/* TODO: Replace mock history with real data */}
            <SidebarNav
                handleNewChat={handleNewChat}
                groupedHistory={groupHistoryByTime(history)}
                onSelect={handleSelectChat}
                selectedId={selectedId}
                onSearch={handleHistorySearch}
                onEditTitle={handleEditTitle}
                onDeleteChat={handleDeleteChat}
            />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: messages.length === 0 ? 'center' : 'space-between',
                    flexGrow: 1,
                    minHeight: 0,
                    padding: '16px 48px',
                    height: 'calc(100vh - 53px)',
                    overflow: 'hidden',
                }}
            >
                {/* Chat History */}
                {messages.length > 0 && (
                    <Box
                        sx={{
                            position: 'relative',
                            flexGrow: 1,
                            overflowY: 'auto',
                            bgcolor: 'black',
                            p: 2,
                            borderRadius: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <ChatHistory messages={messages} scrollRef={scrollRef} />
                        {showScrollButton && (
                            <RoundIconButton
                                onClick={scrollToBottom}
                                icon={<ArrowDownward fontSize="small" />}
                                sx={{
                                    position: 'absolute',
                                    bottom: '0',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    zIndex: 1000, 
                                    boxShadow: 2,
                                }}
                            />
                        )}      
                        {/* <RoundIconButton
                            onClick={scrollToBottom}
                            icon={<ArrowDownward fontSize="small" />}
                            sx={{
                                position: 'absolute',
                                bottom: '0',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 1000,
                                boxShadow: 2,
                            }}
                        />                   */}
                    </Box>
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
