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
import { useUpload } from '@/contexts/upload-context';

export default function CacaoForm({ numeroLot, produitType }: { numeroLot: string, produitType: string }) {
    const { addToQueue } = useUpload();
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
                tv: { numCamion: '', tvCode: '', breSacsTV: 0, poidsNetTV: '', numConteneur: 0 },
                exp: { numLot: '', breSacs: 0, poidsNet: '', numConteneur: 0 },
                em: { numLot: '', breSacs: 0, numConteneur: '', poidsNet: '' },
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

    const onSubmit = async (values: CacaoFormData) => {
        await addToQueue([], "/cacao/analysis", values);
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
                    <FormSection value='step-0' title='0-2. Humidité & Triage' iconName='flask-outline'>
                        <View className='gap-4'>
                            {renderInput('data.numTest', "Numéro de Test", "T-001", "default")}
                            <Text className="font-bold text-sm">0. Humidité (%)</Text>
                            <View className="flex-row gap-2">
                                {renderInput('data.humidite.val1', "Mesure 1")}
                                {renderInput('data.humidite.val2', "Mesure 2")}
                                {renderInput('data.humidite.val3', "Mesure 3")}
                            </View>

                            <Text className="font-bold text-sm mt-2">1-2. Tamissage & Triage</Text>
                            {renderInput('data.tamissage', "1. Tamissage (%)")}
                            <View className="flex-row gap-2">
                                {renderInput('data.triage.crabots', "2a. Crabôts")}
                                {renderInput('data.triage.brisures', "2b. Brisures")}
                                {renderInput('data.triage.fragCoques', "2c. Coques")}
                            </View>
                            <Button onPress={() => setActiveStep('step-1')} className="mt-2"><Text>Suivant</Text></Button>
                        </View>
                    </FormSection>

                    <FormSection value='step-1' title='3-5. Grainage & Coupe' iconName='cut-outline'>
                        <View className='gap-4'>
                            <View className="flex-row gap-2">
                                {renderInput('data.matEtrangere', "3. Mat. Étrang.")}
                                {renderInput('data.grainage', "4. Grainage/600g")}
                            </View>
                            <Text className="font-bold text-sm">5. Test Coupe (300 fèves)</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {renderInput('data.testCoupe.moisies', "Moisies")}
                                {renderInput('data.testCoupe.ardoisees', "Ardoisées")}
                                {renderInput('data.testCoupe.violettes', "Violettes")}
                                {renderInput('data.testCoupe.whiteSpots', "W. Spots")}
                            </View>
                            <Button onPress={() => setActiveStep('step-2')} className="mt-2"><Text>Suivant</Text></Button>
                        </View>
                    </FormSection>

                    <FormSection value='step-2' title='6-8. Finalisation' iconName='checkmark-circle-outline'>
                        <View className='gap-4'>
                            <Text className="font-bold text-sm">6. Défectueuses</Text>
                            <View className="flex-row gap-2">
                                {renderInput('data.defectueuses.mitees', "Mitées")}
                                {renderInput('data.defectueuses.plates', "Plates")}
                                {renderInput('data.defectueuses.germees', "Germées")}
                            </View>

                            <Text className="font-bold text-sm mt-2">7. Cont. Sensorielle</Text>
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

                            {renderInput('data.poidsEchantillon', "8. Poids Échantillon (g)")}
                            {renderInput('data.technicien', "Technicien / GCS", "Nom", "default")}

                            <Button onPress={() => setActiveStep('step-3')} className="mt-2">
                                <Text>Suivant</Text>
                            </Button>
                        </View>
                    </FormSection>

                    <FormSection value='step-3' title='9-11. Logistique & Transport' iconName='bus-outline'>
                        <View className='gap-4'>
                            <Text className="font-bold text-sm border-b border-border pb-1">9. Transport (TV)</Text>
                            <View className="flex-row gap-2">
                                {renderInput('data.tv.numCamion', "N° Camion", "ABC-123", "default")}
                                {renderInput('data.tv.tvCode', "Code TV", "CODE", "default")}
                            </View>
                            <View className="flex-row gap-2">
                                {renderInput('data.tv.breSacsTV', "Sacs (TV)")}
                                {renderInput('data.tv.numConteneur', "N° Cont.")}
                            </View>

                            <Text className="font-bold text-sm border-b border-border pb-1 mt-2">10. Expertise & Provenance</Text>
                            <View className="flex-row gap-2">
                                {renderInput('data.provenance', "11. Provenance", "Région", "default")}
                                {renderInput('data.th', "T.H Moyen", "Valeur", "default")}
                            </View>

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