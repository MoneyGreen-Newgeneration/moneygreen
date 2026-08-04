// Contenu integral de la politique de confidentialite MoneyGreen.
// Source : document fourni par l'utilisateur (MoneyGreen_Politique_Confidentialite).
// Structure en sections pour permettre l'affichage tronque (apercu) + deplie complet.
// Disponible en FR et EN ; les autres langues de l'app (es, pt, de) retombent sur la version FR.

const PRIVACY_POLICY_SECTIONS_FR = [
  {
    title: "1. Responsable du traitement",
    body: [
      { type: "p", text: "Money Green Finance Ltd est une société constituée selon le droit anglais (Companies Act 2006), dont le siège social est situé au 128 City Road, Londres, EC1V 2NX, Royaume-Uni, immatriculée sous le numéro 14582931." },
      { type: "p", text: "Money Green opère également un service local en Côte d'Ivoire, sous la structure MoneyGreen Côte d'Ivoire Ltd, immatriculée au RCCM sous le numéro CI-ABJ-03-2024-B12-08942, assurant l'accompagnement de proximité des clients basés en Côte d'Ivoire." },
      { type: "p", text: "Pour toute question relative à la présente politique ou à l'exercice de vos droits, vous pouvez contacter notre référent protection des données à l'adresse : privacy@moneygreen.com." },
    ],
  },
  {
    title: "2. Données collectées",
    body: [
      { type: "p", text: "Dans le cadre de l'utilisation de la Plateforme, notamment lors de la création de compte et de la constitution d'un dossier de demande de prêt, Money Green collecte les catégories de données suivantes :" },
      { type: "h4", text: "2.1 Données d'identification et de contact" },
      { type: "ul", items: ["Nom et prénom complets", "Numéro de téléphone", "Adresse email", "Nom d'utilisateur et mot de passe (compte)"] },
      { type: "h4", text: "2.2 Données relatives à la demande de financement" },
      { type: "ul", items: ["Type, montant et durée du prêt souhaité", "Revenus mensuels déclarés (le cas échéant)", "Objet du financement"] },
      { type: "h4", text: "2.3 Pièces justificatives" },
      { type: "ul", items: [
        "Pièce d'identité (CNI, passeport ou carte de séjour en cours de validité)",
        "Justificatifs de revenus (bulletins de salaire ou preuve de revenus)",
        "Relevés bancaires (3 ou 6 derniers mois selon le produit)",
        "Justificatif de domicile (facture d'eau, d'électricité ou de loyer)",
        "Selon le type de prêt : devis ou bon de commande du véhicule, titre ou compromis de vente, attestation d'inscription scolaire, ou description du projet personnel/professionnel",
      ]},
      { type: "h4", text: "2.4 Données d'utilisation et de communication" },
      { type: "ul", items: [
        "Historique des transactions et du tableau de bord (revenus, dépenses, catégories)",
        "Messages échangés via la messagerie intégrée (support client, équipe interne)",
        "Données techniques de connexion (identifiants de session, journaux d'activité)",
      ]},
    ],
  },
  {
    title: "3. Finalités du traitement",
    body: [
      { type: "p", text: "Vos données sont traitées pour les finalités suivantes :" },
      { type: "ul", items: [
        "L'étude et l'instruction de votre dossier de demande de prêt",
        "La vérification de votre identité et de votre solvabilité",
        "La gestion de votre compte et de votre tableau de bord personnel",
        "Le traitement des paiements et le suivi des remboursements",
        "L'assistance client, via le chat intégré à la Plateforme",
        "Le respect de nos obligations légales et réglementaires (notamment en matière de lutte contre le blanchiment de capitaux et le financement du terrorisme)",
        "L'amélioration de la sécurité et du fonctionnement de la Plateforme",
      ]},
    ],
  },
  {
    title: "4. Base légale du traitement",
    body: [
      { type: "p", text: "Selon les cas, le traitement de vos données repose sur :" },
      { type: "ul", items: [
        "L'exécution du contrat vous liant à Money Green (étude et gestion de votre dossier de prêt)",
        "Le respect d'une obligation légale à laquelle Money Green est soumise",
        "Le prêt est soumis à des frais d'enrôlement obligatoires pour l'étude du dossier. Et un taux d'intérêt fixe communiqué au client avant validation du crédit",
        "Votre consentement, lorsque celui-ci est requis (par exemple pour certaines communications)",
        "L'intérêt légitime de Money Green à assurer la sécurité de la Plateforme et la prévention de la fraude",
      ]},
    ],
  },
  {
    title: "5. Destinataires des données",
    body: [
      { type: "p", text: "Vos données sont accessibles aux seules personnes habilitées au sein de Money Green (équipe d'analyse des dossiers, support client, administration). Elles peuvent également être transmises, dans la stricte mesure nécessaire :" },
      { type: "ul", items: [
        "À nos prestataires techniques (hébergement, stockage sécurisé des documents et images)",
        "À nos prestataires de paiement (mobile money, virement bancaire), pour le traitement des transactions",
        "Aux autorités compétentes, lorsque la loi l'exige",
      ]},
      { type: "p", text: "Money Green ne vend ni ne loue vos données personnelles à des tiers à des fins commerciales." },
    ],
  },
  {
    title: "6. Transfert international de données",
    body: [
      { type: "p", text: "Dans la mesure où Money Green opère à la fois au Royaume-Uni et en Côte d'Ivoire, vos données peuvent être transférées entre ces deux juridictions dans le cadre strict des finalités décrites ci-dessus. Ces transferts sont encadrés conformément aux exigences applicables en matière de protection des données, notamment par la mise en place de clauses contractuelles types (Standard Contractual Clauses)." },
    ],
  },
  {
    title: "7. Durée de conservation",
    body: [
      { type: "p", text: "Vos données sont conservées pendant la durée nécessaire à l'instruction et à l'exécution de votre dossier de prêt, augmentée d'une durée de 5 ans après la fin de la relation contractuelle, conformément aux obligations légales de conservation applicables en matière comptable et de lutte contre la fraude." },
    ],
  },
  {
    title: "8. Sécurité des données",
    body: [
      { type: "p", text: "Money Green met en œuvre des mesures techniques et organisationnelles raisonnables pour protéger vos données contre tout accès non autorisé, perte, altération ou divulgation, notamment :" },
      { type: "ul", items: [
        "Le chiffrement des échanges et le stockage sécurisé des documents sensibles",
        "La limitation des accès aux seules personnes habilitées, selon leur rôle",
        "L'authentification des comptes utilisateurs et administrateurs",
      ]},
    ],
  },
  {
    title: "9. Vos droits",
    body: [
      { type: "p", text: "Conformément à la réglementation applicable en matière de protection des données (notamment le UK GDPR et le Data Protection Act 2018 pour le Royaume-Uni, et la législation ivoirienne relative à la protection des données à caractère personnel), vous disposez des droits suivants sur vos données :" },
      { type: "ul", items: [
        "Droit d'accès à vos données",
        "Droit de rectification des données inexactes ou incomplètes",
        "Droit à l'effacement, dans les limites prévues par la loi",
        "Droit d'opposition et de limitation du traitement",
        "Droit à la portabilité de vos données",
        "Droit d'introduire une réclamation auprès de l'autorité de contrôle compétente",
      ]},
      { type: "p", text: "Vous pouvez exercer ces droits en nous contactant à l'adresse indiquée à l'article 1, ou via la messagerie intégrée à votre espace client." },
    ],
  },
  {
    title: "10. Modification de la présente politique",
    body: [
      { type: "p", text: "Money Green se réserve le droit de modifier la présente politique de confidentialité à tout moment, notamment pour tenir compte des évolutions légales, réglementaires ou techniques. La version en vigueur est celle publiée sur la Plateforme, avec mention de sa date de dernière mise à jour." },
    ],
  },
  {
    title: "11. Contact",
    body: [
      { type: "p", text: "Pour toute question relative à la présente politique de confidentialité ou au traitement de vos données personnelles, vous pouvez nous contacter à : privacy@moneygreen.com." },
      { type: "p", text: "Dernière mise à jour : 4 août 2026" },
    ],
  },
];

