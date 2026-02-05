// eslint-disable-next-line import/no-named-as-default
import z from "zod";

export const cacaoSchema = z.object({
    productType: z.string().min(1, "Type de produit requis"),
    numerotLot: z.string().min(1, "Numéro de lot général requis"),
    data: z.object({// --- Vos champs initiaux (Rendus obligatoires) ---
        numTest: z.string().min(1, "Numéro de test requis"),
        humidite: z.object({
            val1: z.string().min(1, "Valeur 1 requise"),
            val2: z.string().min(1, "Valeur 2 requise"),
            val3: z.string().min(1, "Valeur 3 requise"),
        }),
        tamissage: z.string().min(1, "Donnée de tamissage requise"),
        triage: z.object({
            crabots: z.string().min(1, "Taux de crabots requis"),
            brisures: z.string().min(1, "Taux de brisures requis"),
            fragCoques: z.string().min(1, "Fragments de coques requis"),
        }),
        matEtrangere: z.string().min(1, "Matières étrangères requises"),
        grainage: z.string().min(1, "Le grainage est requis"),
        testCoupe: z.object({
            moisies: z.string().min(1, "Taux de moisies requis"),
            ardoisees: z.string().min(1, "Taux d'ardoisees requis"),
            violettes: z.string().min(1, "Taux de violettes requis"),
            whiteSpots: z.string().min(1, "Taux de white spots requis"),
        }),
        defectueuses: z.object({
            mitees: z.string().min(1, "Taux de mitées requis"),
            plates: z.string().min(1, "Taux de plates requis"),
            germees: z.string().min(1, "Taux de germées requis"),
        }),
        sensoriel: z.enum(["Smoky", "No Smoky", "Other"], {
            error: "Évaluation sensorielle requise"
        }),
        poidsEchantillon: z.string().min(1, "Le poids de l'échantillon est requis"),
        technicien: z.string().min(1, "Nom du technicien requis"),
        date: z.date().default(() => new Date()),
        
        // Section TV (Transport)
        tv: z.object({
            numCamion: z.string().min(1, "Le numéro de camion est obligatoire"),
            tvCode: z.string().min(1, "Le code TV est requis"),
            breSacsTV: z.coerce.number().min(1, "Nombre de sacs (TV) requis"),
            poidsNetTV: z.string().min(1, "Le poids net (TV) est requis"),
            numConteneur: z.coerce.number().min(1, "Le numéro de conteneur est obligatoire"),
        }),

        // Section EXP (Exportation)
        exp: z.object({
            numLot: z.string().min(1, "Le numéro de lot EXP est obligatoire"),
            breSacs: z.coerce.number().min(1, "Nombre de sacs (EXP) requis"),
            poidsNet: z.string().min(1, "Le poids net (EXP) est requis"),
            numConteneur: z.coerce.number().min(1, "Le numéro de conteneur est obligatoire"),
        }),

        // Section EM (Emballage)
        em: z.object({
            numLot: z.string().min(1, "Le numéro de lot EM est obligatoire"),
            breSacs: z.coerce.number().min(1, "Nombre de sacs (EM) requis"),
            numConteneur: z.string().min(1, "Le numéro de conteneur est obligatoire"),
            poidsNet: z.string().min(1, "Le poids net (EM) est requis"),
        }),

        // Autres infos de l'image
        th: z.string().min(1, "Le champ TH est obligatoire"),
        provenance: z.string().min(1, "La provenance est obligatoire"),
        typeSacs: z.enum(["Nylon", "Jute", "Mélangé"], {
            error: "Type de sac requis (Nylon/Jute/Mélangé)"
        }),
        conditionnement: z.enum(["Neuf", "Premier choix", "Brossé"], {
           error: "État du conditionnement requis"
        }),
        observations: z.string().optional(),
    })
});

export type CacaoFormData = z.infer<typeof cacaoSchema>;