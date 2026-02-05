import { Text } from '@/components/ui/text';
import { useChat } from '@/contexts/chat-context';
import { Conversation } from '@/schemas/chat-schema';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { ChatListItem } from './chat-list-item';

export const ChatList = () => {
    const { conversations, setActiveConversation, loading } = useChat();

    const sortedConversations = useMemo(() => {
        return [...conversations].sort((a, b) => {
            const getLatestTime = (conv: Conversation) => {
                if (!conv.messages || conv.messages.length === 0) return 0;
                return Math.max(...conv.messages.map(m => new Date(m.createdAt).getTime()));
            };
            return getLatestTime(b) - getLatestTime(a);
        });
    }, [conversations]);

    if (loading) {
        return (
            <View className="py-10 items-center">
                <Text className="text-muted-foreground dark:text-zinc-500 italic">Chargement...</Text>
            </View>
        );
    }

    if (sortedConversations.length === 0) {
        return (
            <View className="items-center py-20 px-10">
                <MaterialIcons name="chat-bubble-outline" size={40} color="#94a3b8" />
                <Text className="text-muted-foreground dark:text-zinc-500 mt-4 text-center text-sm">
                    Aucune discussion.
                </Text>
            </View>
        );
    }

    return (
        <View className="mt-4">
            {sortedConversations.map((conversation) => (
                <ChatListItem
                    key={conversation.id}
                    conversation={conversation}
                    onPress={(conv) => {
                        setActiveConversation(conv);
                        router.navigate("/(app)/chat/chat-details");
                    }}
                />
            ))}
        </View>
    );
};