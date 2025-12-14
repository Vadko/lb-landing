import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGameBySlug, getAllGameSlugs } from "@/lib/games";
import { getImageUrl } from "@/lib/images";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllGameSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    return {
      title: "Гру не знайдено",
    };
  }

  const statusText =
    game.status === "completed"
      ? "Повний переклад готовий!"
      : game.status === "in-progress"
        ? `Переклад ${game.translation_progress}% готовий`
        : "Переклад в розробці";

  const description = `Український переклад ${game.name} від ${game.team}. ${statusText} Завантажте безкоштовно через LB Launcher та грайте українською.`;

  return {
    title: `${game.name} українською — Український переклад гри`,
    description,
    keywords: [
      `${game.name} українською`,
      `${game.name} український переклад`,
      `${game.name} українізатор`,
      `${game.name} локалізація`,
      `${game.name} переклад`,
      `${game.name} ua`,
      `${game.name} ukrainian`,
      `скачати ${game.name} українською`,
      `як перекласти ${game.name}`,
      "українізатор ігор",
      "LB Launcher",
    ],
    openGraph: {
      title: `${game.name} українською — Український переклад | LB Launcher`,
      description,
      images: game.banner_path ? [getImageUrl(game.banner_path)!] : undefined,
      type: "article",
      locale: "uk_UA",
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.name} українською`,
      description,
      images: game.banner_path ? [getImageUrl(game.banner_path)!] : undefined,
    },
    alternates: {
      canonical: `https://lblauncher.com/games/${slug}`,
    },
  };
}

