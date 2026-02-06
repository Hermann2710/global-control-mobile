/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Conversation, MessageType } from "@/schemas/chat-schema";
import { UserType } from "@/schemas/user-schema";
import chatService from "@/services/chat-service";
import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Toast from 'react-native-toast-message';
import { io, Socket } from "socket.io-client";
import { useAuth } from "./auth-context";

const WS_URL = 'wss://api.globalcontrolsarl.theplug-group.com';

export interface ChatInterface {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    conversations: Conversation[];
    messages: MessageType[];
    activeConversation: Conversation | null;
    setActiveConversation: Dispatch<SetStateAction<Conversation | null>>;
    getOrCreateConversation: (receiver: UserType) => Promise<Conversation | undefined>;
    sendMessage: (content: string) => Promise<void>;
    markAsRead: () => Promise<void>;
    deleteMessage: (id: string | number) => Promise<void>;
    loading: boolean;
    sending: boolean;
    error: string | null;
}

export const ChatContext = createContext<ChatInterface | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user, token } = useAuth();
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!user || !token) return;

        socketRef.current = io(WS_URL, {
            auth: { token },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 10,
        });

        const socket = socketRef.current;

        socket.on("connect", () => {
            socket.emit('register', user.id);
        });

        socket.on("connect_error", () => {
            Toast.show({
                type: 'error',
                text1: 'Erreur de connexion',
                text2: 'Impossible de rejoindre le serveur de discussion.'
            });
        });

        socket.on("newMessage", (message: MessageType) => {
            const incomingConvId = message.conversation?.id;
            if (!incomingConvId) return;

            const updateMsgs = (prevMsgs: MessageType[] = []) => {
                if (prevMsgs.some(m => String(m.id) === String(message.id))) return prevMsgs;
                return [...prevMsgs, message];
            };

            setConversations(prev => prev.map(conv =>
                String(conv.id) === String(incomingConvId)
                    ? { ...conv, messages: updateMsgs(conv.messages) }
                    : conv
            ));

            setActiveConversation(prev => {
                if (prev && String(prev.id) === String(incomingConvId)) {
                    return { ...prev, messages: updateMsgs(prev.messages) };
                }
                return prev;
            });
        });

        socket.on("recieve_up_isRead", (unreadIds: (string | number)[]) => {
            const ids = unreadIds.map(id => String(id));
            const updateStatus = (msgs: MessageType[] = []) =>
                msgs.map(m => ids.includes(String(m.id)) ? { ...m, isRead: true } : m);

            setConversations(prev => prev.map(c => ({ ...c, messages: updateStatus(c.messages) })));
            setActiveConversation(prev => prev ? { ...prev, messages: updateStatus(prev.messages) } : null);
        });

        socket.on("successMsgdel", (idDelMsg: string | number) => {
            const filterMsgs = (msgs: MessageType[] = []) =>
                msgs.filter(m => String(m.id) !== String(idDelMsg));

            setConversations(prev => prev.map(c => ({ ...c, messages: filterMsgs(c.messages) })));
            setActiveConversation(prev => prev ? { ...prev, messages: filterMsgs(prev.messages) } : null);

            Toast.show({
                type: 'success',
                text1: 'Message supprimé'
            });
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [user?.id, token]);

    useEffect(() => {
        if (activeConversation && socketRef.current && user) {
            socketRef.current.emit('joinConversation', {
                user1Id: activeConversation.user1.id,
                user2Id: activeConversation.user2.id
            });
        }
    }, [activeConversation?.id, user?.id]);

    const filteredConversations = useMemo(() => {
        if (!search.trim()) return conversations;
        return conversations.filter(conv => {
            const partner = conv.user1.id === user?.id ? conv.user2 : conv.user1;
            return `${partner.firstName} ${partner.lastName}`.toLowerCase().includes(search.toLowerCase());
        });
    }, [search, conversations, user?.id]);

    const getOrCreateConversation = async (receiver: UserType) => {
        if (!user) return;
        try {
            const existingConv = conversations.find(conv =>
                (conv.user1.id === receiver.id || conv.user2.id === receiver.id)
            );

            if (existingConv) {
                setActiveConversation(existingConv);
                return existingConv;
            }

            const response = await chatService.getOrCreateConversation(user, receiver);
            const newConversation = response.data;

            setConversations(prev => {
                const exists = prev.some(c => String(c.id) === String(newConversation.id));
                if (exists) return prev;
                return [newConversation, ...prev];
            });

            setActiveConversation(newConversation);
            return newConversation;
        } catch (err: any) {
            Toast.show({
                type: 'error',
                text1: 'Erreur',
                text2: 'Impossible de créer la conversation'
            });
        }
    };

    const sendMessage = useCallback(async (content: string) => {
        if (!activeConversation || !content.trim() || !user) return;

        const recipient = activeConversation.user1.id === user.id
            ? activeConversation.user2
            : activeConversation.user1;

        socketRef.current?.emit("sendMessage", {
            sender: user.id.toString(),
            content: content.trim(),
            conversation: activeConversation.id.toString(),
            //recieve: recipient.id.toString()
        });
    }, [activeConversation, user]);

    const markAsRead = useCallback(async () => {
        if (!activeConversation || !user) return;

        const unreadIds = activeConversation.messages
            ?.filter(m => !m.isRead && String(m.sender?.id) !== String(user.id))
            .map(m => m.id) || [];

        if (unreadIds.length > 0) {
            socketRef.current?.emit("update_is_read", {
                unreadIds,
                user1: activeConversation.user1.id,
                user2: activeConversation.user2.id
            });
        }
    }, [activeConversation, user]);

    const deleteMessage = useCallback(async (messageId: string | number) => {
        if (!activeConversation) return;

        socketRef.current?.emit("del-msg", {
            idDelMsg: messageId,
            user1: activeConversation.user1.id,
            user2: activeConversation.user2.id
        });
    }, [activeConversation]);

    useEffect(() => {
        if (user) {
            const fetchConversations = async () => {
                setLoading(true);
                try {
                    const response = await chatService.getConversations(user.id);
                    setConversations(response.data);
                } catch (err) {
                    Toast.show({
                        type: 'error',
                        text1: 'Erreur de chargement',
                        text2: 'Impossible de récupérer vos discussions'
                    });
                } finally {
                    setLoading(false);
                }
            };
            fetchConversations();
        }
    }, [user?.id]);

    const value: ChatInterface = {
        search, setSearch,
        conversations: filteredConversations,
        messages: activeConversation?.messages || [],
        activeConversation, setActiveConversation,
        getOrCreateConversation,
        sendMessage, markAsRead,
        deleteMessage,
        loading, sending, error
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) throw new Error('useChat doit être utilisé dans un ChatProvider');
    return context;
};