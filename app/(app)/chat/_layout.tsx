import { ChatProvider } from '@/contexts/chat-context'
import { Stack } from 'expo-router'
import React from 'react'

const ChatLayout = () => {
    return (
        <ChatProvider>
            <Stack initialRouteName="home" screenOptions={{
                headerShown: false,
            }} />
        </ChatProvider>
    )
}

export default ChatLayout