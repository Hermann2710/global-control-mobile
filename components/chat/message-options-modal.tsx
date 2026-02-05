import { Text } from '@/components/ui/text';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, TouchableOpacity, View } from 'react-native';

interface MessageOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    onDelete: () => void;
    isMine: boolean;
}

export const MessageOptionsModal = ({ visible, onClose, onDelete, isMine }: MessageOptionsModalProps) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable
                className="flex-1 bg-black/40 justify-center items-center"
                onPress={onClose}
            >
                <View className="bg-white dark:bg-zinc-900 w-[70%] rounded-2xl overflow-hidden shadow-xl">
                    {isMine && (
                        <TouchableOpacity
                            className="flex-row items-center p-4 active:bg-gray-100 dark:active:bg-zinc-800"
                            onPress={() => {
                                onDelete();
                                onClose();
                            }}
                        >
                            <MaterialIcons name="delete-outline" size={24} color="#ef4444" />
                            <Text className="ml-3 text-red-500 font-medium text-base">
                                Supprimer pour tout le monde
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        className="flex-row items-center p-4 active:bg-gray-100 dark:active:bg-zinc-800 border-t border-gray-100 dark:border-zinc-800"
                        onPress={onClose}
                    >
                        <MaterialIcons name="close" size={24} className="text-foreground" />
                        <Text className="ml-3 text-foreground text-base">Annuler</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    );
};