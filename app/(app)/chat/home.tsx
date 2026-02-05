
import { ChatList } from '@/components/chat/chat-list'
import { NewChatModal } from '@/components/chat/new-chat-modal'
import CircleBackground from '@/components/shared/circle-background'
import { DismissKeyboard } from '@/components/shared/dismiss-keyboard'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useChat } from '@/contexts/chat-context'
import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

const ChatHome = () => {
    const { search, setSearch, getOrCreateConversation } = useChat()
    const [isModalVisible, setModalVisible] = useState(false)

    const handleSelectUser = async (userId: number) => {
        await getOrCreateConversation(userId)
        router.navigate("/(app)/chat/chat-details")
    }

    return (
        <CircleBackground className='p-6'>
            <DismissKeyboard withSafeArea={false}>
                <View className='mb-4 flex-row justify-between items-center'>
                    <View>
                        <Text className='text-3xl font-bold tracking-tight'>Discussions</Text>
                        <Text className='text-muted-foreground text-sm'>Vos messages en temps réel</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        className="bg-primary w-12 h-12 rounded-full items-center justify-center active:opacity-80"
                    >
                        <MaterialIcons name="chat" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View className='relative flex-row items-center gap-2'>
                    <View className="flex-1 relative justify-center">
                        <View className="absolute left-4 z-10">
                            <MaterialIcons name="search" size={20} color="#64748b" />
                        </View>
                        <Input
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Rechercher une conversation..."
                            className="pl-11 h-12 bg-white/60 dark:bg-muted/40 border-border/50 rounded-2xl"
                        />
                    </View>
                </View>

                <ChatList />

                <NewChatModal
                    visible={isModalVisible}
                    onClose={() => setModalVisible(false)}
                    onSelectUser={handleSelectUser}
                />
            </DismissKeyboard>
        </CircleBackground>
    )
}

export default ChatHome