export const revalidate = 3600; // Revalidate every hour

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  completed: { label: "Готово", className: "game-status-badge completed" },
  "in-progress": {
    label: "В розробці",
    className: "game-status-badge in-progress",
  },
  planned: { label: "Заплановано", className: "game-status-badge planned" },
};

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const status = STATUS_LABELS[game.status] || STATUS_LABELS.planned;
  const bannerUrl = getImageUrl(game.banner_path);
  const logoUrl = getImageUrl(game.logo_path);

  const socialLinks = [
    { url: game.telegram, icon: "fa-brands fa-telegram", label: "Telegram" },
    { url: game.discord, icon: "fa-brands fa-discord", label: "Discord" },
    { url: game.youtube, icon: "fa-brands fa-youtube", label: "YouTube" },
    { url: game.twitter, icon: "fa-brands fa-twitter", label: "Twitter" },
    { url: game.website, icon: "fa-solid fa-globe", label: "Веб-сайт" },
  ].filter((link) => link.url);

  return (
    <article className="game-detail">
      {/* Hero Banner */}
      <div className="game-banner">
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt={`${game.name} — український переклад`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="game-banner-placeholder" />
        )}
        <div className="game-banner-overlay" />

        {logoUrl && (
          <Image
            src={logoUrl}
            alt={game.name}
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

      <div className="game-content">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="game-breadcrumb">
            <Link href="/">Головна</Link>
            <span>/</span>
            <Link href="/games">Ігри</Link>
            <span>/</span>
            <span className="current">{game.name}</span>
          </nav>

          <div className="game-info-grid">
            {/* Main Content */}
            <div className="game-main">
              <header className="game-header">
                <div className="game-title-row">
                  <h1>{game.name}</h1>
                  <span className={status.className}>{status.label}</span>
                </div>
                <p className="game-meta">
                  Переклад від <strong>{game.team}</strong>
                  {game.version && ` • Версія ${game.version}`}
                </p>
              </header>

              {/* Progress */}
              <section className="game-section">
                <h2>Прогрес перекладу</h2>
                <div className="game-progress-list">
                  <div className="game-progress-item">
                    <div className="game-progress-header">
                      <span>Переклад тексту</span>
                      <span>{game.translation_progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${game.translation_progress}%` }}
                      />
                    </div>
                  </div>

                  {game.editing_progress > 0 && (
                    <div className="game-progress-item">
                      <div className="game-progress-header">
                        <span>Редагування</span>
                        <span>{game.editing_progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${game.editing_progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {game.voice_progress && game.voice_progress > 0 && (
                    <div className="game-progress-item">
                      <div className="game-progress-header">
                        <span>Озвучення</span>
                        <span>{game.voice_progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${game.voice_progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Description */}
              {game.description && (
                <section className="game-section">
                  <h2>Про переклад</h2>
                  <p className="game-description">{game.description}</p>
                </section>
              )}

              {game.game_description && (
                <section className="game-section">
                  <h2>Про гру</h2>
                  <p className="game-description">{game.game_description}</p>
                </section>
              )}

              {/* How to Install - SEO content */}
              <section className="game-section">
                <h2>Як встановити український переклад {game.name}</h2>
                <ol className="game-install-steps">
                  <li>
                    <strong>Завантажте LB Launcher</strong> — безкоштовну
                    програму для встановлення українських перекладів ігор
                  </li>
                  <li>
                    <strong>Знайдіть {game.name}</strong> у каталозі ігор
                    лаунчера
                  </li>
                  <li>
                    <strong>Натисніть &quot;Встановити&quot;</strong> — переклад
                    автоматично завантажиться та встановиться
                  </li>
                  <li>
                    <strong>Запустіть гру</strong> та насолоджуйтесь українською
                    локалізацією!
                  </li>
                </ol>
              </section>

              {/* FAQ - SEO content */}
              <section className="game-section game-faq">
                <h2>Часті питання про переклад {game.name}</h2>
                <div className="faq-list">
                  <details className="faq-item">
                    <summary>
                      Чи безкоштовний український переклад {game.name}?
                    </summary>
                    <p>
                      Так, переклад {game.name} від команди {game.team} повністю
                      безкоштовний. Завантажте LB Launcher та встановіть
                      українську локалізацію за кілька кліків.
                    </p>
                  </details>
                  <details className="faq-item">
                    <summary>
                      Чи потрібна ліцензійна гра для встановлення перекладу?
                    </summary>
                    <p>
                      Так, для коректної роботи перекладу потрібна оригінальна
                      гра {game.name}. Переклад працює з версіями з{" "}
                      {game.platforms?.join(", ") || "Steam, GOG, Epic Games"}.
                    </p>
                  </details>
                  <details className="faq-item">
                    <summary>Як оновити переклад до нової версії?</summary>
                    <p>
                      LB Launcher автоматично перевіряє оновлення. Коли вийде
                      нова версія перекладу, ви отримаєте сповіщення та зможете
                      оновити в один клік.
                    </p>
                  </details>
                  {game.voice_progress && game.voice_progress > 0 && (
                    <details className="faq-item">
                      <summary>
                        Чи є українська озвучка для {game.name}?
                      </summary>
                      <p>
                        Так! Команда {game.team} працює над українською
                        озвучкою. Наразі озвучено {game.voice_progress}% гри.
                      </p>
                    </details>
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar */}
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
                  {game.downloads
                    ? game.downloads > 0 && (
                        <div className="game-stat">
                          <span>Завантажень</span>
                          <strong>{game.downloads.toLocaleString()}</strong>
                        </div>
                      )
                    : null}
                  {game.platforms && game.platforms.length > 0 && (
                    <div className="game-stat">
                      <span>Платформи</span>
                      <strong>{game.platforms.join(", ")}</strong>
                    </div>
                  )}
                  <div className="game-stat">
                    <span>Оновлено</span>
                    <strong>
                      {new Date(game.updated_at).toLocaleDateString("uk-UA")}
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
                  <h3>Підтримати команду</h3>
                  <a
                    href={game.support_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-support"
                  >
                    <i className="fa-solid fa-heart" />
                    Підтримати
                  </a>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>

      {/* JSON-LD Software Application */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: `${game.name} — Український переклад`,
            description: `Український переклад ${game.name} від ${game.team}. Завантажте безкоштовно через LB Launcher.`,
            applicationCategory: "GameApplication",
            operatingSystem: game.platforms?.join(", ") || "Windows",
            author: {
              "@type": "Organization",
              name: game.team,
            },
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "UAH",
            },
            inLanguage: "uk",
            downloadUrl: "https://lblauncher.com",
          }),
        }}
      />

      {/* JSON-LD FAQ - для rich snippets в Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: `Чи безкоштовний український переклад ${game.name}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `Так, переклад ${game.name} від команди ${game.team} повністю безкоштовний. Завантажте LB Launcher та встановіть українську локалізацію за кілька кліків.`,
                },
              },
              {
                "@type": "Question",
                name: `Як встановити український переклад ${game.name}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `Завантажте безкоштовний LB Launcher з lblauncher.com, знайдіть ${game.name} у каталозі ігор та натисніть "Встановити". Переклад автоматично завантажиться та встановиться.`,
                },
              },
              {
                "@type": "Question",
                name: `Чи потрібна ліцензійна гра для встановлення перекладу ${game.name}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `Так, для коректної роботи перекладу потрібна оригінальна гра ${game.name}. Переклад працює з версіями з ${game.platforms?.join(", ") || "Steam, GOG, Epic Games"}.`,
                },
              },
            ],
          }),
        }}
      />

      {/* JSON-LD BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Головна",
                item: "https://lblauncher.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Ігри",
                item: "https://lblauncher.com/games",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: game.name,
                item: `https://lblauncher.com/games/${slug}`,
              },
            ],
          }),
        }}
      />
    </article>
  );
}
