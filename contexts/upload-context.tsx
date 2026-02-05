import { useIsOnline } from "@/hooks/use-is-online";
import api from "@/lib/api";
import { FileService } from "@/lib/file-system";
import { getErrorMessage } from "@/lib/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Toast from "react-native-toast-message";

const CLE_STOCKAGE_QUEUE = "@file_attente_upload";

export interface ItemQueue {
    id: string;
    uris: string[];
    endpoint: string;
    metadonnees: { nom: string; taille: number; type: string }[];
    data?: Record<string, any>;
}

interface UploadContextType {
    ajouterALaQueue: (uris: string | string[], endpoint: string, data?: Record<string, any>) => Promise<void>;
    isSyncing: boolean;
    isUploading: boolean;
    tailleQueue: number;
    queue: ItemQueue[];
    reessayerTout: () => Promise<void>;
    viderLaQueue: () => Promise<void>;
    supprimerItem: (id: string) => Promise<void>;
}

export const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider = ({ children }: { children: React.ReactNode }) => {
    const estEnLigne = useIsOnline();
    const [isSyncing, setIsSyncing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [queue, setQueue] = useState<ItemQueue[]>([]);
    const [tailleQueue, setTailleQueue] = useState(0);

    const chargerDonneesDepuisStockage = useCallback(async (): Promise<ItemQueue[]> => {
        const data = await AsyncStorage.getItem(CLE_STOCKAGE_QUEUE);
        return data ? JSON.parse(data) : [];
    }, []);

    const sauvegarderEtActualiser = useCallback(async (nouvelleQueue: ItemQueue[]) => {
        await AsyncStorage.setItem(CLE_STOCKAGE_QUEUE, JSON.stringify(nouvelleQueue));
        setQueue(nouvelleQueue);
        setTailleQueue(nouvelleQueue.length);
    }, []);

    const rafraichirQueue = useCallback(async () => {
        const data = await chargerDonneesDepuisStockage();
        setQueue(data);
        setTailleQueue(data.length);
    }, [chargerDonneesDepuisStockage]);

    useEffect(() => {
        FileService.init().then(rafraichirQueue);
    }, [rafraichirQueue]);

    const envoyerFichiers = useCallback(async (item: ItemQueue) => {
        const formData = new FormData();
        item.uris.forEach((uriOuNom, index) => {
            const meta = item.metadonnees[index];

            // Reconstruction dynamique du chemin pour iOS
            const uriFinale = uriOuNom.startsWith('file://')
                ? uriOuNom
                : FileService.obtenirUriComplete(uriOuNom);

            // @ts-ignore
            formData.append('files', { uri: uriFinale, name: meta.nom, type: meta.type });
        });

        if (item.data) {
            Object.keys(item.data).forEach(key => {
                formData.append(key, String(item.data![key]));
            });
        }

        return await api.post(item.endpoint, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }, []);

    const supprimerFichiersSilencieusement = async (uris: string[]) => {
        await Promise.allSettled(uris.map(u => FileService.supprimerFichier(u)));
    };

    const sauvegarderEnLocal = useCallback(async (uris: string[], endpoint: string, data?: Record<string, any>) => {
        try {
            const fichiersPersistes = await Promise.all(uris.map(u => FileService.persisterFichier(u)));
            const actuelle = await chargerDonneesDepuisStockage();

            const nouvelItem: ItemQueue = {
                id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                uris: fichiersPersistes.map(f => f.nom), // Stocke uniquement les noms
                endpoint,
                metadonnees: fichiersPersistes.map(f => ({ nom: f.nom, taille: f.taille, type: f.type })),
                data
            };

            await sauvegarderEtActualiser([...actuelle, nouvelItem]);
            Toast.show({ type: 'info', text1: 'Sauvegardé localement' });
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Erreur stockage', text2: getErrorMessage(error) });
        }
    }, [chargerDonneesDepuisStockage, sauvegarderEtActualiser]);

    const ajouterALaQueue = async (uri: string | string[], endpoint: string, data?: Record<string, any>) => {
        const uris = Array.isArray(uri) ? uri : [uri];
        if (estEnLigne) {
            setIsUploading(true);
            try {
                const tempItem: ItemQueue = {
                    id: 'temp', uris, endpoint,
                    metadonnees: uris.map(u => ({ nom: u.split('/').pop() || 'img.jpg', taille: 0, type: 'image/jpeg' })),
                    data
                };
                await envoyerFichiers(tempItem);
                Toast.show({ type: 'success', text1: 'Envoyé avec succès !' });
            } catch (error) {
                console.warn("Échec direct, bascule local:", getErrorMessage(error));
                await sauvegarderEnLocal(uris, endpoint, data);
            } finally {
                setIsUploading(false);
            }
        } else {
            await sauvegarderEnLocal(uris, endpoint, data);
        }
    };

    const supprimerItem = async (id: string) => {
        const actuelle = await chargerDonneesDepuisStockage();
        const item = actuelle.find(i => i.id === id);
        if (item) await supprimerFichiersSilencieusement(item.uris);
        await sauvegarderEtActualiser(actuelle.filter(i => i.id !== id));
    };

    const traiterQueue = useCallback(async () => {
        if (isSyncing || !estEnLigne) return;
        setIsSyncing(true);
        const actuelle = await chargerDonneesDepuisStockage();
        if (actuelle.length === 0) { setIsSyncing(false); return; }

        const itemsEchoues: ItemQueue[] = [];
        let succesCount = 0;

        for (const item of actuelle) {
            try {
                await envoyerFichiers(item);
                await supprimerFichiersSilencieusement(item.uris);
                succesCount++;
            } catch (error) {
                itemsEchoues.push(item);
                console.error(`Erreur synchro ${item.id}:`, getErrorMessage(error));
            }
        }

        await sauvegarderEtActualiser(itemsEchoues);
        if (succesCount > 0) Toast.show({ type: 'success', text1: 'Synchro réussie' });
        setIsSyncing(false);
    }, [chargerDonneesDepuisStockage, envoyerFichiers, estEnLigne, isSyncing, sauvegarderEtActualiser]);

    // useEffect(() => { if (estEnLigne) traiterQueue(); }, [estEnLigne, traiterQueue]);

    const viderLaQueue = async () => {
        const actuelle = await chargerDonneesDepuisStockage();
        for (const item of actuelle) await supprimerFichiersSilencieusement(item.uris);
        await sauvegarderEtActualiser([]);
        Toast.show({ type: 'success', text1: 'File d\'attente vidée' });
    };

    return (
        <UploadContext.Provider value={{
            ajouterALaQueue, isSyncing, isUploading, tailleQueue, queue, reessayerTout: traiterQueue, viderLaQueue, supprimerItem
        }}>
            {children}
        </UploadContext.Provider>
    );
};

export const useUpload = () => {
    const context = useContext(UploadContext);
    if (!context) throw new Error("useUpload doit être utilisé dans un UploadProvider");
    return context;
};