import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Alert, Linking } from "react-native";

// Fonction pour ouvrir les paramètres
const showSettingsAlert = (title: string, message: string) => {
  Alert.alert(title, message, [
    { text: "Annuler", style: "cancel" },
    {
      text: "Ouvrir les paramètres",
      onPress: () => Linking.openSettings(),
    },
  ]);
};

export const pickImageFromCamera = async (
  saveToGallery = false
): Promise<string | null> => {
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {
    if (!permission.canAskAgain || permission.status === 'denied') {
      showSettingsAlert("Permission Caméra", "Activez la caméra dans les paramètres pour prendre une photo.");
    }
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    quality: 0.8,
    allowsEditing: true,
    aspect: [1, 1],
  });

  if (result.canceled) return null;
  const uri = result.assets[0].uri;

  if (saveToGallery) {
    const mediaPermission = await MediaLibrary.requestPermissionsAsync();
    if (mediaPermission.granted) {
      await MediaLibrary.saveToLibraryAsync(uri);
    }
  }
  return uri;
};

export const pickImageFromLibrary = async (): Promise<string | null> => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    if (!permission.canAskAgain || permission.status === 'denied') {
      showSettingsAlert("Permission Galerie", "Activez l'accès aux photos dans les paramètres pour choisir une image.");
    }
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
};