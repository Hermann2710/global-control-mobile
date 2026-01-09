import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

// Typage des paramètres pour la clarté TS
interface SavePhotoParams {
  uri: string;
  lotNumber: string;
  actionLabel: string;
}

export const photoService = {
  // 1. Demander les permissions
  requestPermissions: async (): Promise<boolean> => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || libraryStatus !== "granted") {
      Alert.alert(
        "Permissions requises",
        "Nous avons besoin d'accéder à l'appareil photo et à la galerie pour fonctionner."
      );
      return false;
    }
    return true;
  },

  // 2. Sauvegarder et renommer en gardant l'extension d'origine
  savePhoto: async ({
    uri,
    lotNumber,
    actionLabel,
  }: SavePhotoParams): Promise<string | null> => {
    try {
      // Extraire l'extension d'origine (.jpg, .png, etc.)
      const extension = uri.split(".").pop();

      // Formater le nom du fichier : Lot_123_Inspection_17048345.jpg
      const cleanLabel = actionLabel.toLowerCase().replace(/\s+/g, "_");
      const fileName = `lot_${lotNumber}_${cleanLabel}_${Date.now()}.${extension}`;
      const destPath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.copyAsync({
        from: uri,
        to: destPath,
      });

      return destPath; // Retourne le nouveau chemin du fichier
    } catch (error) {
      console.error("Erreur sauvegarde photo:", error);
      return null;
    }
  },
};
