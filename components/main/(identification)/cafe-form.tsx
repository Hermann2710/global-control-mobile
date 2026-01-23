import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';

import { FormSection } from '@/components/shared/form-section';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { CafeFormData, cafeSchema } from '@/schemas/cafe-schema';

export default function CafeForm({ produitType, numeroLot }: { produitType: string; numeroLot: string }) {
    const form = useForm<CafeFormData>({
        resolver: zodResolver(cafeSchema),
        defaultValues: {
            productType: produitType,
            numeroLot: numeroLot,
            data: {
                date: new Date(),
                humidite: { val1: '', val2: '', val3: '' },
                bois: { g: '', m: '', p: '' },
                calibrage: { "20": '', "18": '', "17": '', "16": '', "15": '', "14": '', "13": '', "10": '', fond: '' }
            }
        }
    });

    const [activeStep, setActiveStep] = useState<string>('step-1');

    const onSubmit = (data: CafeFormData) => {
        console.log("Données envoyées :", data);
    };

    // Petit helper pour générer les champs rapidement
    const renderField = (path: any, label: string, placeholder = "0", keyboard = "numeric" as any) => (
        <View className="gap-1.5 flex-1">
            <Label className="text-sm">{label}</Label>
            <Controller
                control={form.control}
                name={path}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        placeholder={placeholder}
                        keyboardType={keyboard}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
        </View>
    );

    return (
        <FormProvider {...form}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <Accordion value={activeStep} onValueChange={setActiveStep} type='single' collapsible={false}>

                    {/* SECTION 1 : HUMIDITÉ & INFOS GÉNÉRALES */}
                    <FormSection value='step-1' title='1. Humidité & Test' iconName='water-outline'>
                        <View className='gap-4'>
                            {renderField('data.numTest', "Numéro de Test", "Ex: T-001", "default")}
                            <Text className="font-bold mt-2">Mesures d&apos;humidité (%)</Text>
                            <View className="flex-row gap-2">
                                {renderField('data.humidite.val1', "Val 1")}
                                {renderField('data.humidite.val2', "Val 2")}
                                {renderField('data.humidite.val3', "Val 3")}
                            </View>
                            <Button onPress={() => setActiveStep('step-2')} className="mt-4">
                                <Text>Suivant : Défauts Physiques</Text>
                            </Button>
                        </View>
                    </FormSection>

                    {/* SECTION 2 : DÉFAUTS PHYSIQUES */}
                    <FormSection value='step-2' title='2. Défauts & Matières' iconName='flask-outline'>
                        <View className='gap-3'>
                            <View className="flex-row gap-2">
                                {renderField('data.piqueeScolytee', "Piquée")}
                                {renderField('data.ditesSeches', "Sèches")}
                            </View>
                            <View className="flex-row gap-2">
                                {renderField('data.fevesNoires', "Noires")}
                                {renderField('data.fevesDemiNoires', "1/2 Noires")}
                            </View>
                            <View className="flex-row gap-2">
                                {renderField('data.fevesMoisies', "Moisies")}
                                {renderField('data.fevesBlanches', "Blanches")}
                            </View>
                            <View className="flex-row gap-2">
                                {renderField('data.brisures', "Brisures")}
                                {renderField('data.coquilles', "Coquilles")}
                            </View>
                            <View className="flex-row gap-2">
                                {renderField('data.cerises', "Cerises")}
                                {renderField('data.fevesEnParche', "Parche")}
                            </View>
                            <View className="flex-row gap-2">
                                {renderField('data.fevesVertes', "Vertes")}
                                {renderField('data.indesirables', "Indésirables")}
                            </View>
                            <View className="flex-row gap-2">
                                {renderField('data.grossesPeaux', "Gr. Peaux")}
                                {renderField('data.petitesPeaux', "Pet. Peaux")}
                                {renderField('data.coquesPalmistes', "Palmistes")}
                            </View>
                            <Button onPress={() => setActiveStep('step-3')} className="mt-4">
                                <Text>Suivant : Corps étrangers</Text>
                            </Button>
                        </View>
                    </FormSection>

                    {/* SECTION 3 : CORPS ÉTRANGERS (BOIS & PIERRES) */}
                    <FormSection value='step-3' title='3. Corps Étrangers' iconName='construct-outline'>
                        <View className='gap-4'>
                            <Text className="font-bold">Débris de Bois (g)</Text>
                            <View className="flex-row gap-2">
                                {renderField('data.bois.g', "Grand")}
                                {renderField('data.bois.m', "Moyen")}
                                {renderField('data.bois.p', "Petit")}
                            </View>
                            {renderField('data.pierres', "Pierres (g)")}
                            <Button onPress={() => setActiveStep('step-4')} className="mt-4">
                                <Text>Suivant : Calibrage</Text>
                            </Button>
                        </View>
                    </FormSection>

                    {/* SECTION 4 : CALIBRAGE */}
                    <FormSection value='step-4' title='4. Calibrage' iconName='grid-outline'>
                        <View className='gap-3'>
                            <View className="flex-row flex-wrap gap-2">
                                {renderField('data.calibrage.20', "C20")}
                                {renderField('data.calibrage.18', "C18")}
                                {renderField('data.calibrage.17', "C17")}
                            </View>
                            <View className="flex-row flex-wrap gap-2">
                                {renderField('data.calibrage.16', "C16")}
                                {renderField('data.calibrage.15', "C15")}
                                {renderField('data.calibrage.14', "C14")}
                            </View>
                            <View className="flex-row flex-wrap gap-2">
                                {renderField('data.calibrage.13', "C13")}
                                {renderField('data.calibrage.10', "C10")}
                                {renderField('data.calibrage.fond', "Fond")}
                            </View>
                            <View className="mt-4 border-t border-border pt-4">
                                {renderField('data.operateur', "Nom de l'Opérateur", "Nom", "default")}
                            </View>
                            <Button variant="default" className="bg-primary h-14 mt-4" onPress={form.handleSubmit(onSubmit)}>
                                <Text className="text-white font-bold">Enregistrer le formulaire complet</Text>
                            </Button>
                        </View>
                    </FormSection>

                </Accordion>
            </ScrollView>
        </FormProvider>
    );
}