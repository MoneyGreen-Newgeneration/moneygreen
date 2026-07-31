// Contenu integral du bloc de presentation institutionnelle "Money Green
// Finance Ltd", affiche sur la page d'accueil apres la section partenaires.
// Source : document fourni par l'utilisateur. Disponible en FR uniquement
// pour le moment (contenu institutionnel/juridique, comme la politique de
// confidentialite et les frais d'enrolement).

export const COMPANY_PRESENTATION = {
  name: "Money Green Finance Ltd",
  tagline: "Institution financière digitale",
  headquarters: "Londres, Royaume-Uni",
  localService: "Côte d'Ivoire",

  sections: [
    {
      icon: "bank",
      title: "Présentation",
      body: [
        {
          type: "p",
          text: "Money Green Finance Ltd est une institution financière digitale agréée et régulée au Royaume-Uni par la Financial Conduct Authority (FCA).",
        },
        {
          type: "p",
          text: "Spécialisée dans l'octroi de prêts, Money Green met à la disposition de sa clientèle des solutions de financement rapides, sécurisées et adaptées à leurs besoins personnels, professionnels, scolaires et universitaires.",
        },
        {
          type: "p",
          text: "Notre service local en Côte d'Ivoire assure un accompagnement de proximité, tandis que l'ensemble du processus de demande, d'analyse, d'approbation et de décaissement est entièrement digitalisé via notre plateforme en ligne.",
        },
      ],
    },
    {
      icon: "scale",
      title: "Cadre juridique et réglementaire",
      body: [
        {
          type: "p",
          text: "Money Green Finance Ltd est constituée sous le droit anglais (Companies Act 2006) et opère en conformité avec les exigences prudentielles et réglementaires en vigueur, notamment celles relatives à :",
        },
        {
          type: "ul",
          items: [
            "La lutte contre le blanchiment de capitaux et le financement du terrorisme (AML/CFT)",
            "La protection des données et la confidentialité des informations (UK GDPR)",
            "La transparence des conditions financières et la protection des consommateurs",
          ],
        },
      ],
    },
    {
      icon: "monitor",
      title: "Fonctionnement – procédure 100 % digitale",
      body: [
        {
          type: "ol",
          items: [
            { title: "Demande en ligne", text: "le client crée son compte et soumet sa demande de prêt via notre plateforme sécurisée." },
            { title: "Analyse et évaluation", text: "nos systèmes automatisés et nos analystes évaluent la solvabilité du demandeur sur la base des informations et documents fournis." },
            { title: "Offre et acceptation", text: "en cas d'approbation, une offre de prêt digitale est transmise au client pour acceptation électronique." },
            { title: "Contrat digital", text: "le contrat de prêt est signé électroniquement, conformément à la législation applicable." },
            { title: "Décaissement", text: "les fonds sont transférés rapidement sur le compte bancaire ou mobile money du client." },
            { title: "Remboursement", text: "les échéances sont précisées dans le tableau d'amortissement. Le remboursement s'effectue selon les modalités convenues, avec plusieurs options de paiement en ligne." },
          ],
        },
      ],
    },
    {
      icon: "shield",
      title: "Nos engagements",
      body: [
        {
          type: "ul",
          items: [
            "Sécurité et confidentialité des données",
            "Transparence totale des conditions et frais appliqués",
            "Réactivité et efficacité des services",
            "Conformité réglementaire et éthique professionnelle",
            "Accompagnement personnalisé tout au long du cycle de financement",
          ],
        },
      ],
    },
  ],

  keyInfo: [
    { icon: "bank", label: "Siège social :", text: "Londres, Royaume-Uni" },
    { icon: "pin", label: "Service local :", text: "Côte d'Ivoire" },
    { icon: "globe", label: "Service :", text: "100 % en ligne" },
    { icon: "lock", label: "", text: "Données sécurisées et protégées" },
  ],

  footer: {
    main: "Money Green Finance Ltd — Votre partenaire financier digital de confiance.",
    sub: "Des solutions de financement rapides, sécurisées et accessibles partout, à tout moment.",
  },
};
