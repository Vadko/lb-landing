import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getGameBySlugAndTeamSlug,
  getAllGameSlugsWithTeams,
  getGamesBySlug,
} from "@/lib/games";
import { teamToSlug } from "@/lib/transliterate";
import { getImageUrl } from "@/lib/images";
import { STATUS_LABELS } from "@/lib/constants";
import {
  generateSoftwareApplicationLD,
  generateFAQLD,
  generateBreadcrumbLD,
} from "@/lib/game-jsonld";
import {
  GameBanner,
  GameProgress,
  FundraisingProgress,
  GameSidebar,
  GameFAQ,
  GameInstallSteps,
} from "@/components/game-detail";

interface PageProps {
  params: Promise<{ slug: string; team: string }>;
}

export async function generateStaticParams() {
  const slugsWithTeams = await getAllGameSlugsWithTeams();
  return slugsWithTeams.map(({ slug, teamSlug }) => ({
    slug,
    team: teamSlug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, team: teamSlugParam } = await params;
  const game = await getGameBySlugAndTeamSlug(slug, teamSlugParam);

  if (!game) {
    return { title: "Переклад не знайдено" };
  }

  const statusText =
    game.status === "completed"
      ? "Повний переклад готовий!"
      : game.status === "in-progress"
        ? `Переклад ${game.translation_progress}% готовий`
        : "Переклад в розробці";

  const description = `Український переклад ${game.name} від ${game.team}. ${statusText} Завантажте безкоштовно через LB Launcher та грайте українською.`;

  return {
    title: `${game.name} українською від ${game.team} — Український переклад гри`,
    description,
    keywords: [
      `${game.name} українською`,
      `${game.name} український переклад`,
      `${game.name} ${game.team}`,
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
      title: `${game.name} українською від ${game.team} | LB Launcher`,
      description,
      images: game.banner_path
        ? [getImageUrl(game.banner_path, game.updated_at)!]
        : undefined,
      type: "article",
      locale: "uk_UA",
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.name} українською від ${game.team}`,
      description,
      images: game.banner_path
        ? [getImageUrl(game.banner_path, game.updated_at)!]
        : undefined,
    },
    alternates: {
      canonical: `https://lblauncher.com/games/${slug}/${teamToSlug(game.team)}`,
    },
  };
}

export const revalidate = 3600;

export default async function GameTranslationPage({ params }: PageProps) {
  const { slug, team: teamSlugParam } = await params;
  const game = await getGameBySlugAndTeamSlug(slug, teamSlugParam);

  if (!game) {
    notFound();
  }

  const allTranslations = await getGamesBySlug(slug);
  const otherTranslations = allTranslations.filter((t) => t.team !== game.team);

  const status = STATUS_LABELS[game.status] || STATUS_LABELS.planned;
  const bannerUrl = getImageUrl(game.banner_path, game.updated_at);
  const logoUrl = getImageUrl(game.logo_path, game.updated_at);

  const breadcrumbItems = [
    { name: "Головна", url: "https://lblauncher.com" },
    { name: "Ігри", url: "https://lblauncher.com/games" },
    { name: game.name, url: `https://lblauncher.com/games/${slug}` },
    {
      name: game.team,
      url: `https://lblauncher.com/games/${slug}/${teamToSlug(game.team)}`,
    },
  ];

  return (
    <article className="game-detail">
      <GameBanner bannerUrl={bannerUrl} logoUrl={logoUrl} name={game.name} />

      <div className="game-content">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="game-breadcrumb">
            <Link href="/">Головна</Link>
            <span>/</span>
            <Link href="/games">Ігри</Link>
            <span>/</span>
            {otherTranslations.length > 0 ? (
              <>
                <Link href={`/games/${slug}`}>{game.name}</Link>
                <span>/</span>
                <span className="current">{game.team}</span>
              </>
            ) : (
              <span className="current">{game.name}</span>
            )}
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
                  Переклад від{" "}
                  <Link
                    href={`/games?team=${encodeURIComponent(game.team)}`}
                    className="game-team-link"
                  >
                    {game.team}
                  </Link>
                  {game.version && ` • Версія ${game.version}`}
                </p>
              </header>

              {/* Other Translations */}
              {otherTranslations.length > 0 && (
                <section className="game-section game-other-translations">
                  <h2>Інші переклади цієї гри</h2>
                  <div className="game-translations-list">
                    {otherTranslations.map((t) => (
                      <Link
                        key={t.id}
                        href={`/games/${slug}/${teamToSlug(t.team)}`}
                        className="game-translation-link"
                      >
                        <span className="game-translation-team">{t.team}</span>
                        <span className="game-translation-progress">
                          {t.translation_progress}%
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <GameProgress
                translationProgress={game.translation_progress}
                editingProgress={game.editing_progress}
                voiceProgress={game.voice_progress}
              />

              <FundraisingProgress
                current={game.fundraising_current}
                goal={game.fundraising_goal}
              />

              {game.description && (
                <section className="game-section">
                  <h2>Про переклад</h2>
                  <p className="game-description whitespace-pre-line">
                    {game.description}
                  </p>
                </section>
              )}

              {game.game_description && (
                <section className="game-section">
                  <h2>Про гру</h2>
                  <p className="game-description whitespace-pre-line">
                    {game.game_description}
                  </p>
                </section>
              )}

              <GameInstallSteps gameName={game.name} />
              <GameFAQ game={game} />
            </div>

            <GameSidebar game={game} />
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateSoftwareApplicationLD(game)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQLD(game)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbLD(breadcrumbItems)),
        }}
      />
    </article>
  );
}
