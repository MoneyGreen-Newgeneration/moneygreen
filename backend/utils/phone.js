// Les numeros existants ont ete saisis en texte libre (fonctionnalite WhatsApp
// d'origine) : avec ou sans "+", avec ou sans indicatif pays, avec ou sans le
// "0" local. Une comparaison stricte echoue donc pour la plupart des
// utilisateurs. On genere ici toutes les variantes plausibles d'un numero afin
// de retrouver un compte quel que soit le format sous lequel il a ete stocke.

const COUNTRY_CODES = [
  "237", "242", "225", "226", "255", "261", "241", "243",
  "236", "235", "240", "228", "229", "221", "223", "224", "227", "233",
];

function stripKnownCountryCode(digits) {
  for (const cc of COUNTRY_CODES) {
    if (digits.startsWith(cc) && digits.length > cc.length + 6) {
      return digits.slice(cc.length);
    }
  }
  return digits;
}

// Numero "local" : sans indicatif pays connu, avec/sans le 0 initial.
function buildPhoneCandidates(raw) {
  const digits = (raw || "").replace(/\D/g, "");
  if (!digits) return [];

  const candidates = new Set([digits]);

  const local = stripKnownCountryCode(digits);
  const localNoZero = local.startsWith("0") ? local.slice(1) : local;
  const localWithZero = local.startsWith("0") ? local : `0${local}`;
  candidates.add(local);
  candidates.add(localNoZero);
  candidates.add(localWithZero);

  for (const cc of COUNTRY_CODES) {
    candidates.add(`${cc}${localNoZero}`);
    candidates.add(`${cc}${localWithZero}`);
    candidates.add(`+${cc}${localNoZero}`);
    candidates.add(`+${cc}${localWithZero}`);
  }
  candidates.add(`+${digits}`);

  return Array.from(candidates);
}

// Forme de stockage pour les nouvelles inscriptions : uniquement les chiffres,
// sans espaces/tirets/"+" pour eviter d'ajouter de nouvelles variantes de
// formatage a la base existante.
function normalizePhoneForStorage(raw) {
  return (raw || "").replace(/\D/g, "");
}

module.exports = { buildPhoneCandidates, normalizePhoneForStorage };
