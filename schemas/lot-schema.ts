import z from "zod";

const produitTypes = z.enum(["cacao", "cafe"]);

export const numeroLotSchema = z.object({
  numeroLot: z
    .string()
    .min(1, "Le numéro de lot est requis")
    .describe("Numéro de lot"),
  produitType: produitTypes.describe("Type de produit"),
});

export type NumeroLotType = z.infer<typeof numeroLotSchema>;
