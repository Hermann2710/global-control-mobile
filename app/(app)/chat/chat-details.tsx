/* eslint-disable react-hooks/exhaustive-deps */
import { ChatHeader } from '@/components/chat/chat-header'
import { ChatInput } from '@/components/chat/chat-input'
import { MessageBubble } from '@/components/chat/message-bubble'
import CircleBackground from '@/components/shared/circle-background'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/contexts/auth-context'
import { useChat } from '@/contexts/chat-context'
import { format, isSameDay, isToday, isYesterday } from 'date-fns'
import { fr } from 'date-fns/locale'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, KeyboardAvoidingView, Platform, View, ViewToken } from 'react-native'

const ChatDetails = () => {
    const { activeConversation, setActiveConversation, sendMessage, markAsRead, sending } = useChat()
    const { user: me } = useAuth()
    const [content, setContent] = useState('')
    const flatListRef = useRef<FlatList>(null)

    useEffect(() => {
        if (activeConversation) {
            markAsRead()
        }
    }, [activeConversation?.id])

    const chatItems = useMemo(() => {
        if (!activeConversation?.messages) return []
        const sorted = [...activeConversation.messages].sort((a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        const items: any[] = []
        let lastDate: Date | null = null
        sorted.forEach((msg) => {
            const msgDate = new Date(msg.createdAt)
            if (!lastDate || !isSameDay(msgDate, lastDate)) {
                items.push({ type: 'date', date: msgDate, id: `date-${msg.id}` })
                lastDate = msgDate
            }
            items.push({ type: 'message', ...msg })
        })
        return items
    }, [activeConversation?.messages])

    const onViewableItemsChanged = useCallback(async ({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (!activeConversation || !me) return
        const hasUnread = viewableItems.some(i =>
            i.item.type === 'message' && !i.item.isRead && i.item.sender?.id !== me.id
        )
        if (hasUnread) await markAsRead()
    }, [activeConversation?.id, me?.id])

    const renderItem = useCallback(({ item }: any) => {
        if (item.type === 'date') {
            return (
                <View className="items-center my-4">
                    <View className="bg-muted/50 px-3 py-1 rounded-full">
                        <Text className="text-[10px] font-bold uppercase">
                            {isToday(item.date) ? "Aujourd'hui" : isYesterday(item.date) ? "Hier" : format(item.date, 'd MMMM yyyy', { locale: fr })}
                        </Text>
                    </View>
                </View>
            )
        }
        return <MessageBubble item={item} isMine={item.sender?.id === me?.id} />
    }, [me?.id])

    const handleSend = useCallback(async () => {
        if (!content.trim() || sending) return
        await sendMessage(content.trim())
        setContent('')
    }, [content, sending, sendMessage])

    if (!activeConversation) return null
    const partner = activeConversation.user1.id === me?.id ? activeConversation.user2 : activeConversation.user1

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
            <CircleBackground>
                <ChatHeader partner={partner} onBack={() => setActiveConversation(null)} />
                <FlatList
                    className='px-6'
                    ref={flatListRef}
                    data={chatItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                    initialNumToRender={15}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                />
                <ChatInput value={content} onChange={setContent} onSend={handleSend} disabled={sending || !content.trim()} />
            </CircleBackground>
        </KeyboardAvoidingView>
    )
}

export default ChatDetails