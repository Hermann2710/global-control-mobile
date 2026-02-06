import { Text } from '@/components/ui/text';
import { useChat } from '@/contexts/chat-context';
import { UserType } from '@/schemas/user-schema';
import chatService from '@/services/chat-service';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, TextInput, TouchableOpacity, View } from 'react-native';

interface NewChatModalProps {
    visible: boolean;
    onClose: () => void;
}

export const NewChatModal = ({ visible, onClose }: NewChatModalProps) => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState('');
    const { getOrCreateConversation } = useChat()

    useEffect(() => {
        if (visible) {
            setPage(1);
            fetchUsers(1, true);
        }
    }, [visible]);

    const fetchUsers = async (pageNumber: number, isInitial: boolean = false) => {
        if (isInitial) setLoading(true);
        else setLoadingMore(true);

        try {
            const res = await chatService.getAllUsers(pageNumber);
            const newUsers = res.data.users;

            setUsers(prev => isInitial ? newUsers : [...prev, ...newUsers]);
            setHasMore(newUsers.length > 0);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const filteredUsers = useMemo(() => {
        const query = search.toLowerCase().trim();
        if (!query) return users;

        return users.filter(user =>
            user.firstName.toLowerCase().includes(query) ||
            user.lastName.toLowerCase().includes(query)
        );
    }, [search, users]);

    const handleLoadMore = () => {
        if (!loadingMore && hasMore && !loading && search === '') {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchUsers(nextPage);
        }
    };

    const renderFooter = () => (
        loadingMore ? <ActivityIndicator className="py-4" size="small" /> : <View className="h-10" />
    );

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white dark:bg-zinc-900 h-[90%] rounded-t-3xl">
                    <View className="p-6 border-b border-gray-100 dark:border-zinc-800">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-xl font-bold">Nouveau message</Text>
                            <TouchableOpacity onPress={onClose}>
                                <MaterialIcons name="close" size={28} className="text-foreground" />
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row items-center bg-gray-100 dark:bg-zinc-800 px-4 py-2 rounded-xl">
                            <MaterialIcons name="search" size={20} color="#9ca3af" />
                            <TextInput
                                className="flex-1 ml-2 text-foreground h-10"
                                placeholder="Rechercher dans la liste..."
                                placeholderTextColor="#9ca3af"
                                value={search}
                                onChangeText={setSearch}
                            />
                        </View>
                    </View>

                    {loading ? (
                        <View className="flex-1 justify-center"><ActivityIndicator size="large" /></View>
                    ) : (
                        <FlatList
                            data={filteredUsers}
                            keyExtractor={(item, index) => `${item.id}-${index}`}
                            contentContainerStyle={{ padding: 16 }}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.3}
                            ListFooterComponent={renderFooter}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="flex-row items-center mb-4 p-2"
                                    onPress={async () => {
                                        await getOrCreateConversation(item)
                                        router.navigate("/chat/chat-details")
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
                                        <Text className="text-muted-foreground text-sm">{item.email}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={() => (
                                <View className="flex-1 items-center justify-center pt-10">
                                    <Text className="text-muted-foreground">Aucun utilisateur trouvé</Text>
                                </View>
                            )}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};