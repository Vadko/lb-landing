import Link from "next/link";
import type { Game } from "@/lib/types";

interface GameSidebarProps {
  game: Game;
}

export function GameSidebar({ game }: GameSidebarProps) {
  const socialLinks = [
    { url: game.telegram, icon: "fa-brands fa-telegram", label: "Telegram" },
    { url: game.discord, icon: "fa-brands fa-discord", label: "Discord" },
    { url: game.youtube, icon: "fa-brands fa-youtube", label: "YouTube" },
    { url: game.twitter, icon: "fa-brands fa-twitter", label: "Twitter" },
    { url: game.website, icon: "fa-solid fa-globe", label: "Веб-сайт" },
  ].filter((link) => link.url);

  return (
    <aside className="game-sidebar">
      {/* Download CTA */}
      <div className="game-sidebar-card game-download-cta">
        <div className="game-download-header">
          <i className="fa-solid fa-download" />
          <h3>Встановіть переклад</h3>
        </div>
        <p>Завантажте LB Launcher і встановіть переклад в один клац</p>
        <Link href="/#hero" className="dl-btn game-dl-btn">
          <i className="fa-brands fa-windows" />
          <div className="dl-info">
            <span>Завантажити лаунчер</span>
            <small>Windows / macOS / Linux</small>
          </div>
        </Link>
        {game.slug && game.team && (
          <a
            href={`littlebit://games/${game.slug}/${encodeURIComponent(game.team)}`}
            className="btn-launcher"
          >
            <i className="fa-solid fa-rocket" />
            Відкрити в лаунчері
          </a>
        )}
      </div>

      {/* Steam Link */}
      {game.steam_app_id && (
        <div className="game-sidebar-card">
          <a
            href={`https://store.steampowered.com/app/${game.steam_app_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-steam"
          >
            <i className="fa-brands fa-steam" />
            Сторінка в Steam
          </a>
        </div>
      )}

      {/* Stats */}
      <div className="game-sidebar-card">
        <h3>Статистика</h3>
        <div className="game-stats-list">
          {game.downloads && game.downloads > 0 ? (
            <div className="game-stat">
              <span>Завантажень</span>
              <strong>{game.downloads.toLocaleString('uk-UA')}</strong>
            </div>
          ) : null}
          {game.platforms && game.platforms.length > 0 && (
            <div className="game-stat">
              <span>Платформи</span>
              <strong>{game.platforms.join(", ")}</strong>
            </div>
          )}
          <div className="game-stat">
            <span>Створено</span>
            <strong>
              {new Date(game.created_at).toLocaleDateString("uk-UA", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </strong>
          </div>
          <div className="game-stat">
            <span>Оновлено</span>
            <strong>
              {new Date(game.updated_at).toLocaleString("uk-UA", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </strong>
          </div>
        </div>
      </div>

      {/* Social Links */}
      {socialLinks.length > 0 && (
        <div className="game-sidebar-card">
          <h3>Посилання</h3>
          <div className="game-social-links">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url!}
                target="_blank"
                rel="noopener noreferrer"
                className="game-social-link"
                title={link.label}
              >
                <i className={link.icon} />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Support */}
      {game.support_url && (
        <div className="game-sidebar-card">
          <h3>Підтримати</h3>
          <a
            href={game.support_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-support"
          >
            <i className="fa-solid fa-heart" />
            Підтримати переклад
          </a>
        </div>
      )}
    </aside>
  );
}
