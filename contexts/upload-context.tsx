import { useIsOnline } from "@/hooks/use-is-online";
import api from "@/lib/api";
import { FileService } from "@/lib/file-system";
import { getErrorMessage } from "@/lib/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Toast from "react-native-toast-message";

const STORAGE_KEY_QUEUE = "@upload_queue_pending";

export interface QueueItem {
    id: string;
    uris: string[];
    endpoint: string;
    metadata: { name: string; size: number; type: string }[];
    data?: Record<string, any>;
}

interface UploadContextType {
    addToQueue: (uris: string | string[], endpoint: string, data?: Record<string, any>) => Promise<void>;
    isSyncing: boolean;
    isUploading: boolean;
    queueSize: number;
    queue: QueueItem[];
    retryAll: () => Promise<void>;
    clearQueue: () => Promise<void>;
    removeItem: (id: string) => Promise<void>;
}

export const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider = ({ children }: { children: React.ReactNode }) => {
    const isOnline = useIsOnline();
    const [isSyncing, setIsSyncing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [queueSize, setQueueSize] = useState(0);

    const loadDataFromStorage = useCallback(async (): Promise<QueueItem[]> => {
        const data = await AsyncStorage.getItem(STORAGE_KEY_QUEUE);
        return data ? JSON.parse(data) : [];
    }, []);

    const saveAndRefresh = useCallback(async (newQueue: QueueItem[]) => {
        await AsyncStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(newQueue));
        setQueue(newQueue);
        setQueueSize(newQueue.length);
    }, []);

    const refreshQueue = useCallback(async () => {
        const data = await loadDataFromStorage();
        setQueue(data);
        setQueueSize(data.length);
    }, [loadDataFromStorage]);

    useEffect(() => {
        FileService.init().then(refreshQueue);
    }, [refreshQueue]);

    const sendFiles = useCallback(async (item: QueueItem) => {
        const formData = new FormData();

        item.uris.forEach((uriOrName, index) => {
            if (!uriOrName) return;
            const meta = item.metadata[index];
            const finalUri = uriOrName.startsWith('file://') || uriOrName.startsWith('content://')
                ? uriOrName
                : FileService.obtenirUriComplete(uriOrName);

            // @ts-ignore
            formData.append('files', {
                uri: finalUri,
                name: meta.name || `file_${index}`,
                type: meta.type || 'application/octet-stream'
            });
        });

        if (item.data) {
            formData.append('data', JSON.stringify(item.data));
        }

        return await api.post(item.endpoint, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }, []);

    const deleteFilesSilently = async (uris: string[]) => {
        await Promise.allSettled(uris.map(u => {
            if (u && !u.startsWith('http')) {
                return FileService.supprimerFichier(u);
            }
        }));
    };

    const saveLocally = useCallback(async (uris: string[], endpoint: string, data?: Record<string, any>) => {
        try {
            const persistedFiles = uris.length > 0
                ? await Promise.all(uris.map(u => FileService.persisterFichier(u)))
                : [];

            const current = await loadDataFromStorage();

            const newItem: QueueItem = {
                id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                uris: persistedFiles.map(f => f.nom),
                endpoint,
                metadata: persistedFiles.map(f => ({ name: f.nom, size: f.taille, type: f.type })),
                data
            };

            await saveAndRefresh([...current, newItem]);
            Toast.show({ type: 'info', text1: 'Saved locally (Offline)' });
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Local storage error', text2: getErrorMessage(error) });
        }
    }, [loadDataFromStorage, saveAndRefresh]);

    const addToQueue = async (uri: string | string[], endpoint: string, data?: Record<string, any>) => {
        const uris = Array.isArray(uri) ? uri.filter(u => !!u) : (uri ? [uri] : []);

        if (isOnline) {
            setIsUploading(true);
            try {
                const tempItem: QueueItem = {
                    id: 'temp',
                    uris,
                    endpoint,
                    metadata: uris.map(u => ({
                        name: u.split('/').pop() || 'upload',
                        size: 0,
                        type: 'application/octet-stream'
                    })),
                    data
                };
                await sendFiles(tempItem);
                Toast.show({ type: 'success', text1: 'Data sent successfully' });
            } catch (error) {
                await saveLocally(uris, endpoint, data);
            } finally {
                setIsUploading(false);
            }
        } else {
            await saveLocally(uris, endpoint, data);
        }
    };

    const removeItem = async (id: string) => {
        const current = await loadDataFromStorage();
        const item = current.find(i => i.id === id);
        if (item) await deleteFilesSilently(item.uris);
        await saveAndRefresh(current.filter(i => i.id !== id));
    };

    const processQueue = useCallback(async () => {
        if (isSyncing || !isOnline) return;
        setIsSyncing(true);
        const current = await loadDataFromStorage();
        if (current.length === 0) { setIsSyncing(false); return; }

        const failedItems: QueueItem[] = [];
        let successCount = 0;

        for (const item of current) {
            try {
                await sendFiles(item);
                await deleteFilesSilently(item.uris);
                successCount++;
            } catch (error) {
                failedItems.push(item);
            }
        }

        await saveAndRefresh(failedItems);
        if (successCount > 0) Toast.show({ type: 'success', text1: `${successCount} item(s) synchronized` });
        setIsSyncing(false);
    }, [loadDataFromStorage, sendFiles, isOnline, isSyncing, saveAndRefresh]);

    useEffect(() => {
        if (isOnline && queue.length > 0) {
            processQueue();
        }
    }, [isOnline]);

    const clearQueue = async () => {
        const current = await loadDataFromStorage();
        for (const item of current) await deleteFilesSilently(item.uris);
        await saveAndRefresh([]);
        Toast.show({ type: 'success', text1: 'Queue cleared' });
    };

    return (
        <UploadContext.Provider value={{
            addToQueue, isSyncing, isUploading, queueSize, queue, retryAll: processQueue, clearQueue, removeItem
        }}>
            {children}
        </UploadContext.Provider>
    );
};

export const useUpload = () => {
    const context = useContext(UploadContext);
    if (!context) throw new Error("useUpload must be used within an UploadProvider");
    return context;
};