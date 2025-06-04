"use client";

import { useEffect, useRef, useState } from "react";
import {
  createEditor,
  Element as SlateElement,
  Descendant,
  Text,
  Transforms,
} from "slate";
import { ReactEditor, withReact } from "slate-react";
import { Box } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { ArrowDownward } from "@mui/icons-material";
import SidebarNav from "../sidebarNav/sidebarNav";
import ChatHistory from "../chatHistory/chatHistory";
import TextEditor from "../textEditor/textEditor";
import RoundIconButton from "../roundIconButton/roundIconButton";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { withMentions } from "@/plugins/mentionPlugin";
import { ChatMessage, Sender } from "@/types/chat";
import { HistoryItem } from "@/types/history";
import { slateToMarkdown } from "@/utils/slateToMarkdown";
import { groupHistoryByTime } from "@/utils/dateHelper";
import { useChatLLM } from "@/hooks/useChatLLM";
import { useChatHistory } from "@/hooks/useChatHistory";
import { markdownToSlate } from "@/utils/markdownToSlate";
import { useChatContext } from "@/context/ChatContext";
import ProfileMenu from "../profileMenu/profileMenu";
import { Session } from "next-auth";

interface ChatLayoutProps {
  session: Session | null;
  signOut: () => void;
  setIsSigningOut: (val: boolean) => void;
}


