import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  firstName: z.string({ message: "Le prénom est requis" }).min(2, "Prénom trop court"),
  lastName: z.string({ message: "Le nom est requis" }).min(2, "Nom trop court"),
  email: z.string().email("Format d'email invalide"),
  phoneNumber_1: z.string({ message: "Le numéro de téléphone est requis" }),
  phoneNumber_2: z.string().nullable().optional(),
  ville: z.string({ message: "La ville est requise" }),
  location: z.string().nullable(),
  profileImage: z.string().nullable(),
  role: z.string(),
  status: z.string(),
  isLogged: z.boolean(),
  isDeleted: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  passwordLastChanged: z.string(),
  fonction: z.any().optional(),
  companyDetails: z.any().nullable(),
});

export type UserType = z.infer<typeof userSchema>;