'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChatMessage, Sender } from '@/types/chat';

type ChatContextMap = {
    [chatId: string]: ChatMessage[];
};

type ChatContextType = {
    chatContextMap: ChatContextMap;
    addUserMessage: (chatId: string, message: string) => string;
    addBotMessage: (chatId: string, message: string) => void;
    clearContextFor: (chatId: string) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
    const [chatContextMap, setChatContextMap] = useState<ChatContextMap>({});

    const addUserMessage = (chatId: string, message: string): string => {
        let newPrompt = '';
        setChatContextMap(prev => {
            const updatedMessages = [...(prev[chatId] || []), { sender: Sender.USER, text: [message] }];

            const updatedMap = {
                ...prev,
                [chatId]: updatedMessages,
            };

            newPrompt = updatedMessages.map(
                msg => `${msg.sender === 'user' ? 'User' : 'Bot'}: ${msg.text}`
            ).join('\n');

            return updatedMap;
        });

        return newPrompt;
    };
    const addBotMessage = (chatId: string, message: string) => {
        setChatContextMap(prev => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), { sender: Sender.BOT, text: [message] }],
        }));
    };

    const clearContextFor = (chatId: string) => {
        setChatContextMap(prev => ({
            ...prev,
            [chatId]: [],
        }));
    };

    return (
        <ChatContext.Provider value={{ chatContextMap, addUserMessage, addBotMessage, clearContextFor }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatContextProvider');
    }
    return context;
};
