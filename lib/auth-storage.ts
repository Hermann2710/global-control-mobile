import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "user_auth_token";
const USER_KEY = "user_data";

export const authStorage = {
  /**
   * Sauvegarde le token et les infos utilisateur
   */
  async saveAuthData(token: string, user: any) {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données d'auth", error);
    }
  },

  /**
   * Récupère toutes les données d'authentification
   */
  async getAuthData() {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userJson = await SecureStore.getItemAsync(USER_KEY);

      return {
        token,
        user: userJson ? JSON.parse(userJson) : null,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des données d'auth", error);
      return { token: null, user: null };
    }
  },

  /**
   * Supprime tout (Déconnexion)
   */
  async clearAuthData() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.error("Erreur lors du nettoyage des données d'auth", error);
    }
  },
};
