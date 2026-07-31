import { useMemo, useState } from "react";
import { useLang } from "../context/LangContext";
import { getPrivacyPolicySections } from "../data/privacyPolicyContent";
import "./PrivacyPolicyNotice.css";

// Proportion du texte visible avant troncature (1/4 visible, 3/4 masque).
const PREVIEW_RATIO = 0.25;

function textLength(str) {
  return str ? str.length : 0;
}

// Construit la liste complete des blocs a afficher, plus une version tronquee
// a environ PREVIEW_RATIO du volume total de texte (titres de section inclus).
function buildBlocks(sections) {
  const blocks = [];
  let total = 0;

  sections.forEach((section, sectionIndex) => {
    blocks.push({ kind: "title", text: section.title, key: `title-${sectionIndex}` });
    total += textLength(section.title);

    section.body.forEach((item, itemIndex) => {
      const key = `s${sectionIndex}-${itemIndex}`;
      if (item.type === "p") {
        blocks.push({ kind: "p", text: item.text, key });
        total += textLength(item.text);
      } else if (item.type === "h4") {
        blocks.push({ kind: "h4", text: item.text, key });
        total += textLength(item.text);
      } else if (item.type === "ul") {
        blocks.push({ kind: "ul", items: item.items, key });
        total += item.items.reduce((sum, li) => sum + textLength(li), 0);
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

    if (block.kind === "title" || block.kind === "h4") {
      // Ne jamais afficher un titre tronque : soit il rentre entierement, soit on s'arrete avant.
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
    }
  }

  return preview;
}

function renderBlock(block) {
  switch (block.kind) {
    case "title":
      return <h4 className="privacy-notice-section-title" key={block.key}>{block.text}</h4>;
    case "h4":
      return <h5 className="privacy-notice-subtitle" key={block.key}>{block.text}</h5>;
    case "p":
      return <p className="privacy-notice-text" key={block.key}>{block.text}</p>;
    case "ul":
      return (
        <ul className="privacy-notice-list" key={block.key}>
          {block.items.map((li, i) => (
            <li key={i}>{li}</li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export default function PrivacyPolicyNotice() {
  const { lang, t } = useLang();
  const [expanded, setExpanded] = useState(false);

  const sections = useMemo(() => getPrivacyPolicySections(lang), [lang]);
  const { blocks, total } = useMemo(() => buildBlocks(sections), [sections]);
  const previewBlocks = useMemo(() => buildPreview(blocks, total * PREVIEW_RATIO), [blocks, total]);

  const visibleBlocks = expanded ? blocks : previewBlocks;

  return (
    <section className="privacy-notice">
      <div className="privacy-notice-header">
        <h3 className="privacy-notice-title">{t("privacy_notice_title")}</h3>
        <p className="privacy-notice-eyebrow">{t("privacy_notice_subtitle")}</p>
      </div>

      <div className={`privacy-notice-body${expanded ? "" : " privacy-notice-body-collapsed"}`}>
        {visibleBlocks.map(renderBlock)}
        {!expanded && <div className="privacy-notice-fade" />}
      </div>

      <button
        type="button"
        className="privacy-notice-toggle"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? t("privacy_notice_collapse") : t("privacy_notice_read_more")}
      </button>
    </section>
  );
}
