import BackButton from "@/components/shared/back-button";
import { DismissKeyboard } from "@/components/shared/dismiss-keyboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { pickImageFromCamera, pickImageFromLibrary } from "@/lib/image-picker";
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native';
import { AddPhotoButton } from "../add-photo-item";
import { PhotoItem } from "../photo-item";

interface PhotoPageViewProps {
    operation: string;
    produitType: string;
    numeroLot: string;
    onSubmit: (images: string[], pvNumber?: string) => Promise<void>;
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
    const [pvNumber, setPvNumber] = useState("");

    const isSampling = operation.includes("ECHANTILLONNAGE");

    const handleAddImage = async (source: 'camera' | 'library') => {
        const uri = source === 'camera' ? await pickImageFromCamera(true) : await pickImageFromLibrary();
        if (uri) setImages((prev) => [...prev, uri]);
    };

    const handleAddImagePress = () => {
        Alert.alert("Add Photo", "Choose a source", [
            { text: "Camera", onPress: () => handleAddImage('camera') },
            { text: "Gallery", onPress: () => handleAddImage('library') },
            { text: "Cancel", style: "cancel" },
        ]);
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <DismissKeyboard withSafeArea={false}>
            <View className="flex-1 relative px-4">
                <BackButton className="mb-6" />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    <Text className="text-2xl text-primary font-bold mb-2 uppercase">
                        {operation.replace(/_/g, ' ')}
                    </Text>

                    <Text className="text-muted-foreground mb-6 uppercase">
                        {produitType} {numeroLot ? `— Lot: ${numeroLot}` : ""}
                    </Text>

                    {isSampling && (
                        <View className="mb-6 gap-2">
                            <Label className="uppercase font-bold text-xs text-primary">Numéro de PV</Label>
                            <Input
                                placeholder="Numero de PV..."
                                value={pvNumber}
                                onChangeText={setPvNumber}
                                className="h-12 bg-card"
                            />
                        </View>
                    )}

                    <Label className="uppercase font-bold text-xs text-primary mb-3">
                        Photos ({images.length}/20)
                    </Label>

                    <View className="flex-row flex-wrap gap-3">
                        {images.map((uri, index) => (
                            <PhotoItem key={uri} uri={uri} onRemove={() => removeImage(index)} />
                        ))}

                        {images.length < 20 && (
                            <AddPhotoButton
                                onPress={handleAddImagePress}
                                isFullWidth={images.length === 0}
                            />
                        )}
                    </View>
                </ScrollView>

                <View className="py-6 w-full bottom-0 left-4 absolute">
                    <Button
                        onPress={() => onSubmit(images, pvNumber)}
                        disabled={images.length === 0 || isUploading || (isSampling && !pvNumber.trim())}
                        className="w-full h-14 rounded-2xl shadow-sm"
                    >
                        {isUploading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-primary-foreground font-bold text-lg">
                                Soumettre
                            </Text>
                        )}
                    </Button>
                </View>
            </View>
        </DismissKeyboard >
    );
};