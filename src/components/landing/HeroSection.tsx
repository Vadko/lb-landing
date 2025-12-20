"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useGitHubRelease,
  getDownloadLinks,
  detectOS,
  formatDate,
} from "@/hooks/useGitHubRelease";
import { useGamesCount } from "@/hooks/useGames";
import { useClientValue } from "@/hooks/useClientValue";
import confetti from "canvas-confetti";

const TYPEWRITER_PHRASES = [
  "без зусиль!",
  "в один клац!",
  "це просто!",
  "це топ!",
];

export function HeroSection() {
  const { data: release, isLoading: isReleaseLoading } = useGitHubRelease();
  const { data: gamesCount } = useGamesCount();
  const downloadLinks = getDownloadLinks(release);
  const os = useClientValue(detectOS, "windows");
  const [typewriterText, setTypewriterText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (typewriterText.length < currentPhrase.length) {
            setTypewriterText(
              currentPhrase.slice(0, typewriterText.length + 1)
            );
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (typewriterText.length > 0) {
            setTypewriterText(typewriterText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
          }
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [typewriterText, isDeleting, phraseIndex]);

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#00C2FF", "#BD00FF", "#ffffff"],
    });
  }, []);

  const handleDownload = (url: string | null) => {
    if (url) {
      fireConfetti();
      window.open(url, "_blank");
    }
  };

  const getMainDownloadUrl = () => {
    if (os === "macos") return downloadLinks.macos;
    if (os === "linux") return downloadLinks.linux;
    return downloadLinks.windows;
  };

  const getMainDownloadLabel = () => {
    if (os === "macos") return "Завантажити для macOS";
    if (os === "linux") return "Завантажити для Linux";
    return "Завантажити для Windows";
  };

  const getMainDownloadSubtitle = () => {
    if (os === "macos") return ".dmg";
    if (os === "linux") return "AppImage";
    return "x64 Installer";
  };

  const getMainDownloadIcon = () => {
    if (os === "macos") return "fa-apple";
    if (os === "linux") return "fa-linux";
    return "fa-windows";
  };

  const getInstructionUrl = () => {
    if (os === "macos") return "https://github.com/Vadko/littlebit-launcher#macos";
    if (os === "linux") return "https://github.com/Vadko/littlebit-launcher#linux";
    return "https://github.com/Vadko/littlebit-launcher#windows";
  };

  const versionText = isReleaseLoading
    ? "Завантаження..."
    : downloadLinks.version && downloadLinks.publishedAt
      ? `Версія ${downloadLinks.version} від ${formatDate(downloadLinks.publishedAt)}`
      : "Версія ...";

  return (
    <section id="hero" className="hero">
      <div className="container hero-wrapper">
        <div className="hero-content">
          <div className="badge">
            <div className="badge-icon">
              <i className="fa-solid fa-rocket" />
            </div>
            <span>{versionText}</span>
          </div>

          <h1>
            Ігри українською —<br />
            <span className="text-gradient typewriter">{typewriterText}</span>
          </h1>

          <p>
            Зручний менеджер для встановлення й оновлення перекладів.
            Автоматичний пошук ігор, світла та темна теми, а також резервні
            копії.
          </p>

          {/* Games button above download */}
          <Link href="/games" className="games-link">
            <i className="fa-solid fa-gamepad" />
            <span>Переглянути всі ігри</span>
            <i className="fa-solid fa-arrow-right" />
          </Link>

          <div className="download-row">
            <button
              onClick={() => handleDownload(getMainDownloadUrl())}
              className="dl-btn"
              disabled={!getMainDownloadUrl()}
            >
              <i className={`fa-brands ${getMainDownloadIcon()}`} />
              <div className="dl-info">
                <span>{getMainDownloadLabel()}</span>
                <small>{getMainDownloadSubtitle()}</small>
              </div>
            </button>

            <div className="dl-others">
              {os !== "linux" && downloadLinks.linux && (
                <button
                  onClick={() => handleDownload(downloadLinks.linux)}
                  className="dl-mini"
                  title="Linux"
                >
                  <i className="fa-brands fa-linux" />
                </button>
              )}
              {os !== "macos" && downloadLinks.macos && (
                <button
                  onClick={() => handleDownload(downloadLinks.macos)}
                  className="dl-mini"
                  title="macOS"
                >
                  <i className="fa-brands fa-apple" />
                </button>
              )}
              {os !== "windows" && downloadLinks.windows && (
                <button
                  onClick={() => handleDownload(downloadLinks.windows)}
                  className="dl-mini"
                  title="Windows"
                >
                  <i className="fa-brands fa-windows" />
                </button>
              )}
            </div>
          </div>

          <a
            href={getInstructionUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="instruction-link"
          >
            <i className="fa-solid fa-book" />
            <span>Інструкція з встановлення</span>
          </a>

          <div className="stats-mini">
            <div>
              <i className="fa-solid fa-gamepad" />
              <span>{gamesCount ?? "80"}+ Ігор</span>
            </div>
            {downloadLinks.totalDownloads > 0 && (
              <div>
                <i className="fa-solid fa-download" />
                <span>
                  {downloadLinks.totalDownloads.toLocaleString()}+ Завантажень
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="hero-visual">
          <Image
            src="/assets/2.webp"
            alt="LB Launcher головний екран — українізатор ігор"
            width={600}
            height={400}
            className="hero-img main-shot"
            priority
          />
          <Image
            src="/assets/1.webp"
            alt="LB Launcher світла тема"
            width={540}
            height={360}
            className="hero-img back-shot"
          />
        </div>
      </div>
    </section>
  );
}
