// eslint-disable-next-line import/no-named-as-default
import z from "zod";

export const cacaoSchema = z.object({
    productType: z.string({ message: "Type de produit requis" }),
    numerotLot: z.string().optional(),
    data: z.object({
        numTest: z.string().optional(),
        humidite: z.object({
            val1: z.string().optional(),
            val2: z.string().optional(),
            val3: z.string().optional(),
        }).optional(),
        tamissage: z.string().optional(),
        triage: z.object({
            crabots: z.string().optional(),
            brisures: z.string().optional(),
            fragCoques: z.string().optional(),
        }).optional(),
        matEtrangere: z.string().optional(),
        grainage: z.string().optional(),
        testCoupe: z.object({
            moisies: z.string().optional(),
            ardoisees: z.string().optional(),
            violettes: z.string().optional(),
            whiteSpots: z.string().optional(),
        }).optional(),
        defectueuses: z.object({
            mitees: z.string().optional(),
            plates: z.string().optional(),
            germees: z.string().optional(),
        }).optional(),
        sensoriel: z.enum(["Smoky", "No Smoky", "Other"]).optional(),
        poidsEchantillon: z.string().optional(),
        technicien: z.string().optional(),
        date: z.date().default(new Date()),
    })
});

export type CacaoFormData = z.infer<typeof cacaoSchema>;