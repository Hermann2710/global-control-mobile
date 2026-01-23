import BackButton from "@/components/shared/back-button";
import { DismissKeyboard } from "@/components/shared/dismiss-keyboard";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { pickImageFromCamera, pickImageFromLibrary } from "@/lib/image-picker";
import React, { useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { AddPhotoButton } from "../add-photo-item";
import { PhotoItem } from "../photo-item";

interface PhotoPageViewProps {
    operation: string;
    produitType: string;
    numeroLot: string;
    onSubmit: (images: string[]) => Promise<void>;
    isUploading: boolean;
}

export const PhotoPageView = ({
    operation,
    produitType,
    numeroLot,
    onSubmit,
    isUploading
}: PhotoPageViewProps) => {
    const [images, setImages] = useState<string[]>([]);

    const handleAddImage = async (source: 'camera' | 'library') => {
        const uri = source === 'camera' ? await pickImageFromCamera(true) : await pickImageFromLibrary();
        if (uri) setImages((prev) => [...prev, uri]);
    };

    const handleAddImagePress = () => {
        Alert.alert("Ajouter une photo", "Choisissez une source", [
            { text: "Appareil photo", onPress: () => handleAddImage('camera') },
            { text: "Galerie", onPress: () => handleAddImage('library') },
            { text: "Annuler", style: "cancel" },
        ]);
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <DismissKeyboard withSafeArea={false}>
            <View className="flex-1 relative">
                <BackButton className="mb-6" />

                <Text className="text-2xl text-primary font-bold mb-2">
                    {operation} du {produitType}
                </Text>
                <Text className="text-muted-foreground mb-6">
                    Lot N°: {numeroLot || "inconnu"} — Sélectionnez vos photos (max. 5).
                </Text>

                <View className="flex-row flex-wrap gap-3">
                    {images.map((uri, index) => (
                        <PhotoItem key={uri} uri={uri} onRemove={() => removeImage(index)} />
                    ))}

                    {images.length < 5 && (
                        <AddPhotoButton
                            onPress={handleAddImagePress}
                            isFullWidth={images.length === 0}
                        />
                    )}
                </View>

                <View className="py-6 w-full bottom-0 absolute">
                    <Button
                        onPress={() => onSubmit(images)}
                        disabled={images.length === 0 || isUploading}
                        className="w-full h-14 rounded-2xl shadow-sm"
                    >
                        {isUploading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-primary-foreground font-bold text-lg">
                                Enregistrer le formulaire
                            </Text>
                        )}
                    </Button>
                </View>
            </View>
        </DismissKeyboard >
    );
};