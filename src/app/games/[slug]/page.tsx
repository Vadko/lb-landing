import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getGamesBySlug, getAllGameSlugs } from "@/lib/games";
import { teamToSlug } from "@/lib/transliterate";
import { getImageUrl } from "@/lib/images";
import { STATUS_LABELS } from "@/lib/constants";
import { generateBreadcrumbLD } from "@/lib/game-jsonld";
import { GameBanner } from "@/components/game-detail";

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
  const translations = await getGamesBySlug(slug);

  if (translations.length === 0) {
    return { title: "Гру не знайдено" };
  }

  const game = translations[0];
  const teamNames = translations.map((t) => t.team).join(", ");

  const description =
    translations.length === 1
      ? `Український переклад ${game.name} від ${game.team}. Завантажте безкоштовно через LB Launcher.`
      : `Українські переклади ${game.name} від ${teamNames}. Оберіть переклад та завантажте безкоштовно через LB Launcher.`;

  return {
    title: `${game.name} українською — Українські переклади гри`,
    description,
    keywords: [
      `${game.name} українською`,
      `${game.name} український переклад`,
      `${game.name} українізатор`,
      `${game.name} локалізація`,
      "українізатор ігор",
      "LB Launcher",
    ],
    openGraph: {
      title: `${game.name} українською | LB Launcher`,
      description,
      images: game.banner_path
        ? [getImageUrl(game.banner_path, game.updated_at)!]
        : undefined,
      type: "article",
      locale: "uk_UA",
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.name} українською`,
      description,
      images: game.banner_path
        ? [getImageUrl(game.banner_path, game.updated_at)!]
        : undefined,
    },
    alternates: {
      canonical: `https://lblauncher.com/games/${slug}`,
    },
  };
}

export const revalidate = 3600;

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params;
  const translations = await getGamesBySlug(slug);

  if (translations.length === 0) {
    notFound();
  }

  // If only one translation, redirect to the specific translation page
  if (translations.length === 1) {
    redirect(`/games/${slug}/${teamToSlug(translations[0].team)}`);
  }

  // Multiple translations - show selection page
  const game = translations[0]; // Use first translation for banner/name
  const bannerUrl = getImageUrl(game.banner_path, game.updated_at);
  const logoUrl = getImageUrl(game.logo_path, game.updated_at);

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
            <span className="current">{game.name}</span>
          </nav>

          <div className="game-translations-select">
            <header className="game-header">
              <h1>{game.name}</h1>
              <p className="game-translations-subtitle">
                Для цієї гри доступно {translations.length} переклади. Оберіть
                переклад від команди, яка вам більше подобається.
              </p>
            </header>

            <div className="game-translations-grid">
              {translations.map((translation) => {
                const status =
                  STATUS_LABELS[translation.status] || STATUS_LABELS.planned;
                const translationBanner = getImageUrl(translation.banner_path);

                return (
                  <Link
                    key={translation.id}
                    href={`/games/${slug}/${teamToSlug(translation.team)}`}
                    className="game-translation-card"
                  >
                    <div className="game-translation-card-image">
                      {translationBanner ? (
                        <Image
                          src={translationBanner}
                          alt={`${game.name} від ${translation.team}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="game-card-placeholder">
                          <i className="fa-solid fa-gamepad" />
                        </div>
                      )}
                    </div>

                    <div className="game-translation-card-content">
                      <h2 className="game-translation-card-team">
                        {translation.team}
                      </h2>

                      <div className="game-translation-card-meta">
                        <span className={status.className}>{status.label}</span>
                        {translation.version && (
                          <span className="game-translation-card-version">
                            v{translation.version}
                          </span>
                        )}
                      </div>

                      <div className="game-translation-card-progress">
                        <div className="game-progress-header">
                          <span>Прогрес</span>
                          <span>{translation.translation_progress}%</span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${translation.translation_progress}%`,
                            }}
                          />
                        </div>
                      </div>

                      <p className="game-translation-card-updated">
                        Оновлено:{" "}
                        {new Date(translation.updated_at).toLocaleDateString(
                          "uk-UA"
                        )}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbLD([
              { name: "Головна", url: "https://lblauncher.com" },
              { name: "Ігри", url: "https://lblauncher.com/games" },
              { name: game.name, url: `https://lblauncher.com/games/${slug}` },
            ])
          ),
        }}
      />
    </article>
  );
}
