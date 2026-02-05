import { Text } from '@/components/ui/text';
import { UserType } from '@/schemas/user-schema';
import chatService from '@/services/chat-service';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, TouchableOpacity, View } from 'react-native';

interface NewChatModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectUser: (userId: number) => void;
}

export const NewChatModal = ({ visible, onClose, onSelectUser }: NewChatModalProps) => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            fetchUsers();
        }
    }, [visible]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await chatService.getAllUsers();
            setUsers(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white dark:bg-zinc-900 h-[80%] rounded-t-3xl">
                    <View className="flex-row items-center justify-between p-6 border-b border-gray-100 dark:border-zinc-800">
                        <Text className="text-xl font-bold">Nouveau message</Text>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialIcons name="close" size={28} className="text-foreground" />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View className="flex-1 justify-center"><ActivityIndicator size="large" /></View>
                    ) : (
                        <FlatList
                            data={users}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={{ padding: 16 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="flex-row items-center mb-4 p-2"
                                    onPress={() => {
                                        onSelectUser(item.id);
                                        onClose();
                                    }}
                                >
                                    <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                                        <Text className="text-primary font-bold text-lg">
                                            {item.firstName[0]}{item.lastName[0]}
                                        </Text>
                                    </View>
                                    <View className="ml-4">
                                        <Text className="font-bold text-base">{item.firstName} {item.lastName}</Text>
                                        <Text className="text-muted-foreground text-sm">{item.role}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};