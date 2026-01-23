import { userSchema, UserType } from '@/schemas/user-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ user }: { user: UserType }) {
    const [activeSection, setActiveSection] = useState<string>('');

    const form = useForm<UserType>({
        resolver: zodResolver(userSchema),
        defaultValues: user,
    });

    const onSave = (data: UserType) => {
        console.log("Mise à jour du profil :", data);
        setActiveSection(''); // Ferme les sections après sauvegarde
    };

    const renderField = (name: keyof UserType, label: string, placeholder: string) => (
        <View className="gap-2 mb-4">
            <Label nativeID={name}>{label}</Label>
            <Controller
                control={form.control}
                name={name as any}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <View>
                        <Input
                            placeholder={placeholder}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value?.toString()}
                            className={error ? "border-destructive" : ""}
                        />
                        {error && <Text className="text-destructive text-xs mt-1">{error.message}</Text>}
                    </View>
                )}
            />
        </View>
    );

    if (!user) return null;

    return (
        <FormProvider {...form}>
            <ScrollView className="flex-1 px-5">
                {/* Header Profil */}
                <View className="items-center py-8">
                    <Avatar alt='' className="w-24 h-24 border-2 border-primary">
                        <AvatarImage source={{ uri: user.profileImage || '' }} />
                        <AvatarFallback>
                            <Text className="text-2xl">{user.firstName[0]}{user.lastName[0]}</Text>
                        </AvatarFallback>
                    </Avatar>
                    <Text className="text-2xl font-bold mt-4">{user.firstName} {user.lastName}</Text>
                    <Text className="text-muted-foreground">{user.role} • {user.ville}</Text>
                </View>

                <Accordion
                    type="single"
                    collapsible
                    value={activeSection}
                    onValueChange={setActiveSection}
                    className="w-full"
                >
                    {/* Section Informations Personnelles */}
                    <AccordionItem value="personal">
                        <AccordionTrigger>
                            <View className="flex-row items-center gap-3">
                                <Ionicons name="person-outline" size={20} color="gray" />
                                <Text className="font-semibold">Informations Personnelles</Text>
                            </View>
                        </AccordionTrigger>
                        <AccordionContent>
                            <View className="pt-4">
                                <View className="flex-row gap-4">
                                    <View className="flex-1">{renderField('firstName', 'Prénom', 'Jean')}</View>
                                    <View className="flex-1">{renderField('lastName', 'Nom', 'Dupont')}</View>
                                </View>
                                {renderField('email', 'Email', 'jean.dupont@exemple.com')}
                                {renderField('phoneNumber_1', 'Téléphone Principal', '+237...')}
                            </View>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Section Localisation */}
                    <AccordionItem value="location">
                        <AccordionTrigger>
                            <View className="flex-row items-center gap-3">
                                <Ionicons name="location-outline" size={20} color="gray" />
                                <Text className="font-semibold">Localisation</Text>
                            </View>
                        </AccordionTrigger>
                        <AccordionContent>
                            <View className="pt-4">
                                {renderField('ville', 'Ville', 'Yaoundé')}
                                {renderField('location', 'Adresse précise', 'Quartier...')}
                            </View>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Section Statut & Système (Lecture seule ou spécifique) */}
                    <AccordionItem value="system">
                        <AccordionTrigger>
                            <View className="flex-row items-center gap-3">
                                <Ionicons name="shield-checkmark-outline" size={20} color="gray" />
                                <Text className="font-semibold">Statut du compte</Text>
                            </View>
                        </AccordionTrigger>
                        <AccordionContent>
                            <View className="pt-4 gap-2">
                                <View className="flex-row justify-between p-3 bg-muted rounded-lg">
                                    <Text className="font-medium">Rôle</Text>
                                    <Text>{user.role}</Text>
                                </View>
                                <View className="flex-row justify-between p-3 bg-muted rounded-lg">
                                    <Text className="font-medium">Statut</Text>
                                    <Text className="text-green-600">{user.status}</Text>
                                </View>
                            </View>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* Bouton de Sauvegarde global */}
                <View className="py-8">
                    <Button
                        onPress={form.handleSubmit(onSave)}
                        className="h-14 rounded-2xl shadow-lg"
                    >
                        <Text className="text-primary-foreground font-bold text-lg">Enregistrer les modifications</Text>
                    </Button>
                </View>
            </ScrollView>
        </FormProvider>
    );
}