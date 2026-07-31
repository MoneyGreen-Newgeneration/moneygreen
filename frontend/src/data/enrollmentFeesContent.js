// Contenu de l'encart "Frais d'enrolement" affiche sur la page de paiement.
// Source : consigne fournie par l'utilisateur. Disponible en FR uniquement
// pour le moment (les autres langues de l'app affichaient deja un texte
// generique different sur cette page).

export const ENROLLMENT_FEES_TITLE_FR = "FRAIS D'ENRÔLEMENT";

export const ENROLLMENT_FEES_BODY_FR = [
  {
    type: "p",
    text: "Les frais d'enrôlement sont des frais administratifs uniques permettant l'ouverture et le traitement de votre dossier de demande de prêt.",
  },
  { type: "p", text: "Ils couvrent notamment :" },
  {
    type: "ul",
    items: [
      "La création et la sécurisation de votre dossier numérique.",
      "La vérification de votre identité et des documents fournis.",
      "L'analyse de votre demande de financement.",
      "Les contrôles de conformité et de sécurité.",
      "Les frais administratifs liés au traitement de votre dossier.",
    ],
  },
  { type: "h4", text: "Important" },
  {
    type: "ul",
    items: [
      "Les frais d'enrôlement ne constituent pas un remboursement du prêt.",
      "Ils sont exigés uniquement pour le traitement administratif de votre demande.",
      "Le paiement de ces frais ne garantit pas automatiquement l'approbation du prêt. Chaque dossier reste soumis à une analyse conformément à la politique de financement de Money Green.",
      "Le montant des frais est communiqué au client avant toute validation.",
      "Ces frais seront remboursés directement si vos informations fournies son de sources douteuse, c'est-à-dire non correctes.",
    ],
  },
  {
    type: "p",
    text: "En effectuant le paiement des frais d'enrôlement, le client reconnaît avoir pris connaissance des conditions générales de financement et accepte la procédure de traitement de son dossier.",
  },
];
