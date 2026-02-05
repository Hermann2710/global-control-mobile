import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/auth-context';
import { constants } from '@/lib/constants';
import { Conversation } from '@/schemas/chat-schema';
import { MaterialIcons } from '@expo/vector-icons';
import { format, isToday } from 'date-fns';
import { useColorScheme } from 'nativewind';
import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';

interface ChatListItemProps {
    conversation: Conversation;
    onPress: (c: Conversation) => void;
}

export const ChatListItem = ({ conversation, onPress }: ChatListItemProps) => {
    const { colorScheme } = useColorScheme();
    const { user: me } = useAuth();

    const partner = useMemo(() => {
        return conversation.user1.id === me?.id ? conversation.user2 : conversation.user1;
    }, [conversation, me?.id]);

    const lastMsg = useMemo(() => {
        if (!conversation.messages || conversation.messages.length === 0) return null;
        const sorted = [...conversation.messages].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        return sorted[sorted.length - 1];
    }, [conversation.messages]);

    const isLastMsgMine = lastMsg?.sender?.id === me?.id;
    const hasUnread = lastMsg && !isLastMsgMine && !lastMsg.isRead;

    const displayDate = lastMsg
        ? format(new Date(lastMsg.createdAt), isToday(new Date(lastMsg.createdAt)) ? 'HH:mm' : 'dd/MM')
        : '';

    return (
        <TouchableOpacity
            onPress={() => onPress(conversation)}
            className="flex-row items-center py-4 active:bg-muted/40 dark:active:bg-muted/20 px-2"
        >
            <Avatar alt={`${partner.firstName} ${partner.lastName}`} className="h-14 w-14 border border-border/10">
                <AvatarImage
                    source={{ uri: `${constants.api.uploadsUrl}/${partner.profileImage}` }}
                />
                <AvatarFallback className="bg-muted dark:bg-zinc-800">
                    <Text className="uppercase font-bold text-muted-foreground dark:text-zinc-400">
                        {partner.firstName?.substring(0, 2)}
                    </Text>
                </AvatarFallback>
            </Avatar>

            <View className="flex-1 ml-4 border-b border-border/10 dark:border-zinc-800/50 pb-4">
                <View className="flex-row justify-between items-center">
                    <Text className="text-[16px] font-semibold text-foreground dark:text-zinc-100" numberOfLines={1}>
                        {partner.firstName} {partner.lastName}
                    </Text>
                    <Text className={`text-[11px] ${hasUnread ? 'text-green-600 dark:text-green-500 font-bold' : 'text-muted-foreground dark:text-zinc-500'}`}>
                        {displayDate}
                    </Text>
                </View>

                <View className="flex-row justify-between items-center mt-1">
                    <View className="flex-row items-center flex-1 pr-2">
                        {lastMsg && isLastMsgMine && (
                            <MaterialIcons
                                name="done-all"
                                size={16}
                                color={lastMsg.isRead ? "#34B7F1" : (colorScheme === 'dark' ? "#52525b" : "#94a3b8")}
                                style={{ marginRight: 4 }}
                            />
                        )}

                        <Text
                            className={`text-sm flex-1 ${hasUnread ? 'text-foreground dark:text-zinc-100 font-bold' : 'text-muted-foreground dark:text-zinc-500'}`}
                            numberOfLines={1}
                        >
                            {isLastMsgMine ? "Moi : " : ""}{lastMsg?.content || "Aucun message"}
                        </Text>
                    </View>

                    {hasUnread && (
                        <View className="bg-green-500 dark:bg-green-600 min-w-[20px] h-[20px] px-1.5 rounded-full items-center justify-center">
                            <Text className="text-[10px] text-white font-bold">1</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};