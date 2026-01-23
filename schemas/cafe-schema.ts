// eslint-disable-next-line import/no-named-as-default
import z from "zod";

export const cafeSchema = z.object({
    numeroLot: z.string().optional(),
    productType: z.string({ message: "Veuillez sélectionner un produit" }).optional(),
    data: z.object({
        numTest: z.string().optional(),
        humidite: z.object({
            val1: z.string({ message: "Valeur 1 requise" }).optional(),
            val2: z.string({ message: "Valeur 2 requise" }).optional(),
            val3: z.string({ message: "Valeur 3 requise" }).optional()
        }).optional(),
        piqueeScolytee: z.string({ message: "Champ requis" }).optional(),
        ditesSeches: z.string({ message: "Champ requis" }).optional(),
        fevesNoires: z.string({ message: "Champ requis" }).optional(),
        fevesDemiNoires: z.string({ message: "Champ requis" }).optional(),
        brisures: z.string({ message: "Champ requis" }).optional(),
        coquilles: z.string({ message: "Champ requis" }).optional(),
        cerises: z.string({ message: "Champ requis" }).optional(),
        grossesPeaux: z.string({ message: "Champ requis" }).optional(),
        petitesPeaux: z.string({ message: "Champ requis" }).optional(),
        fevesBlanches: z.string({ message: "Champ requis" }).optional(),
        fevesEnParche: z.string({ message: "Champ requis" }).optional(),
        fevesVertes: z.string({ message: "Champ requis" }).optional(),
        indesirables: z.string({ message: "Champ requis" }).optional(),
        coquesPalmistes: z.string({ message: "Champ requis" }).optional(),
        fevesMoisies: z.string({ message: "Champ requis" }).optional(),
        bois: z.object({
            g: z.string({ message: "Grand requis" }).optional(),
            m: z.string({ message: "Moyen requis" }).optional(),
            p: z.string({ message: "Petit requis" }).optional(),
        }).optional(),
        pierres: z.string({ message: "Champ requis" }).optional(),
        calibrage: z.object({
            20: z.string({ message: "Taille 20 requise" }).optional(),
            18: z.string({ message: "Taille 18 requise" }).optional(),
            17: z.string({ message: "Taille 17 requise" }).optional(),
            16: z.string({ message: "Taille 16 requise" }).optional(),
            15: z.string({ message: "Taille 15 requise" }).optional(),
            14: z.string({ message: "Taille 14 requise" }).optional(),
            13: z.string({ message: "Taille 13 requise" }).optional(),
            10: z.string({ message: "Taille 10 requise" }).optional(),
            fond: z.string({ message: "Fond requis" }).optional()
        }).optional(),
        operateur: z.string({ message: "Nom de l'opérateur requis" }).optional(),
        date: z.date().default(new Date()).optional(),
    }).optional()
});

export type CafeFormData = z.infer<typeof cafeSchema>;