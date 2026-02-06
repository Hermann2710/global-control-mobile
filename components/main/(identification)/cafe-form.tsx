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
import { useUpload } from '@/contexts/upload-context';
import { CafeFormData, cafeSchema } from '@/schemas/cafe-schema';

export default function CafeForm({ produitType, numeroLot }: { produitType: string; numeroLot: string }) {
    const { addToQueue } = useUpload()
    const form = useForm({
        resolver: zodResolver(cafeSchema),
        defaultValues: {
            productType: produitType,
            numeroLot: numeroLot,
            data: {
                date: new Date(),
                numTest: '',
                operateur: '',
                th: '',
                provenance: '',
                typeSacs: 'Jute',
                conditionnement: 'Neuf',
                observations: '',
                // Sections issues du nouveau schéma
                tv: { numCamion: '', tvCode: '', breSacsTV: 0, poidsNetTV: '', numConteneur: 0 },
                exp: { numLot: '', breSacs: 0, poidsNet: '', numConteneur: 0 },
                em: { numLot: '', breSacs: 0, numConteneur: '', poidsNet: '' },
                // Champs techniques
                humidite: { val1: '', val2: '', val3: '' },
                piqueeScolytee: '',
                ditesSeches: '',
                fevesNoires: '',
                fevesDemiNoires: '',
                brisures: '',
                coquilles: '',
                cerises: '',
                grossesPeaux: '',
                petitesPeaux: '',
                fevesBlanches: '',
                fevesEnParche: '',
                fevesVertes: '',
                indesirables: '',
                coquesPalmistes: '',
                fevesMoisies: '',
                bois: { g: '', m: '', p: '' },
                pierres: '',
                calibrage: { "20": '', "18": '', "17": '', "16": '', "15": '', "14": '', "13": '', "10": '', fond: '' }
            }
        }
    });

    const [activeStep, setActiveStep] = useState<string>('step-0');

    const onSubmit = async (values: CafeFormData) => {
        await addToQueue([], "/images/upload", values)
    };

    const renderField = (path: any, label: string, placeholder = "0", keyboard = "numeric" as any) => {
        const error = path.split('.').reduce((obj: any, key: string) => obj?.[key], form.formState.errors);

        return (
            <View className="gap-1.5 flex-1 mb-2">
                <Label className="text-sm font-medium">{label}</Label>
                <Controller
                    control={form.control}
                    name={path}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            placeholder={placeholder}
                            keyboardType={keyboard}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value?.toString() ?? ''}
                            className={error ? "border-destructive" : ""}
                        />
                    )}
                />
                {error && <Text className="text-destructive text-xs">{error.message}</Text>}
            </View>
        );
    };

    return (
        <FormProvider {...form}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <Accordion value={activeStep} onValueChange={setActiveStep} type='single' collapsible={false}>

                    {/* SECTION 0 : LOGISTIQUE (TV, EXP, EM) */}
                    <FormSection value='step-0' title='0. Identification & Logistique' iconName='bus-outline'>
                        <View className='gap-4'>
                            <Text className="font-bold border-b border-border pb-1">Transport (TV)</Text>
                            <View className="flex-row gap-2">
                                {renderField('data.tv.numCamion', "N° Camion", "ABC-123", "default")}
                                {renderField('data.tv.tvCode', "Code TV", "CODE", "default")}
                            </View>
                            <View className="flex-row gap-2">
                                {renderField('data.tv.breSacsTV', "Sacs (TV)")}
                                {renderField('data.tv.poidsNetTV', "Poids Net (TV)")}
                            </View>
                            {renderField('data.tv.numConteneur', "N° Conteneur (TV)")}

                            <Text className="font-bold border-b border-border pb-1 mt-2">Exportation (EXP)</Text>
                            {renderField('data.exp.numLot', "N° Lot EXP", "Lot-EXP", "default")}
                            <View className="flex-row gap-2">
                                {renderField('data.exp.breSacs', "Sacs (EXP)")}
                                {renderField('data.exp.poidsNet', "Poids Net (EXP)")}
                            </View>

                            <Text className="font-bold border-b border-border pb-1 mt-2">Emballage (EM)</Text>
                            <View className="flex-row gap-2">
                                {renderField('data.em.numLot', "N° Lot EM", "Lot-EM", "default")}
                                {renderField('data.em.numConteneur', "N° Cont. EM", "CONT-EM", "default")}
                            </View>

                            <Button onPress={() => setActiveStep('step-1')} className="mt-4">
                                <Text>Suivant : Analyse Café</Text>
                            </Button>
                        </View>
                    </FormSection>

                    {/* SECTION 1 : HUMIDITÉ & TEST */}
                    <FormSection value='step-1' title='1. Humidité & Test' iconName='water-outline'>
                        <View className='gap-4'>
                            {renderField('data.numTest', "Numéro de Test", "T-001", "default")}
                            <Text className="font-bold mt-2">Mesures d&apos;humidité (%)</Text>
                            <View className="flex-row gap-2">
                                {renderField('data.humidite.val1', "Val 1")}
                                {renderField('data.humidite.val2', "Val 2")}
                                {renderField('data.humidite.val3', "Val 3")}
                            </View>
                            {renderField('data.provenance', "Provenance", "Région", "default")}
                            <Button onPress={() => setActiveStep('step-4')} className="mt-4">
                                <Text>Aller au Calibrage</Text>
                            </Button>
                        </View>
                    </FormSection>

                    {/* SECTION 3 : CALIBRAGE & FINALISATION */}
                    <FormSection value='step-3' title='3. Calibrage & Envoi' iconName='grid-outline'>
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
                                {renderField('data.observations', "Observations (Optionnel)", "...", "default")}
                            </View>

                            <Button
                                variant="default"
                                className="bg-primary h-14 mt-4"
                                onPress={form.handleSubmit(onSubmit)}
                            >
                                <Text className="text-white font-bold">Valider l&apos;Analyse Café</Text>
                            </Button>
                        </View>
                    </FormSection>

                </Accordion>
            </ScrollView>
        </FormProvider>
    );
}