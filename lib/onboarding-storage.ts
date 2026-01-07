import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "hasOpenedBefore";

export const onboardingStorage = {
  async isComplete(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      return value === "true";
    } catch (e) {
      return false;
    }
  },

  async saveComplete(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    } catch (e) {
      console.error("Erreur lors de la sauvegarde de l'onboarding", e);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
    } catch (e) {
      console.error("Erreur lors du reset de l'onboarding", e);
    }
  },
};
