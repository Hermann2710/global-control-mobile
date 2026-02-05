import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

export const ChatInput = ({
    value,
    onChange,
    onSend,
    disabled
}: { value: string, onChange: (t: string) => void, onSend: () => void, disabled: boolean }) => (
    <View className="p-4 border-t border-border/10 bg-background dark:bg-zinc-950 flex-row items-end gap-2">
        <View className="flex-1 bg-muted dark:bg-zinc-800 rounded-3xl px-4 flex-row items-center">
            <Input
                placeholder="Message..."
                value={value}
                onChangeText={onChange}
                multiline
                className="flex-1 py-3.5 text-foreground border-0 bg-transparent min-h-[50px]"
            />
            <TouchableOpacity className="ml-2">
                <MaterialIcons name="attach-file" size={22} color="#94a3b8" />
            </TouchableOpacity>
        </View>
        <Button
            onPress={onSend}
            disabled={disabled}
            className="rounded-full h-12 w-12 bg-primary items-center justify-center"
        >
            <MaterialIcons name={disabled ? "hourglass-empty" : "send"} size={20} color="white" />
        </Button>
    </View>
)