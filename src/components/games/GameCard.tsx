"use client";

import Link from "next/link";
import Image from "next/image";
import type { GameGroup, TranslationItem } from "@/lib/types";
import { getImageUrl } from "@/lib/images";
import { teamToSlug } from "@/lib/transliterate";
import { AuthorName } from "@/components/ui/AuthorName";

interface GameCardProps {
  game: GameGroup;
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  completed: { label: "Готово", className: "game-card-status completed" },
  "in-progress": {
    label: "В розробці",
    className: "game-card-status in-progress",
  },
  planned: { label: "Заплановано", className: "game-card-status planned" },
};

function TranslationRow({
  translation,
  slug,
}: {
  translation: TranslationItem;
  slug: string;
}) {
  const status = STATUS_LABELS[translation.status] || STATUS_LABELS.planned;
  const progress = translation.translation_progress ?? 0;

  return (
    <Link
      href={`/games/${slug}/${teamToSlug(translation.team)}`}
      className="game-card-translation"
    >
      <span className="game-card-translation-team">
        <AuthorName team={translation.team} />
      </span>
      <div className="game-card-translation-info">
        <span className={`game-card-translation-status ${status.className}`}>
          {status.label}
        </span>
        {translation.status !== "planned" && progress > 0 && (
          <div className="game-card-translation-progress">
            <div className="progress-bar progress-bar-small">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="game-card-translation-percent">{progress}%</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export function GameCard({ game }: GameCardProps) {
  const imageUrl =
    getImageUrl(game.banner_path, game.updated_at) ||
    getImageUrl(game.thumbnail_path, game.updated_at);

  // For single translation, link directly to the translation page
  const cardHref =
    game.translations.length === 1
      ? `/games/${game.slug}/${teamToSlug(game.translations[0].team)}`
      : `/games/${game.slug}`;

  return (
    <div className="game-card">
      <Link href={cardHref} className="game-card-image-link">
        <div className="game-card-image">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${game.name} — український переклад гри`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="game-card-placeholder">
              <i className="fa-solid fa-gamepad" />
            </div>
          )}
        </div>
      </Link>

      <div className="game-card-content">
        <Link href={cardHref}>
          <h3 className="game-card-title">{game.name}</h3>
        </Link>

        <div className="game-card-translations">
          {game.translations.map((translation) => (
            <TranslationRow
              key={translation.id}
              translation={translation}
              slug={game.slug}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