export default function ChatLayout({
  session,
  signOut,
  setIsSigningOut,
}: ChatLayoutProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [editor] = useState(() => withMentions(withReact(createEditor())));
  const [editorValue, setEditorValue] = useState<Descendant[]>([
    { type: "paragraph", children: [{ text: "" }] },
  ]);
  const { history, setHistory } = useChatHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHistory, setFilteredHistory] =
    useState<HistoryItem[]>(history);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const selectedChat = history.find(chat => chat.id === selectedId);
  const messages = selectedChat?.messages || [];
  const {
    addUserMessage,
    addBotMessage,
    clearContextFor,
  } = useChatContext();

  // Voice input
  const {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceInput();

  const { generateTitle, generateLLMResponse, stopGeneration } = useChatLLM({
    selectedId,
    setHistory,
  });

  // Scroll to bottom when new messages are added
  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  // Focus editor when a new chat is selected
  useEffect(() => {
    if (editor) {
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      });
      ReactEditor.focus(editor);
    }
  }, [selectedId]);

  // Show scroll button when not at the bottom
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isAtBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 10;
      setShowScrollButton(!isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages.length]);

  // Reset scroll button + scroll to bottom when new messages are added
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 650;

    if (isNearBottom) {
      scrollToBottom();
    }
    setShowScrollButton(false);
  }, [messages]);

  const handleNewChat = () => {
    setHistory(prev =>
      prev.map(chat => ({ ...chat, isGenerating: false }))
    );
    setSelectedId("");
    setEditorValue([
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ]);
    setUploadedFile(null);
    stopListening();
    resetTranscript();
    if (selectedId) clearContextFor(selectedId);
  };

  const handleHistorySearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectChat = (id: string) => {
    setLoadingMessages(true);
    setSelectedId(id);
    setEditorValue([{ type: 'paragraph', children: [{ text: '' }] }]);
    setUploadedFile(null);
    stopListening();
    resetTranscript();
    setLoadingMessages(false);
    if (selectedId) clearContextFor(selectedId);
  };

  const handleEditTitle = (id: string, newTitle: string) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: newTitle } : item))
    );
  };

  const handleDeleteChat = (idToDelete: string) => {
    setHistory((prev) => prev.filter((chat) => chat.id !== idToDelete));

    // If deleted chat is currently selected, switch to first available one
    if (selectedId === idToDelete) {
      const nextAvailable = history.find((chat) => chat.id !== idToDelete);
      setSelectedId(nextAvailable?.id || null);
    }
  };

  const sendMessageToLLM = async (chatId: string, isNewChat = false) => {
    const userMessage = {
      sender: Sender.USER,
      text: editorValue as { type: string; children: { text: string }[] }[],
    };

    const botPlaceholder = {
      sender: Sender.BOT,
      text: [{ type: "paragraph", children: [{ text: "" }] }],
      isLoading: true,
    };

    setHistory((prev) => {
      return prev.map((chat) => {
        if (chat.id !== chatId) return chat;

        return {
          ...chat,
          isGenerating: true,
          messages: [...chat.messages, userMessage, botPlaceholder],
        };
      });
    });

    // Title generation for new chats
    if (isNewChat) {
      const firstLine =
        SlateElement.isElement(editorValue[0]) && "children" in editorValue[0]
          ? editorValue[0].children?.[0]?.text || ""
          : "";

      generateTitle({ variables: { message: firstLine } });
    }

    setEditorValue([{ type: "paragraph", children: [{ text: "" }] }]);
    setUploadedFile(null);
    resetTranscript();

    // LLM Call
    const markdown = (slateToMarkdown(editorValue));
    if (!chatId) return;
    const updatedPrompt = addUserMessage(chatId, markdown);

    const aiText = await generateLLMResponse(updatedPrompt);
    if (aiText) {
      addBotMessage(chatId, aiText);
    }
    if (aiText) {
      const slateContext = await markdownToSlate(aiText);
      setHistory((prev) => {
        return prev.map((chat) => {
          if (chat.id !== chatId) return chat;

          chat.id === chatId
            ? {
              ...chat,
              messages: [...chat.messages, { sender: Sender.BOT, text: markdownToSlate(aiText) }]
            }
            : chat

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
              text: slateContext,
              isLoading: false,
            };
          } else {
            updatedMessages.push({
              sender: Sender.BOT,
              text: slateContext,
              isLoading: false,
            } as ChatMessage);
          }

          return { ...chat, messages: updatedMessages, isGenerating: false };
        });
      });
    }
  };

  const handleSend = () => {
    const currentChat = history.find(chat => chat.id === selectedId);

    if (currentChat?.isGenerating) return;

    const hasText = editorValue.some(
      (node) =>
        "children" in node &&
        node.children.some(
          (child) => Text.isText(child) && child.text.trim() !== ""
        )
    );

    if (!hasText && !uploadedFile) return;

    if (!selectedId) {
      const newChatId = uuidv4();
      const newChat: HistoryItem = {
        id: newChatId,
        title: "New Chat",
        createdAt: new Date().toISOString(),
        messages: [],
      };

      setHistory((prev) => [newChat, ...prev]);
      setSelectedId(newChatId);

      // Wait one tick, then send message
      setTimeout(() => {
        sendMessageToLLM(newChatId, true);
      }, 0);
    } else {
      sendMessageToLLM(selectedId, false);
    }

    // Focuses editor for new input after sending
    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    });
    ReactEditor.focus(editor);
  };

  const handleStop = () => {
    stopGeneration();

    if (!selectedId) return;

    setHistory(prev =>
      prev.map(chat => {
        if (chat.id !== selectedId) return chat;

        const updatedMessages = [...chat.messages];
        const lastIndex = updatedMessages.length - 1;

        if (
          updatedMessages[lastIndex] &&
          updatedMessages[lastIndex].sender === Sender.BOT &&
          updatedMessages[lastIndex].isLoading
        ) {
          updatedMessages[lastIndex] = {
            ...updatedMessages[lastIndex],
            isLoading: false,
          };
        }

        return { ...chat, messages: updatedMessages, isGenerating: false };
      })
    );
  };

  // Search chat history
  useEffect(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (trimmed === "") {
      setFilteredHistory(history); // reset to full list
    } else {
      setFilteredHistory(
        history.filter((item) => item.title.toLowerCase().includes(trimmed))
      );
    }
  }, [searchQuery, history]);

  return (
    <Box sx={{ height: "100vh", display: "flex", overflowY: "hidden", bgcolor: "#1e1e1e" }}>
      <SidebarNav
        handleNewChat={handleNewChat}
        groupedHistory={groupHistoryByTime(filteredHistory)}
        onSelect={handleSelectChat}
        selectedId={selectedId}
        onSearch={handleHistorySearch}
        onEditTitle={handleEditTitle}
        onDeleteChat={handleDeleteChat}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minHeight: 0,
          height: "calc(100vh - 53px)",
          overflow: "hidden",
        }}
      >

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            background: "#1e1e1e",
            borderBottom: "1px solid #2a2a2a",
            minHeight: "40px",
            pt: 2,
            pr: 2,
            flexShrink: 0,
          }}
        >
          {session?.user?.image && (
            <ProfileMenu imageUrl={session.user.image || ""}
              onSignOutStart={() => {
                setIsSigningOut(true)
                signOut()
              }} />
          )}
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: messages.length === 0 ? "center" : "space-between",
            padding: "16px 48px",
            overflow: "hidden",
          }}
        >
          {/* Chat History */}
          {messages.length > 0 && (
            <Box
              sx={{
                position: "relative",
                flexGrow: 1,
                overflowY: "auto",
                bgcolor: "black",
                p: 2,
                borderRadius: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <ChatHistory
                messages={messages}
                scrollRef={scrollRef}
                loading={loadingMessages}
              />
              {showScrollButton && (
                <RoundIconButton
                  onClick={scrollToBottom}
                  icon={<ArrowDownward fontSize="small" />}
                  sx={{
                    position: "absolute",
                    bottom: "0",
                    left: "50%",
                    transform: "translateX(-50%)",
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
              border: "1px solid #ccc",
              borderRadius: 1,
              bgcolor: "white",
              p: 2,
              boxSizing: "border-box",
              maxWidth: "100%",
              transform: messages.length === 0 ? "translateY(-50%)" : "none",
              transition: "transform 0.4s ease-in-out",
              alignSelf: "center",
              width: "100%",
            }}
          >
            <TextEditor
              editor={editor}
              value={editorValue}
              onChange={setEditorValue}
              onSubmit={handleSend}
              fileUpload={{ uploadedFile, onFileSelect: setUploadedFile }}
              isGenerating={
                history.find(chat => chat.id === selectedId)?.isGenerating ?? false
              }
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
    </Box>
  );
}
