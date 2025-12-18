"use client";

import Image from "next/image";
import { useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

interface GameBannerProps {
  bannerUrl: string | null;
  logoUrl: string | null;
  name: string;
}

export function GameBanner({ bannerUrl, logoUrl, name }: GameBannerProps) {
  const scrollY = useMotionValue(0);
  const scale = useTransform(scrollY, [-150, 0], [1.5, 1]);

  useEffect(() => {
    const handleScroll = () => {
      // Only works in Safari/iOS where scrollY can be negative
      scrollY.set(Math.min(window.scrollY, 0));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  return (
    <div className="game-banner">
      {bannerUrl ? (
        <motion.div
          style={{
            scale,
            transformOrigin: "center top",
            position: "absolute",
            inset: 0,
          }}
        >
          <Image
            src={bannerUrl}
            alt={`${name} — український переклад`}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      ) : (
        <div className="game-banner-placeholder" />
      )}
      <div className="game-banner-overlay" />

      {logoUrl && (
        <Image
          src={logoUrl}
          alt={name}
          width={400}
          height={200}
          className="game-banner-logo"
          style={{
            objectFit: "contain",
            width: "auto",
            height: "auto",
            maxHeight: "150px",
            maxWidth: "400px",
          }}
        />
      )}
    </div>
  );
}
