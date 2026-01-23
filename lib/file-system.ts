import { Directory, File, Paths } from 'expo-file-system';
export const DOSSIER_UPLOADS = new Directory(Paths.document, "uploads_hors_ligne");

export const FileService = {
    init: async () => {
        if (!DOSSIER_UPLOADS.exists) {
            DOSSIER_UPLOADS.create();
        }
    },

    obtenirUriComplete: (nomFichier: string) => {
        return `${Paths.document.uri}uploads_hors_ligne/${nomFichier}`;
    },

    persisterFichier: async (uri: string) => {
        const fichierOriginal = new File(uri);
        const horodatage = Date.now();
        const suffixeAleatoire = Math.random().toString(36).substring(7);
        const nouveauNom = `${horodatage}_${suffixeAleatoire}_${fichierOriginal.name}`;

        const fichierDestination = new File(DOSSIER_UPLOADS, nouveauNom);
        fichierOriginal.copy(fichierDestination);

        const info = fichierDestination.info?.();
        return {
            uri: nouveauNom,
            nom: nouveauNom,
            taille: info?.size || 0,
            type: 'image/jpeg'
        };
    },

    supprimerFichier: async (nomOuUri: string) => {
        try {
            const uriAbsolue = nomOuUri.startsWith('file://') 
                ? nomOuUri 
                : `${Paths.document.uri}uploads_hors_ligne/${nomOuUri}`;
            
            const fichier = new File(uriAbsolue);
            if (fichier.exists) {
                fichier.delete();
            }
        } catch (error) {
            console.warn(`Impossible de supprimer le fichier ${nomOuUri}:`, error);
        }
    }
};