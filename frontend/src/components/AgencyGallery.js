import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import "./AgencyGallery.css";

const PHOTOS = [
  { src: "/gallery/agence-1.jpg", caption: "Notre agence, au coeur de la ville" },
  { src: "/gallery/agence-2.jpg", caption: "Une facade pensee pour vous accueillir" },
  { src: "/gallery/agence-3.jpg", caption: "Un accompagnement personnalise" },
  { src: "/gallery/agence-4.jpg", caption: "Un espace moderne a votre service" },
];

export default function AgencyGallery() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const DURATION = 3500;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % PHOTOS.length);
    }, DURATION);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (index) => {
    clearInterval(timerRef.current);
    setCurrent(index);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % PHOTOS.length);
    }, DURATION);
  };

  return (
    <section className="agency-gallery">
      <Reveal className="home-container">
        <div className="home-section-title">
          <h2>Nos agences</h2>
          <p>Decouvrez MoneyGreen sur le terrain, proche de vous.</p>
        </div>

        <div className="agency-gallery-frame">
          {PHOTOS.map((p, i) => (
            <div
              key={p.src}
              className={`agency-slide ${i === current ? "is-active" : ""}`}
            >
              <img src={p.src} alt={p.caption} />
              <span className="agency-slide-caption">{p.caption}</span>
            </div>
          ))}

          <div className="agency-dots">
            {PHOTOS.map((p, i) => (
              <button
                key={p.src}
                className={i === current ? "is-active" : ""}
                aria-label={`Voir photo ${i + 1}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