const PRIVACY_POLICY_SECTIONS_EN = [
  {
    title: "1. Data Controller",
    body: [
      { type: "p", text: "Money Green Finance Ltd is a company incorporated under the laws of England (Companies Act 2006), with its registered office at 128 City Road, London, EC1V 2NX, United Kingdom, registered under number 14582931." },
      { type: "p", text: "Money Green also operates a local service in Côte d'Ivoire, through the structure MoneyGreen Côte d'Ivoire Ltd, registered under RCCM number CI-ABJ-03-2024-B12-08942, providing local support to clients based in Côte d'Ivoire." },
      { type: "p", text: "For any question relating to this policy or the exercise of your rights, you may contact our data protection point of contact at: privacy@moneygreen.com." },
    ],
  },
  {
    title: "2. Data We Collect",
    body: [
      { type: "p", text: "When using the Platform, in particular when creating an account and building a loan application file, Money Green collects the following categories of data:" },
      { type: "h4", text: "2.1 Identification and contact data" },
      { type: "ul", items: ["Full first and last name", "Phone number", "Email address", "Username and password (account)"] },
      { type: "h4", text: "2.2 Financing application data" },
      { type: "ul", items: ["Type, amount and duration of the requested loan", "Declared monthly income (where applicable)", "Purpose of the financing"] },
      { type: "h4", text: "2.3 Supporting documents" },
      { type: "ul", items: [
        "Identity document (valid national ID card, passport, or residence permit)",
        "Proof of income (payslips or other proof of income)",
        "Bank statements (last 3 or 6 months depending on the product)",
        "Proof of address (water, electricity, or rent bill)",
        "Depending on the type of loan: vehicle quote or purchase order, property title or sale agreement, school enrollment certificate, or description of the personal/professional project",
      ]},
      { type: "h4", text: "2.4 Usage and communication data" },
      { type: "ul", items: [
        "Transaction history and dashboard data (income, expenses, categories)",
        "Messages exchanged via the integrated messaging system (customer support, internal team)",
        "Technical connection data (session identifiers, activity logs)",
      ]},
    ],
  },
  {
    title: "3. Purposes of Processing",
    body: [
      { type: "p", text: "Your data is processed for the following purposes:" },
      { type: "ul", items: [
        "Reviewing and processing your loan application",
        "Verifying your identity and creditworthiness",
        "Managing your account and personal dashboard",
        "Processing payments and monitoring repayments",
        "Customer support, via the Platform's integrated chat",
        "Complying with our legal and regulatory obligations (in particular anti-money laundering and counter-terrorist financing rules)",
        "Improving the security and operation of the Platform",
      ]},
    ],
  },
  {
    title: "4. Legal Basis for Processing",
    body: [
      { type: "p", text: "Depending on the case, the processing of your data is based on:" },
      { type: "ul", items: [
        "Performance of the contract binding you to Money Green (review and management of your loan file)",
        "Compliance with a legal obligation to which Money Green is subject",
        "Your consent, where required (for example for certain communications)",
        "Money Green's legitimate interest in ensuring the security of the Platform and preventing fraud",
      ]},
    ],
  },
  {
    title: "5. Data Recipients",
    body: [
      { type: "p", text: "Your data is accessible only to authorized personnel within Money Green (application review team, customer support, administration). It may also be shared, strictly to the extent necessary:" },
      { type: "ul", items: [
        "With our technical service providers (hosting, secure storage of documents and images)",
        "With our payment service providers (mobile money, bank transfer), for processing transactions",
        "With competent authorities, where required by law",
      ]},
      { type: "p", text: "Money Green does not sell or rent your personal data to third parties for commercial purposes." },
    ],
  },
  {
    title: "6. International Data Transfers",
    body: [
      { type: "p", text: "As Money Green operates both in the United Kingdom and in Côte d'Ivoire, your data may be transferred between these two jurisdictions, strictly within the scope of the purposes described above. These transfers are carried out in accordance with applicable data protection requirements, in particular through the use of standard contractual clauses." },
    ],
  },
  {
    title: "7. Retention Period",
    body: [
      { type: "p", text: "Your data is retained for as long as necessary to process and execute your loan file, plus an additional period of 5 years after the end of the contractual relationship, in accordance with applicable legal retention obligations relating to accounting and fraud prevention." },
    ],
  },
  {
    title: "8. Data Security",
    body: [
      { type: "p", text: "Money Green implements reasonable technical and organizational measures to protect your data against unauthorized access, loss, alteration, or disclosure, in particular:" },
      { type: "ul", items: [
        "Encryption of exchanges and secure storage of sensitive documents",
        "Restricting access to authorized personnel only, based on their role",
        "Authentication of user and administrator accounts",
      ]},
    ],
  },
  {
    title: "9. Your Rights",
    body: [
      { type: "p", text: "In accordance with applicable data protection regulations (in particular the UK GDPR and the Data Protection Act 2018 for the United Kingdom, and Ivorian legislation on the protection of personal data), you have the following rights over your data:" },
      { type: "ul", items: [
        "Right of access to your data",
        "Right to rectification of inaccurate or incomplete data",
        "Right to erasure, within the limits provided by law",
        "Right to object to and restrict processing",
        "Right to data portability",
        "Right to lodge a complaint with the competent supervisory authority",
      ]},
      { type: "p", text: "You may exercise these rights by contacting us at the address indicated in Section 1, or via the messaging system integrated into your client area." },
    ],
  },
  {
    title: "10. Changes to This Policy",
    body: [
      { type: "p", text: "Money Green reserves the right to modify this privacy policy at any time, in particular to reflect legal, regulatory, or technical developments. The version in force is the one published on the Platform, indicating its last update date." },
    ],
  },
  {
    title: "11. Contact",
    body: [
      { type: "p", text: "For any question relating to this privacy policy or the processing of your personal data, you may contact us at: privacy@moneygreen.com." },
      { type: "p", text: "Last updated: 4 August 2026" },
    ],
  },
];

// Retourne les sections dans la langue demandee. Seuls fr et en sont traduits ;
// les autres langues de l'app (es, pt, de) retombent sur la version fr, comme
// le fait le t() de LangContext pour les cles manquantes.
export function getPrivacyPolicySections(lang) {
  return lang === "en" ? PRIVACY_POLICY_SECTIONS_EN : PRIVACY_POLICY_SECTIONS_FR;
}
