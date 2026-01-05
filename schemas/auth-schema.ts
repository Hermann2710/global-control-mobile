import { z } from "zod";
import { userSchema } from "./user-schema";

export const loginSchema = z.object({
  email: z.email({ message: "Adresse e-mail invalide" }),
  password: z
    .string("Le mot de passe est requis")
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
  location: z.string("Votre position est obligatoire"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Veuillez entrer un email valide"),
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export const authData = z.object({
  access_token: z.string(),
  user: userSchema,
});

export const verifyOtpSchema = z.object({
  otp: z.string().length(6, "Le code doit contenir 6 chiffres"),
  email: z.email(),
});

export type VerifyOtpData = z.infer<typeof verifyOtpSchema>;
