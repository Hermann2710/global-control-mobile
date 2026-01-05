import { authStorage } from "@/lib/auth-storage";
import { getErrorMessage } from "@/lib/utils";
import { ForgotPasswordData, LoginSchemaType } from "@/schemas/auth-schema";
import authService from "@/services/auth-service";
import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message";

type AuthContextType = {
  token: string | null;
  isLoading: boolean;
  signIn: (data: LoginSchemaType) => Promise<void>;
  signOut: () => Promise<void>;
  sendOtp: (data: ForgotPasswordData) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  // Vérifier le token au lancement de l'application
  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await authStorage.getToken();
      setToken(storedToken);
      setIsLoading(false);
    };
    loadToken();
  }, []);

  // Logique de redirection automatique
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "auth";

    if (!token && !inAuthGroup) {
      // Pas de token et on n'est pas dans les pages d'auth -> Rediriger vers login
      router.replace("/auth/login");
    } else if (token && inAuthGroup) {
      // Connecté et on essaie d'aller sur login -> Rediriger vers l'app
      router.replace("/(tabs)");
    }
  }, [token, isLoading, segments]);

  const signIn = async (data: LoginSchemaType) => {
    try {
      const response = await authService.login(data);

      if (response.success && response.data.access_token) {
        await authStorage.saveToken(response.data.access_token);
        setToken(response.data.access_token);
      } else {
        await authStorage.removeToken();
        setToken(null);
      }
      Toast.show({
        type: response.success ? "success" : "error",
        text1: response.message,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Erreur lors de la connexion",
        text2: getErrorMessage(error),
      });
      console.log("Erreur lors de la connexion :", error);
    }
  };

  const sendOtp = async (data: ForgotPasswordData) => {
    try {
      const response = await authService.sendOtp(data);

      Toast.show({
        type: response.success ? "success" : "error",
        text1: response.success
          ? "Email envoyé avec succès!"
          : response.message,
      });

      if (response.success) {
        router.push({
          pathname: "/auth/verify-otp",
          params: { email: data.email },
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Erreur lors de l'envoi de l'OTP",
        text2: getErrorMessage(error),
      });
      console.log("Erreur lors de l'envoi de l'OTP :", error);
    }
  };

  const signOut = async () => {
    await authStorage.removeToken();
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, isLoading, signIn, sendOtp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser l'auth partout
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
};
