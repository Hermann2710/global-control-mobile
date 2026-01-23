import CircleBackground from '@/components/shared/circle-background';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUpload } from "@/contexts/upload-context";
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function QueueScreen() {
    const { queue, tailleQueue, isSyncing, reessayerTout, viderLaQueue, supprimerItem } = useUpload();

    const handleConfirmDelete = (id: string) => {
        Alert.alert(
            "Supprimer",
            "Voulez-vous retirer cet élément de la file ?",
            [
                { text: "Annuler", style: "cancel" },
                { text: "Supprimer", style: "destructive", onPress: () => supprimerItem(id) }
            ]
        );
    };

    return (
        <CircleBackground className='p-4'>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-2xl font-bold mb-6 text-foreground">File d&apos;attente</Text>

                {/* Bannière d'état - Bordures renforcées */}
                {tailleQueue > 0 && (
                    <View className={`p-4 rounded-2xl mb-6 flex-row items-center border border-border ${isSyncing ? 'bg-primary/400' : "bg-foreground"}`}>
                        <ActivityIndicator animating={isSyncing} color={isSyncing ? "#2563eb" : "#f97316"} />
                        <View className="ml-3 flex-1">
                            <Text className={`font-bold ${isSyncing ? 'text-primary' : 'text-destructive'}`}>
                                {isSyncing ? "Synchronisation..." : "En attente"}
                            </Text>
                            <Text className="text-xs text-muted-foreground">
                                {tailleQueue} formulaire(s) restant(s)
                            </Text>
                        </View>
                        {!isSyncing && (
                            <TouchableOpacity onPress={reessayerTout} className="bg-orange-500 px-4 py-2 rounded-xl shadow-sm">
                                <Text className="text-white text-xs font-bold">Relancer</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Liste des tickets - Cartes avec bordures propres */}
                {queue.length > 0 ? (
                    queue.map((item) => (
                        <Card key={item.id} className="mb-4 border border-border bg-card overflow-hidden">
                            <CardHeader className="flex-row justify-between items-start pb-2">
                                <View className="flex-1 pr-2">
                                    <CardTitle className="text-lg font-bold text-card-foreground leading-tight">
                                        {item.data?.operation || "Opération"}
                                    </CardTitle>
                                    <Text className="text-muted-foreground text-sm font-medium mt-1">
                                        Lot : {item.data?.numeroLot || "N/A"}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleConfirmDelete(item.id)}
                                    className="h-10 w-10 items-center justify-center rounded-full bg-destructive/10"
                                >
                                    <Ionicons name="trash" size={18} color="#ef4444" />
                                </TouchableOpacity>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <View className="flex-row justify-between items-center mb-3">
                                    <Text className="text-muted-foreground text-xs uppercase tracking-wider">
                                        {item.data?.produitType}
                                    </Text>
                                    <View className="bg-secondary/50 px-3 py-1 rounded-full border border-border/50">
                                        <Text className="text-xs font-semibold text-secondary-foreground">{item.uris.length} photo(s)</Text>
                                    </View>
                                </View>

                                {/* Séparateur visuel */}
                                <View className="h-[1px] bg-border/40 w-full mb-3" />

                                <View className="flex-row items-center">
                                    <Ionicons name="time-outline" size={14} color="#94a3b8" />
                                    <Text className="text-slate-400 text-xs ml-1 italic">
                                        Enregistré à {new Date(parseInt(item.id.split('_')[0])).toLocaleTimeString()}
                                    </Text>
                                </View>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <View className="mt-20 items-center">
                        <View className="h-24 w-24 bg-secondary/30 rounded-full items-center justify-center mb-4">
                            <Ionicons name="cloud-done" size={48} color="#94a3b8" />
                        </View>
                        <Text className="text-muted-foreground text-center text-lg font-medium">
                            Votre file d&apos;attente est vide
                        </Text>
                    </View>
                )}

                {tailleQueue > 0 && (
                    <TouchableOpacity
                        onPress={viderLaQueue}
                        className="mt-8 mb-10 py-4 border border-destructive/20 rounded-2xl"
                    >
                        <Text className="text-destructive font-bold text-center">Vider toute la file d&apos;attente</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </CircleBackground>
    );
}