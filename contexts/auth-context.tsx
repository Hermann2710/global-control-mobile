import { authStorage } from "@/lib/auth-storage";
import { onboardingStorage } from "@/lib/onboarding-storage";
import { getErrorMessage } from "@/lib/utils";
import {
  ForgotPasswordData,
  LoginSchemaType,
  VerifyOtptype,
} from "@/schemas/auth-schema";
import { UserType } from "@/schemas/user-schema";
import authService from "@/services/auth-service";
import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message";

type AuthContextType = {
  token: string | null;
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  isLoading: boolean;
  isFirstTime: boolean;
  signIn: (data: LoginSchemaType) => Promise<void>;
  signOut: () => Promise<void>;
  sendOtp: (data: ForgotPasswordData) => Promise<void>;
  verifyOtp: (data: VerifyOtptype) => Promise<void>;
  completeOnboarding: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      try {
        const [storedAuthData, hasCompletedOnboarding] = await Promise.all([
          authStorage.getAuthData(),
          onboardingStorage.isComplete(),
        ]);
        setToken(storedAuthData.token);
        setUser(storedAuthData.user);
        setIsFirstTime(!hasCompletedOnboarding);
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "auth";
    const onGettingStarted = segments[0] === "getting-started";

    if (!token) {
      if (!onGettingStarted && !inAuthGroup) {
        router.replace("/getting-started");
      }
    } else {
      if (inAuthGroup || onGettingStarted) {
        router.replace("/(app)/(main)");
      }
    }
  }, [token, isLoading, segments]);

  const completeOnboarding = async () => {
    try {
      await onboardingStorage.saveComplete();
      setIsFirstTime(false);
      router.replace("/auth/login");
    } catch (error) {
      console.error("Onboarding storage error:", error);
    }
  };

  const signIn = async (data: LoginSchemaType) => {
    try {
      setIsLoading(true);
      const response = await authService.login(data);

      if (response.success && response.data.access_token) {
        await authStorage.saveAuthData(
          response.data.access_token,
          response.data.user
        );
        setToken(response.data.access_token);
        setUser(response.data.user);
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
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (data: ForgotPasswordData) => {
    try {
      setIsLoading(true);
      const response = await authService.sendOtp(data);
      Toast.show({
        type: response.success ? "success" : "error",
        text1: response.success ? "Email envoyé !" : response.message,
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
        text1: "Erreur OTP",
        text2: getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (data: VerifyOtptype) => {
    try {
      setIsLoading(true);
      const response = await authService.verifyOtp(data);
      Toast.show({
        type: response.success ? "success" : "error",
        text1: response.success ? "Code vérifié !" : response.message,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Erreur vérification",
        text2: getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    await authStorage.clearAuthData();
    setToken(null);
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setUser,
        isLoading,
        isFirstTime,
        signIn,
        sendOtp,
        signOut,
        verifyOtp,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
