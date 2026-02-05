import { Text } from '@/components/ui/text';
import { useChat } from '@/contexts/chat-context';
import { MessageType } from '@/schemas/chat-schema';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React, { memo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { MessageOptionsModal } from './message-options-modal';

interface Props {
    item: MessageType;
    isMine: boolean;
}

export const MessageBubble = memo(({ item, isMine }: Props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { deleteMessage } = useChat();
    const time = item.createdAt ? format(new Date(item.createdAt), 'HH:mm') : '';

    return (
        <>
            <View className={`flex-row ${isMine ? 'justify-end' : 'justify-start'} mb-4`}>
                <Pressable
                    onLongPress={() => setModalVisible(true)}
                    delayLongPress={500}
                    className={`max-w-[80%] px-4 py-2 rounded-b-2xl ${isMine ? 'bg-primary rounded-tl-2xl' : 'bg-muted rounded-tr-2xl'
                        }`}
                >
                    <Text className={`${isMine ? 'text-white' : 'text-foreground'} text-base`}>
                        {item.content}
                    </Text>

                    <View className="flex-row items-center justify-end mt-1 space-x-1">
                        <Text className={`text-[10px] ${isMine ? 'text-white/70' : 'text-muted-foreground'}`}>
                            {time}
                        </Text>
                        {isMine && (
                            <MaterialIcons
                                name={item.isRead ? "done-all" : "done"}
                                size={14}
                                color={item.isRead ? "#fff" : "rgba(255,255,255,0.5)"}
                            />
                        )}
                    </View>
                </Pressable>
            </View>

            <MessageOptionsModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onDelete={() => deleteMessage(item.id)}
                isMine={isMine}
            />
        </>
    );
}, (prev, next) => {
    return prev.item.id === next.item.id && prev.item.isRead === next.item.isRead;
});

MessageBubble.displayName = 'MessageBubble';