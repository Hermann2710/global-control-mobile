import * as Location from "expo-location";
import { Alert, Linking, Platform } from "react-native";

export const getCurrentNeighborhood = async () => {
  try {
    // Vérifier le statut actuel
    const { status, canAskAgain } =
      await Location.getForegroundPermissionsAsync();

    if (status === "denied" && !canAskAgain) {
      // L'utilisateur a refusé et on ne peut plus demander
      Alert.alert(
        "Localisation requise",
        "Vous avez bloqué l'accès à la position. Pour vous connecter, vous devez l'activer dans les réglages de votre téléphone.",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Ouvrir les réglages",
            onPress: () =>
              Platform.OS === "ios"
                ? Linking.openURL("app-settings:")
                : Linking.openSettings(),
          },
        ]
      );
      return null;
    }

    // Si on peut demander ou si c'est déjà autorisé
    const { status: finalStatus } =
      await Location.requestForegroundPermissionsAsync();

    if (finalStatus !== "granted") return null;

    const location = await Location.getCurrentPositionAsync({});
    const [address] = await Location.reverseGeocodeAsync(location.coords);

    return address.district || address.subregion || "Quartier inconnu";
  } catch (error) {
    return null;
  }
};
