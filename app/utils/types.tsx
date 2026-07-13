export type AchatStatus = "EN_COURS" | "LIVRE" | "FACTURE" | "PAYE";

export interface LigneAchat {
    id: string;
    articleCode: string;
    designation: string;
    quantite: number;
    unite: string;
    prixUnitaire: number;
    total: number;
}

export interface Achat {
    id: string;
    ref: string;
    fournisseurNom: string;
    chantierNom: string;
    dateCommande: string;
    dateLivraisonPrevue: string;
    status: AchatStatus;
    ht: number;
    tva: number;
    ttc: number;
    lignes: LigneAchat[];
    bonLivraisonRef?: string;
    factureRef?: string;
}