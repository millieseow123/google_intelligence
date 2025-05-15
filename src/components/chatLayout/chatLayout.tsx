"use client"

import { useEffect, useRef, useState } from 'react';
import { createEditor, Element as SlateElement, Descendant, Text, Transforms } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import { Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { ArrowDownward } from '@mui/icons-material';
import SidebarNav from '../sidebarNav/sidebarNav';
import ChatHistory from '../chatHistory/chatHistory';
import TextEditor from '../textEditor/textEditor';
import RoundIconButton from '../roundIconButton/roundIconButton';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { withMentions } from '@/plugins/mentionPlugin';
import { ChatMessage, Sender } from '@/types/chat';
import { HistoryItem } from '@/types/history';
import { slateToMarkdown } from '@/utils/slateToMarkdown';
import { groupHistoryByTime } from '@/utils/dateHelper';
import { useChatLLM } from '@/hooks/useChatLLM';
import { useChatHistory } from '@/hooks/useChatHistory';

export default function ChatLayout() {


    const scrollRef = useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false)
    const [editor] = useState(() => withMentions(withReact(createEditor())))
    const [editorValue, setEditorValue] = useState<Descendant[]>([{ type: 'paragraph', children: [{ text: '' }] }])
    const { history, setHistory, loading } = useChatHistory()
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isGenerating, setIsGenerating] = useState(false)

    // Voice input
    const {
        transcript,
        listening,
        startListening,
        stopListening,
        resetTranscript
    } = useVoiceInput()

    const { generateTitle, generateLLMResponse, stopGeneration } = useChatLLM({
        selectedId,
        setHistory,
        setMessages,
    });

    // Scroll to bottom when new messages are added
    const scrollToBottom = () => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth',
        });
    };

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

    // Show scroll button when not at the bottom
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
        const filteredHistory = history.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
        );
        setHistory(filteredHistory);
    };

    const handleSelectChat = (id: string) => {
        setLoadingMessages(true)
        setSelectedId(id);
        const selectedChat = history.find((chat) => chat.id === id);
        setMessages(selectedChat?.messages || []);
        setLoadingMessages(false)
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

    const sendMessageToLLM = async (chatId: string) => {
        const userMessage = {
            sender: Sender.USER,
            text: editorValue as { type: string; children: { text: string }[] }[],
        };

        const botPlaceholder = {
            sender: Sender.BOT,
            text: [{ type: 'paragraph', children: [{ text: '' }] }],
            isLoading: true,
        };

        setMessages(prev => [...prev, userMessage, botPlaceholder]);

        // Title generation (if first message)
        const firstLine =
            SlateElement.isElement(editorValue[0]) && 'children' in editorValue[0]
                ? editorValue[0].children?.[0]?.text || ''
                : '';
        generateTitle({ variables: { message: firstLine } });

        setEditorValue([{ type: 'paragraph', children: [{ text: '' }] }]);
        setUploadedFile(null);
        resetTranscript();
        setIsGenerating(true);

        // LLM Call
        const markdown = slateToMarkdown(editorValue);
        const aiText = await generateLLMResponse(markdown);

        if (aiText) {
            setMessages(prev => {
                const updated = [...prev];
                const lastIndex = updated.length - 1;

                if (
                    updated[lastIndex] &&
                    updated[lastIndex].sender === Sender.BOT &&
                    updated[lastIndex].isLoading
                ) {
                    updated[lastIndex] = {
                        ...updated[lastIndex],
                        text: [{ type: 'paragraph', children: [{ text: aiText }] }],
                        isLoading: false,
                    };
                } else {
                    updated.push({
                        sender: Sender.BOT,
                        text: [{ type: 'paragraph', children: [{ text: aiText }] }],
                        isLoading: false,
                    });
                }
                return updated;
            });

            setHistory(prev => {
                return prev.map(chat => {
                    if (chat.id !== chatId) return chat;

                    const updatedMessages = [...chat.messages];
                    const lastIndex = updatedMessages.length - 1;
                    const lastMessage = updatedMessages[lastIndex] as ChatMessage;

                    if (
                        lastMessage &&
                        lastMessage.sender === Sender.BOT &&
                        lastMessage.isLoading
                    ) {
                        updatedMessages[lastIndex] = {
                            ...lastMessage,
                            text: [{ type: 'paragraph', children: [{ text: aiText }] }],
                            isLoading: false,
                        };
                    } else {
                        updatedMessages.push({
                            sender: Sender.BOT,
                            text: [{ type: 'paragraph', children: [{ text: aiText }] }],
                            isLoading: false,
                        } as ChatMessage);
                    }

                    return { ...chat, messages: updatedMessages };
                });
            })
            setIsGenerating(false);
        }
    };

    const handleSend = () => {
        const hasText = editorValue.some(node =>
            'children' in node && node.children.some(child => Text.isText(child) && child.text.trim() !== '')
        )

        if (!hasText && !uploadedFile) return

        if (!selectedId) {
            const newChatId = uuidv4();
            const newChat: HistoryItem = {
                id: newChatId,
                title: 'Untitled Chat',
                createdAt: new Date().toISOString(),
                messages: [],
            };

            setHistory(prev => [newChat, ...prev]);
            setSelectedId(newChatId);

            // Wait one tick, then send message
            setTimeout(() => {
                sendMessageToLLM(newChatId);
            }, 0);
        } else {
            sendMessageToLLM(selectedId);
        }

        // Focuses editor for new input after sending
        Transforms.select(editor, {
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [0, 0], offset: 0 }
        })
        ReactEditor.focus(editor)
    }

    const handleStop = () => {
        stopGeneration();
        setIsGenerating(false)
    }
    return (
        <Box sx={{ height: '100vh', display: 'flex', bgcolor: '#1e1e1e' }}>

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
                        <ChatHistory messages={messages} scrollRef={scrollRef} loading={loadingMessages} />
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
                    </Box>
                )}

                {/* Input Bar */}
                <Box
                    sx={{
                        mt: messages.length > 0 ? 2 : 0,
                        border: '1px solid #ccc',
                        borderRadius: 3,
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
                        fileUpload={{ uploadedFile, onFileSelect: setUploadedFile, }}
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
