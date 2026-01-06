"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useCallback } from "react";
import { useMounted } from "@/hooks/useClientValue";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <nav className="navbar" style={{ position: "relative" }}>
      <div className="container nav-container">
        <Link href="/" className="logo">
          LB <span className="highlight">Launcher</span>
        </Link>

        <ul className="nav-links">
          <li>
            <Link href="/#hero">Головна</Link>
          </li>
          <li>
            <Link href="/games">Ігри</Link>
          </li>
          <li>
            <Link href="/#gallery">Галерея</Link>
          </li>
          <li>
            <Link href="/#showcase">Функції</Link>
          </li>
          <li>
            <Link href="/#collaboration">Співпраця</Link>
          </li>
        </ul>

        <div className="nav-socials">
          <a
            href="https://littlebitua.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            title="Веб-сайт"
          >
            <i className="fa-solid fa-globe" />
          </a>
          <a
            href="https://t.me/LittleBitUA"
            target="_blank"
            rel="noopener noreferrer"
            title="Telegram"
          >
            <i className="fa-brands fa-telegram" />
          </a>
          <a
            href="https://x.com/LittleBitUA"
            target="_blank"
            rel="noopener noreferrer"
            title="Twitter"
          >
            <i className="fa-brands fa-twitter" />
          </a>
          <a
            href="https://www.youtube.com/@UA_LittleBit"
            target="_blank"
            rel="noopener noreferrer"
            title="YouTube"
          >
            <i className="fa-brands fa-youtube" />
          </a>
          <a
            href="https://www.tiktok.com/@littlebit_ua"
            target="_blank"
            rel="noopener noreferrer"
            title="TikTok"
          >
            <i className="fa-brands fa-tiktok" />
          </a>

          {mounted && (
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              title="Змінити тему"
            >
              <i className="fa-solid fa-sun" />
              <i className="fa-solid fa-moon" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
