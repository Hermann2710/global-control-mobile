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
    const form = useForm({
        resolver: zodResolver(cacaoSchema),
        defaultValues: {
            numerotLot: numeroLot,
            productType: produitType,
            data: {
                numTest: '',
                technicien: '',
                poidsEchantillon: '',
                date: new Date(),
                th: '',
                provenance: '',
                typeSacs: 'Jute',
                conditionnement: 'Neuf',
                observations: '',
                // Sections Logistiques
                tv: { numCamion: '', tvCode: '', breSacsTV: 0, poidsNetTV: '', numConteneur: 0 },
                exp: { numLot: '', breSacs: 0, poidsNet: '', numConteneur: 0 },
                em: { numLot: '', breSacs: 0, numConteneur: '', poidsNet: '' },
                // Sections Physiques
                humidite: { val1: '', val2: '', val3: '' },
                tamissage: '',
                triage: { crabots: '', brisures: '', fragCoques: '' },
                matEtrangere: '',
                grainage: '',
                testCoupe: { moisies: '', ardoisees: '', violettes: '', whiteSpots: '' },
                defectueuses: { mitees: '', plates: '', germees: '' },
                sensoriel: 'No Smoky'
            }
        }
    });

    const [activeStep, setActiveStep] = useState<string>('step-0');

    const onSubmit = (data: CacaoFormData) => {
        console.log("Données Cacao validées :", data);
    };

    const renderInput = (path: any, label: string, placeholder = "0", keyboard: "numeric" | "default" = "numeric") => {
        const error = path.split('.').reduce((obj: any, key: string) => obj?.[key], form.formState.errors);

        return (
            <View className="gap-1.5 flex-1 mb-2">
                <Label className="text-xs uppercase text-muted-foreground">{label}</Label>
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
                {error && <Text className="text-destructive text-[10px]">{error.message}</Text>}
            </View>
        );
    };

    return (
        <FormProvider {...form}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <Accordion value={activeStep} onValueChange={setActiveStep} type='single' collapsible={false}>

                    {/* SECTION 0: LOGISTIQUE (IDENTIFICATION IMAGE) */}
                    <FormSection value='step-0' title='0. Logistique & Transport' iconName='bus-outline'>
                        <View className='gap-4'>
                            <Text className="font-bold text-sm border-b border-border pb-1">Transport (TV)</Text>
                            <View className="flex-row gap-2">
                                {renderInput('data.tv.numCamion', "N° Camion", "ABC-123", "default")}
                                {renderInput('data.tv.tvCode', "Code TV", "CODE", "default")}
                            </View>
                            <View className="flex-row gap-2">
                                {renderInput('data.tv.breSacsTV', "Sacs (TV)")}
                                {renderInput('data.tv.numConteneur', "N° Cont.")}
                            </View>

                            <Text className="font-bold text-sm border-b border-border pb-1 mt-2">Expertise & Provenance</Text>
                            <View className="flex-row gap-2">
                                {renderInput('data.provenance', "Provenance", "Région", "default")}
                                {renderInput('data.th', "T.H", "Valeur", "default")}
                            </View>

                            <Button onPress={() => setActiveStep('step-1')} className="mt-2">
                                <Text>Suivant : Mesures Physiques</Text>
                            </Button>
                        </View>
                    </FormSection>

                    {/* SECTION 1: HUMIDITÉ & TRIAGE */}
                    <FormSection value='step-1' title='1-3. Humidité & Triage' iconName='flask-outline'>
                        <View className='gap-4'>
                            {renderInput('data.numTest', "Numéro de Test", "T-001", "default")}
                            <Text className="font-bold text-sm">1. Humidité (%)</Text>
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
                                {renderInput('data.triage.fragCoques', "Coques")}
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
                                {renderInput('data.testCoupe.violettes', "Violettes")}
                                {renderInput('data.testCoupe.whiteSpots', "W. Spots")}
                            </View>
                            <Button onPress={() => setActiveStep('step-3')} className="mt-2"><Text>Suivant</Text></Button>
                        </View>
                    </FormSection>

                    {/* SECTION 3: FINALISATION */}
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
                                {['Smoky', 'No Smoky', 'Other'].map((label) => (
                                    <View key={label} className="items-center gap-1">
                                        <Text className="text-[10px] uppercase font-bold">{label}</Text>
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

                            {renderInput('data.poidsEchantillon', "9. Poids Échantillon (g)")}
                            {renderInput('data.technicien', "Technicien / GCS", "Nom", "default")}

                            <Button variant="default" className="bg-primary h-14 mt-4" onPress={form.handleSubmit(onSubmit)}>
                                <Text className="text-primary-foreground font-bold uppercase">Enregistrer le contrôle cacao</Text>
                            </Button>
                        </View>
                    </FormSection>
                </Accordion>
            </ScrollView>
        </FormProvider>
    );
}