"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { detectOS } from "@/hooks/useGitHubRelease";

type Platform = "windows" | "macos" | "linux" | "steamdeck";

const PLATFORMS: { id: Platform; label: string; icon: string }[] = [
  { id: "windows", label: "Windows", icon: "fa-brands fa-windows" },
  { id: "macos", label: "macOS", icon: "fa-brands fa-apple" },
  { id: "linux", label: "Linux", icon: "fa-brands fa-linux" },
  { id: "steamdeck", label: "Steam Deck", icon: "fa-brands fa-steam" },
];

const getOSPlatform = (): Platform => {
  const os = detectOS();
  if (os === "macos") return "macos";
  if (os === "linux") return "linux";
  return "windows";
};

const emptySubscribe = () => () => {};

export default function SetupPage() {
  const detectedPlatform = useSyncExternalStore(
    emptySubscribe,
    getOSPlatform,
    () => "windows" as Platform
  );
  const [activePlatform, setActivePlatform] =
    useState<Platform>(detectedPlatform);

  return (
    <section className="setup-page">
      <div className="container">
        <div className="setup-header">
          <Link href="/" className="back-link">
            <i className="fa-solid fa-arrow-left" />
            На головну
          </Link>
          <h1>Встановлення LB Launcher</h1>
          <p>
            Покрокова інструкція для встановлення лаунчера на вашу платформу
          </p>
        </div>

        {/* Platform Tabs */}
        <div className="setup-tabs">
          {PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              className={`setup-tab ${activePlatform === platform.id ? "active" : ""}`}
              onClick={() => setActivePlatform(platform.id)}
            >
              <i className={platform.icon} />
              <span>{platform.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="setup-content">
          {activePlatform === "windows" && <WindowsInstructions />}
          {activePlatform === "macos" && <MacOSInstructions />}
          {activePlatform === "linux" && <LinuxInstructions />}
          {activePlatform === "steamdeck" && <SteamDeckInstructions />}
        </div>

        {/* General Notes */}
        <div className="setup-notes">
          <h2>
            <i className="fa-solid fa-circle-info" />
            Загальна інформація
          </h2>
          <ul>
            <li>Автоматичні оновлення працюють на всіх платформах</li>
            <li>Після першого запуску лаунчер працює офлайн</li>
            <li>Дані локалізацій синхронізуються автоматично</li>
          </ul>
        </div>

        {/* Download CTA */}
        <div className="setup-download-cta">
          <Link href="/#hero" className="dl-btn">
            <i className="fa-solid fa-download" />
            <div className="dl-info">
              <span>Завантажити LB Launcher</span>
              <small>Windows / macOS / Linux</small>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function WindowsInstructions() {
  return (
    <div className="setup-platform">
      <h2>
        <i className="fa-brands fa-windows" />
        Встановлення на Windows
      </h2>

      <div className="setup-section">
        <h3>Варіанти завантаження</h3>
        <ul className="setup-files">
          <li>
            <code>LB-Launcher-win-Setup.exe</code> — інсталятор
          </li>
          <li>
            <code>LB-Launcher-win-Portable.exe</code> — портативна версія
          </li>
        </ul>
      </div>

      <div className="setup-section">
        <h3>Кроки встановлення</h3>
        <ol className="setup-steps">
          <li>Завантажте файл інсталятора або портативну версію</li>
          <li>Запустіть завантажений файл</li>
          <li>Дотримуйтесь інструкцій на екрані</li>
        </ol>
      </div>

      <div className="setup-section setup-troubleshoot">
        <h3>
          <i className="fa-solid fa-triangle-exclamation" />
          Вирішення проблем
        </h3>

        <div className="setup-issue">
          <h4>Браузер попереджає про небезпечний файл</h4>
          <p>
            Оберіть &quot;Зберегти&quot; або &quot;Завантажити в будь-якому
            випадку&quot;. Попередження з&apos;являється через відсутність
            цифрового підпису (проєкт open-source).
          </p>
        </div>

        <div className="setup-issue">
          <h4>Windows SmartScreen блокує запуск</h4>
          <ol>
            <li>
              Натисніть <strong>&quot;Докладніше&quot;</strong> у вікні
              попередження
            </li>
            <li>
              Оберіть <strong>&quot;Усе одно запустити&quot;</strong>
            </li>
          </ol>
          <p>Або через властивості файлу:</p>
          <ol>
            <li>Клацніть правою кнопкою на файлі → &quot;Властивості&quot;</li>
            <li>
              Поставте галочку <strong>&quot;Розблокувати&quot;</strong> внизу
            </li>
            <li>Натисніть &quot;OK&quot; та спробуйте знову</li>
          </ol>
        </div>

        <div className="setup-issue">
          <h4>Smart App Control блокує (Windows 11)</h4>
          <ol>
            <li>Відкрийте &quot;Безпека Windows&quot;</li>
            <li>Перейдіть до &quot;Керування програмами та браузером&quot;</li>
            <li>Натисніть &quot;Параметри Smart App Control&quot;</li>
            <li>Оберіть &quot;Вимкнути&quot;</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function MacOSInstructions() {
  return (
    <div className="setup-platform">
      <h2>
        <i className="fa-brands fa-apple" />
        Встановлення на macOS
      </h2>

      <div className="setup-section">
        <h3>Варіанти завантаження</h3>
        <ul className="setup-files">
          <li>
            <code>LB-Launcher-*-arm64.dmg</code> — для Apple Silicon
          </li>
          <li>
            <code>LB-Launcher-*-x64.dmg</code> — для Intel
          </li>
        </ul>
      </div>

      <div className="setup-section">
        <h3>Кроки встановлення</h3>
        <ol className="setup-steps">
          <li>Завантажте відповідний DMG файл</li>
          <li>Відкрийте DMG файл</li>
          <li>Перетягніть програму до папки Applications</li>
        </ol>
      </div>
    </div>
  );
}

function LinuxInstructions() {
  return (
    <div className="setup-platform">
      <h2>
        <i className="fa-brands fa-linux" />
        Встановлення на Linux
      </h2>

      <div className="setup-section">
        <h3>Варіанти завантаження</h3>
        <ul className="setup-files">
          <li>
            <code>LB-Launcher-linux.AppImage</code> — універсальний формат
          </li>
          <li>
            <code>LB-Launcher-linux.rpm</code> — для Fedora/RHEL
          </li>
        </ul>
      </div>

      <div className="setup-section">
        <h3>Встановлення AppImage</h3>
        <ol className="setup-steps">
          <li>Завантажте AppImage файл</li>
          <li>
            Зробіть файл виконуваним (ПКМ → Властивості → Права → Дозволити
            виконання)
          </li>
          <li>Двічі клацніть для запуску або виконайте в терміналі</li>
        </ol>
      </div>

      <div className="setup-section">
        <h3>Встановлення RPM</h3>
        <ol className="setup-steps">
          <li>Завантажте RPM файл</li>
          <li>Встановіть через пакетний менеджер:</li>
        </ol>
        <div className="setup-code">
          <code>sudo rpm -i LB-Launcher-linux.rpm</code>
          <button
            className="copy-btn"
            onClick={() =>
              navigator.clipboard.writeText("sudo rpm -i LB-Launcher-linux.rpm")
            }
          >
            <i className="fa-solid fa-copy" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SteamDeckInstructions() {
  return (
    <div className="setup-platform">
      <h2>
        <i className="fa-brands fa-steam" />
        Встановлення на Steam Deck
      </h2>

      <div className="setup-section">
        <h3>Кроки встановлення</h3>
        <ol className="setup-steps">
          <li>
            <strong>Перейдіть у режим робочого столу:</strong> Затисніть кнопку
            живлення та оберіть &quot;Перейти на робочий стіл&quot;
          </li>
          <li>
            <strong>Завантажте:</strong> Відкрийте браузер та завантажте
            AppImage файл
          </li>
          <li>
            <strong>Надайте права:</strong>
            <ul>
              <li>Відкрийте файловий менеджер Dolphin</li>
              <li>Перейдіть до папки завантажень</li>
              <li>ПКМ на AppImage → Властивості → Права</li>
              <li>
                Увімкніть &quot;Виконання: Дозволити виконання як програми&quot;
              </li>
            </ul>
          </li>
          <li>
            <strong>Додайте до Steam (опціонально):</strong>
            <ul>
              <li>Запустіть Steam</li>
              <li>
                Оберіть &quot;Додати гру&quot; → &quot;Додати гру не зі
                Steam&quot;
              </li>
              <li>Перейдіть до завантажень та оберіть AppImage</li>
              <li>Підтвердіть додавання</li>
            </ul>
          </li>
        </ol>
      </div>

      <div className="setup-section">
        <div className="setup-tip">
          <i className="fa-solid fa-gamepad" />
          <span>
            Лаунчер автоматично підтримує навігацію геймпадом при натисканні
            будь-якої кнопки контролера.
          </span>
        </div>
      </div>
    </div>
  );
}
