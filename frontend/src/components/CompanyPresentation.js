import { useMemo, useState } from "react";
import { COMPANY_PRESENTATION } from "../data/companyPresentationContent";
import "./CompanyPresentation.css";

// Proportion du texte visible avant troncature (meme logique que
// PrivacyPolicyNotice : 1/4 visible, 3/4 masque derriere "Lire la suite").
const PREVIEW_RATIO = 0.25;

function IconBank() {
  return (
    <svg viewBox="0 0 24 24" className="company-pres-icon-svg" aria-hidden="true">
      <path d="M12 2 2 8v2h20V8L12 2Z" fill="currentColor" />
      <rect x="4" y="11" width="2.4" height="8" fill="currentColor" />
      <rect x="10.8" y="11" width="2.4" height="8" fill="currentColor" />
      <rect x="17.6" y="11" width="2.4" height="8" fill="currentColor" />
      <rect x="2" y="20" width="20" height="2" fill="currentColor" />
    </svg>
  );
}

function IconScale() {
  return (
    <svg viewBox="0 0 24 24" className="company-pres-icon-svg" aria-hidden="true">
      <line x1="12" y1="3" x2="12" y2="20" stroke="currentColor" strokeWidth="1.8" />
      <line x1="4" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 7 1.5 12.5a3 3 0 0 0 5 0L4 7Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20 7l-2.5 5.5a3 3 0 0 0 5 0L20 7Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <rect x="8" y="20" width="8" height="1.8" rx="0.5" fill="currentColor" />
      <path d="M9 3h6v1.6H9z" fill="currentColor" />
    </svg>
  );
}

function IconMonitor() {
  return (
    <svg viewBox="0 0 24 24" className="company-pres-icon-svg" aria-hidden="true">
      <rect x="2.5" y="4" width="19" height="13" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <line x1="8" y1="20.5" x2="16" y2="20.5" stroke="currentColor" strokeWidth="1.8" />
      <line x1="12" y1="17" x2="12" y2="20.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 13.5 9.5 9.8l2.6 2.4 5-5.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" className="company-pres-icon-svg" aria-hidden="true">
      <path d="M12 2 4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5l-8-3Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8.5 12 11 14.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg viewBox="0 0 24 24" className="company-pres-icon-svg" aria-hidden="true">
      <path d="M12 21s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.4" fill="currentColor" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" className="company-pres-icon-svg" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <ellipse cx="12" cy="12" rx="4" ry="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" className="company-pres-icon-svg" aria-hidden="true">
      <rect x="4.5" y="10.5" width="15" height="10" rx="1.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="15.3" r="1.5" fill="currentColor" />
    </svg>
  );
}

const ICONS = {
  bank: IconBank,
  scale: IconScale,
  monitor: IconMonitor,
  shield: IconShield,
  pin: IconPin,
  globe: IconGlobe,
  lock: IconLock,
};

function textLength(str) {
  return str ? str.length : 0;
}

// Construit la liste complete des blocs (titres de section + paragraphes +
// listes) a partir des 4 sections, plus le total de caracteres, pour pouvoir
// calculer un apercu tronque a environ 25% du volume total (meme logique que
// la politique de confidentialite).
function buildBlocks(sections) {
  const blocks = [];
  let total = 0;

  sections.forEach((section, sectionIndex) => {
    blocks.push({ kind: "title", icon: section.icon, text: section.title, key: `title-${sectionIndex}` });
    total += textLength(section.title);

    section.body.forEach((item, itemIndex) => {
      const key = `s${sectionIndex}-${itemIndex}`;
      if (item.type === "p") {
        blocks.push({ kind: "p", text: item.text, key });
        total += textLength(item.text);
      } else if (item.type === "ul") {
        blocks.push({ kind: "ul", items: item.items, key });
        total += item.items.reduce((sum, li) => sum + textLength(li), 0);
      } else if (item.type === "ol") {
        blocks.push({ kind: "ol", items: item.items, key });
        total += item.items.reduce((sum, step) => sum + textLength(step.title) + textLength(step.text), 0);
      }
    });
  });

  return { blocks, total };
}

