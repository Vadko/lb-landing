"use client";

import { useState } from "react";
import Image from "next/image";

const GALLERY_ITEMS = [
  {
    src: "/assets/2.webp",
    alt: "Головний екран LB Launcher",
    label: "Головний екран",
    description:
      "Каталог ігор з українськими перекладами. Шукайте, фільтруйте та встановлюйте локалізації в один клік.",
    large: true,
  },
  {
    src: "/assets/1.webp",
    alt: "LB Launcher світла тема",
    label: "Світла тема",
    description:
      "Лаунчер підтримує світлу та темну теми — обирайте те, що зручніше для ваших очей.",
  },
  {
    src: "/assets/3.webp",
    alt: "Налаштування LB Launcher",
    label: "Налаштування",
    description:
      "Гнучкі налаштування: тема, мова інтерфейсу, шляхи до ігор та автооновлення.",
  },
  {
    src: "/assets/4.webp",
    alt: "Сповіщення LB Launcher",
    label: "Сповіщення",
    description:
      "Отримуйте сповіщення про нові переклади та оновлення встановлених локалізацій.",
  },
  {
    src: "/assets/5.webp",
    alt: "Деталі гри в LB Launcher",
    label: "Деталі гри",
    description:
      "Детальна інформація про переклад: прогрес, команда перекладачів, версія та опис.",
  },
  {
    src: "/assets/7.webp",
    alt: "Процес завантаження в LB Launcher",
    label: "Процес завантаження",
    description:
      "Швидке завантаження та автоматичне встановлення перекладу прямо в папку з грою.",
  },
];

export function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % GALLERY_ITEMS.length);
    }
  };

  const goPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (lightboxIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length
      );
    }
  };

  return (
    <section id="gallery" className="gallery-sec">
      <div className="container">
        <h2 className="section-title center">Погляньте на лаунчер</h2>
        <p className="section-subtitle center">
          Сучасний дизайн, зручний інтерфейс і все потрібне для комфортної гри
          українською.
        </p>

        <div className="gallery-grid">
          {GALLERY_ITEMS.map((item, index) => (
            <div
              key={index}
              className={`gallery-item ${item.large ? "large" : ""}`}
              onClick={() => openLightbox(index)}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.large ? 800 : 400}
                height={item.large ? 600 : 300}
              />
              <div className="gallery-overlay">
                <span>{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <div
        className={`lightbox ${lightboxIndex !== null ? "active" : ""}`}
        onClick={closeLightbox}
      >
        <button className="lightbox-close" onClick={closeLightbox}>
          <i className="fa-solid fa-xmark" />
        </button>

        <button
          className="lightbox-nav prev"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
        >
          <i className="fa-solid fa-chevron-left" />
        </button>

        <button
          className="lightbox-nav next"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
        >
          <i className="fa-solid fa-chevron-right" />
        </button>

        {lightboxIndex !== null && (
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={GALLERY_ITEMS[lightboxIndex].src}
              alt={GALLERY_ITEMS[lightboxIndex].alt}
              width={1200}
              height={800}
            />
            <div className="lightbox-caption">
              <h3>{GALLERY_ITEMS[lightboxIndex].label}</h3>
              <p>{GALLERY_ITEMS[lightboxIndex].description}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
