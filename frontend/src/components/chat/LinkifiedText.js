// Detecte les URLs (http/https ou www.) dans un texte de message et les
// transforme en liens cliquables, sans jamais interpreter le reste du texte
// comme du HTML (on ne fait que decouper la chaine, React echappe le reste).
const URL_PATTERN = /((?:https?:\/\/|www\.)[^\s<>"']+)/gi;

export default function LinkifiedText({ text }) {
  if (!text) return null;
  const parts = text.split(URL_PATTERN);
  return parts.map((part, i) => {
    // Le split avec un groupe capturant alterne toujours texte/URL/texte/URL...
    if (i % 2 === 1) {
      const href = part.startsWith("http") ? part : `https://${part}`;
      return (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="chat-msg-link">
          {part}
        </a>
      );
    }
    return part;
  });
}
