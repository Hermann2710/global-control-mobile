// eslint-disable-next-line import/no-named-as-default
import z from "zod";

export const cafeSchema = z.object({
    numeroLot: z.string().min(1, "Le numéro de lot général est requis"),
    productType: z.string().min(1, "Veuillez sélectionner un produit"),
    data: z.object({
        // --- Champs techniques Café (Rendus obligatoires) ---
        numTest: z.string().min(1, "Numéro de test requis"),
        humidite: z.object({
            val1: z.string().min(1, "Valeur 1 requise"),
            val2: z.string().min(1, "Valeur 2 requise"),
            val3: z.string().min(1, "Valeur 3 requise")
        }),
        piqueeScolytee: z.string().min(1, "Champ piquée/scolytée requis"),
        ditesSeches: z.string().min(1, "Champ dites sèches requis"),
        fevesNoires: z.string().min(1, "Champ fèves noires requis"),
        fevesDemiNoires: z.string().min(1, "Champ fèves demi-noires requis"),
        brisures: z.string().min(1, "Champ brisures requis"),
        coquilles: z.string().min(1, "Champ coquilles requis"),
        cerises: z.string().min(1, "Champ cerises requis"),
        grossesPeaux: z.string().min(1, "Champ grosses peaux requis"),
        petitesPeaux: z.string().min(1, "Champ petites peaux requis"),
        fevesBlanches: z.string().min(1, "Champ fèves blanches requis"),
        fevesEnParche: z.string().min(1, "Champ fèves en parche requis"),
        fevesVertes: z.string().min(1, "Champ fèves vertes requis"),
        indesirables: z.string().min(1, "Champ indésirables requis"),
        coquesPalmistes: z.string().min(1, "Champ coques palmistes requis"),
        fevesMoisies: z.string().min(1, "Champ fèves moisies requis"),
        bois: z.object({
            g: z.string().min(1, "Grand requis"),
            m: z.string().min(1, "Moyen requis"),
            p: z.string().min(1, "Petit requis"),
        }),
        pierres: z.string().min(1, "Champ pierres requis"),
        calibrage: z.object({
            "20": z.string().min(1, "Taille 20 requise"),
            "18": z.string().min(1, "Taille 18 requise"),
            "17": z.string().min(1, "Taille 17 requise"),
            "16": z.string().min(1, "Taille 16 requise"),
            "15": z.string().min(1, "Taille 15 requise"),
            "14": z.string().min(1, "Taille 14 requise"),
            "13": z.string().min(1, "Taille 13 requise"),
            "10": z.string().min(1, "Taille 10 requise"),
            fond: z.string().min(1, "Fond requis")
        }),
        operateur: z.string().min(1, "Nom de l'opérateur requis"),
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

export type CafeFormData = z.infer<typeof cafeSchema>;