function buildPreview(blocks, targetLength) {
  const preview = [];
  let used = 0;

  for (const block of blocks) {
    if (used >= targetLength) break;

    if (block.kind === "title") {
      // Ne jamais afficher un titre de section tronque : soit il rentre
      // entierement, soit on s'arrete juste avant.
      if (used + textLength(block.text) > targetLength) break;
      preview.push(block);
      used += textLength(block.text);
      continue;
    }

    if (block.kind === "p") {
      const remaining = targetLength - used;
      if (textLength(block.text) <= remaining) {
        preview.push(block);
        used += textLength(block.text);
      } else {
        const cut = block.text.slice(0, Math.max(remaining, 40));
        const lastSpace = cut.lastIndexOf(" ");
        const safeCut = lastSpace > 20 ? cut.slice(0, lastSpace) : cut;
        preview.push({ ...block, text: `${safeCut}…`, key: `${block.key}-cut` });
        used = targetLength;
      }
      continue;
    }

    if (block.kind === "ul") {
      const keptItems = [];
      for (const li of block.items) {
        if (used >= targetLength) break;
        keptItems.push(li);
        used += textLength(li);
      }
      if (keptItems.length > 0) {
        preview.push({ ...block, items: keptItems, key: `${block.key}-cut` });
      }
      continue;
    }

    if (block.kind === "ol") {
      const keptItems = [];
      for (const step of block.items) {
        if (used >= targetLength) break;
        keptItems.push(step);
        used += textLength(step.title) + textLength(step.text);
      }
      if (keptItems.length > 0) {
        preview.push({ ...block, items: keptItems, key: `${block.key}-cut` });
      }
    }
  }

  return preview;
}

function renderBlock(block) {
  switch (block.kind) {
    case "title": {
      const Icon = ICONS[block.icon];
      return (
        <div className="company-pres-flow-title" key={block.key}>
          <span className="company-pres-icon" aria-hidden="true">
            <Icon />
          </span>
          <h3>{block.text}</h3>
        </div>
      );
    }
    case "p":
      return (
        <p className="company-pres-text company-pres-indent" key={block.key}>
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul className="company-pres-list company-pres-indent" key={block.key}>
          {block.items.map((li, i) => (
            <li key={i}>{li}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="company-pres-steps company-pres-indent" key={block.key}>
          {block.items.map((step, i) => (
            <li key={i}>
              <strong>{step.title}</strong> : {step.text}
            </li>
          ))}
        </ol>
      );
    default:
      return null;
  }
}

export default function CompanyPresentation() {
  const data = COMPANY_PRESENTATION;
  const [expanded, setExpanded] = useState(false);

  const { blocks, total } = useMemo(() => buildBlocks(data.sections), [data.sections]);
  const previewBlocks = useMemo(() => buildPreview(blocks, total * PREVIEW_RATIO), [blocks, total]);

  const visibleBlocks = expanded ? blocks : previewBlocks;

  return (
    <section className="home-section" aria-label="Présentation de Money Green Finance Ltd">
      <div className="home-container">
        <div className="company-pres">
          <header className="company-pres-header">
            <h2 className="company-pres-name">{data.name}</h2>
            <p className="company-pres-tagline">{data.tagline}</p>
            <div className="company-pres-locations">
              <p><strong>Siège social :</strong> {data.headquarters}</p>
              <p><strong>Service local :</strong> {data.localService}</p>
            </div>
          </header>

          <div className={`company-pres-body${expanded ? "" : " company-pres-body-collapsed"}`}>
            {visibleBlocks.map(renderBlock)}
            {!expanded && <div className="company-pres-fade" />}
          </div>

          <button
            type="button"
            className="company-pres-toggle"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Réduire" : "Lire la suite"}
          </button>

          <div className="company-pres-keyinfo">
            <p className="company-pres-keyinfo-title">Informations clés</p>
            <div className="company-pres-keyinfo-grid">
              {data.keyInfo.map((item, i) => {
                const Icon = ICONS[item.icon];
                return (
                  <div className="company-pres-keyinfo-item" key={i}>
                    <span className="company-pres-keyinfo-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span>
                      {item.label ? <strong>{item.label} </strong> : null}
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <footer className="company-pres-footer">
            <p className="company-pres-footer-main">{data.footer.main}</p>
            <p className="company-pres-footer-sub">{data.footer.sub}</p>
          </footer>
        </div>
      </div>
    </section>
  );
}
