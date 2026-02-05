import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Text } from '@/components/ui/text'
import { constants } from '@/lib/constants'
import { UserType } from '@/schemas/user-schema'
import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

export const ChatHeader = ({ partner, onBack }: { partner: UserType, onBack: () => void }) => (
    <View className="flex-row items-center px-4 py-3 border-b border-border/10 bg-white/50 dark:bg-zinc-900/50">
        <TouchableOpacity onPress={() => { onBack(); router.back(); }} className="mr-3">
            <MaterialIcons name="arrow-back" size={24} className="text-foreground" />
        </TouchableOpacity>

        <Avatar alt={partner.firstName} className="h-10 w-10">
            <AvatarImage source={{ uri: `${constants.api.uploadsUrl}/${partner.profileImage}` }} />
            <AvatarFallback><Text>{partner.firstName[0]}</Text></AvatarFallback>
        </Avatar>

        <View className="ml-3 flex-1">
            <Text className="font-bold text-foreground" numberOfLines={1}>
                {partner.firstName} {partner.lastName}
            </Text>
            <Text className="text-[10px] text-green-500 font-medium">En ligne</Text>
        </View>
    </View>
)