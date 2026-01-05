import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  phoneNumber_1: z.string(),
  phoneNumber_2: z.string().nullable().optional(),
  ville: z.string(),
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
