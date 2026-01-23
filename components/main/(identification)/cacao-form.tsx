import { CacaoFormData, cacaoSchema } from '@/schemas/cacao-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';

import { FormSection } from '@/components/shared/form-section';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';

export default function CacaoForm({ numeroLot, produitType }: { numeroLot: string, produitType: string }) {
    const form = useForm<CacaoFormData>({
        resolver: zodResolver(cacaoSchema) as any,
        defaultValues: { numerotLot: numeroLot, productType: produitType }
    });

    const [activeStep, setActiveStep] = useState<string>('step-1');

    const renderInput = (path: any, label: string, placeholder = "0") => (
        <View className="gap-1.5 flex-1">
            <Label className="text-xs uppercase text-muted-foreground">{label}</Label>
            <Controller
                control={form.control}
                name={path}
                render={({ field: { onChange, value } }) => (
                    <Input placeholder={placeholder} keyboardType="numeric" onChangeText={onChange} value={value} />
                )}
            />
        </View>
    );

    return (
        <FormProvider {...form}>
            <ScrollView className="flex-1">
                <Accordion value={activeStep} onValueChange={setActiveStep} type='single' collapsible={false}>

                    {/* SECTION 1: MESURES PHYSIQUES */}
                    <FormSection value='step-1' title='1-3. Humidité & Triage' iconName='flask-outline'>
                        <View className='gap-4'>
                            <Text className="font-bold text-sm">1. Humidité</Text>
                            <View className="flex-row gap-2">
                                {renderInput('data.humidite.val1', "Mesure 1")}
                                {renderInput('data.humidite.val2', "Mesure 2")}
                                {renderInput('data.humidite.val3', "Mesure 3")}
                            </View>

                            <Text className="font-bold text-sm mt-2">2-3. Tamissage & Triage</Text>
                            {renderInput('data.tamissage', "2. Tamissage (%)")}
                            <View className="flex-row gap-2">
                                {renderInput('data.triage.crabots', "Crabôts")}
                                {renderInput('data.triage.brisures', "Brisures")}
                                {renderInput('data.triage.fragCoques', "Frag./Coques")}
                            </View>
                            <Button onPress={() => setActiveStep('step-2')} className="mt-2"><Text>Suivant</Text></Button>
                        </View>
                    </FormSection>

                    {/* SECTION 2: QUALITÉ GRAIN & COUPE */}
                    <FormSection value='step-2' title='4-6. Grainage & Coupe' iconName='cut-outline'>
                        <View className='gap-4'>
                            <View className="flex-row gap-2">
                                {renderInput('data.matEtrangere', "4. Mat. Étrang.")}
                                {renderInput('data.grainage', "5. Grainage/600g")}
                            </View>
                            <Text className="font-bold text-sm">6. Test Coupe (300 fèves)</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {renderInput('data.testCoupe.moisies', "Moisies")}
                                {renderInput('data.testCoupe.ardoisees', "Ardoisées")}
                            </View>
                            <View className="flex-row flex-wrap gap-2">
                                {renderInput('data.testCoupe.violettes', "Violettes")}
                                {renderInput('data.testCoupe.whiteSpots', "White Spots")}
                            </View>
                            <Button onPress={() => setActiveStep('step-3')} className="mt-2"><Text>Suivant</Text></Button>
                        </View>
                    </FormSection>

                    {/* SECTION 3: DÉFECTUEUSES & SENSORIEL */}
                    <FormSection value='step-3' title='7-9. Finalisation' iconName='checkmark-circle-outline'>
                        <View className='gap-4'>
                            <Text className="font-bold text-sm">7. Défectueuses</Text>
                            <View className="flex-row gap-2">
                                {renderInput('data.defectueuses.mitees', "Mitées")}
                                {renderInput('data.defectueuses.plates', "Plates")}
                                {renderInput('data.defectueuses.germees', "Germées")}
                            </View>

                            <Text className="font-bold text-sm mt-2">8. Cont. Sensorielle</Text>
                            <View className="flex-row justify-around py-2 border border-border rounded-lg">
                                {['Smoky', 'no smoky', 'Other'].map((label) => (
                                    <View key={label} className="items-center gap-1">
                                        <Text className="text-xs">{label}</Text>
                                        <Controller
                                            control={form.control}
                                            name="data.sensoriel"
                                            render={({ field: { onChange, value } }) => (
                                                <Checkbox checked={value === label} onCheckedChange={() => onChange(label)} />
                                            )}
                                        />
                                    </View>
                                ))}
                            </View>

                            {renderInput('data.poidsEchantillon', "9. Poids de l'échantillon", "Poids en g")}

                            <View className="mt-4 p-4 bg-muted rounded-xl">
                                {renderInput('data.technicien', "Nom du Technicien / GCS", "Nom")}
                            </View>

                            <Button variant="default" className="bg-primary h-14 mt-4" onPress={form.handleSubmit(console.log)}>
                                <Text className="text-primary-foreground font-bold">Enregistrer le contrôle cacao</Text>
                            </Button>
                        </View>
                    </FormSection>
                </Accordion>
            </ScrollView>
        </FormProvider>
    );
}