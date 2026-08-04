import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import "./PromoBanner.css";

const SLIDES = [
  {
    key: "auto",
    icon: "🚗",
    accent: "#1E8A3E",
    to: "/prets/auto",
    tag: "Prêt auto",
    title: "Prenez la route de vos envies",
    desc: "Financement rapide, taux avantageux. Votre nouvelle voiture, c'est pour bientôt.",
    cta: "Rouler maintenant",
    img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=700&q=80",
  },
  {
    key: "immobilier",
    icon: "🏠",
    accent: "#15602B",
    to: "/prets/immobilier",
    tag: "Prêt immobilier",
    title: "La clé de votre chez-vous",
    desc: "Réalisez le rêve d'une vie : devenez propriétaire avec MoneyGreen.",
    cta: "Devenir propriétaire",
    img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=700&q=80",
  },
  {
    key: "scolaire",
    icon: "🎓",
    accent: "#0d3d1d",
    to: "/prets/scolaire",
    tag: "Prêt scolaire",
    title: "Aucune ambition n'attend",
    desc: "Financez des études sans stress, remboursement pensé pour vous.",
    cta: "Investir dans l'avenir",
    img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80",
  },
  {
    key: "personnel",
    icon: "💼",
    accent: "#3fc466",
    to: "/prets/personnel",
    tag: "Prêt personnel",
    title: "Vos projets, notre confiance",
    desc: "Un capital disponible rapidement pour concrétiser tout ce qui compte pour vous.",
    cta: "Obtenir mon prêt",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=700&q=80",
  },
];

export default function PromoBanner() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const DURATION = 4000;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, DURATION);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (index) => {
    clearInterval(timerRef.current);
    setCurrent(index);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, DURATION);
  };

  return (
    <section className="promo-banner" aria-label="Nos offres MoneyGreen">
      <Reveal className="promo-banner-inner">
        {SLIDES.map((s, i) => (
          <div
            key={s.key}
            className={`promo-slide ${i === current ? "is-active" : ""}`}
          >
            <div className="promo-slide-text">
              <div
                className="promo-slide-icon"
                style={{ background: s.accent }}
              >
                <span>{s.icon}</span>
              </div>
              <span
                className="promo-slide-tag"
                style={{ color: s.accent, borderColor: s.accent }}
              >
                {s.tag}
              </span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <Link
                to={s.to}
                className="promo-slide-cta"
                style={{ background: s.accent }}
              >
                {s.cta}
              </Link>
            </div>
            <div
              className="promo-slide-img"
              style={{ backgroundImage: `url(${s.img})` }}
            />
          </div>
        ))}

        <div className="promo-dots">
          {SLIDES.map((s, i) => (
            <button
              key={s.key}
              className={i === current ? "is-active" : ""}
              aria-label={`Voir offre ${s.key}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <div className="promo-progress-track">
          <div
            key={current}
            className="promo-progress-bar"
            style={{ animationDuration: `${DURATION}ms` }}
          />
        </div>
      </Reveal>
    </section>
  );
}
