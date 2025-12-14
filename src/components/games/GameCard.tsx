"use client";

import Link from "next/link";
import Image from "next/image";
import type { GameListItem } from "@/lib/types";
import { getImageUrl } from "@/lib/images";

interface GameCardProps {
  game: GameListItem;
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  completed: { label: "Готово", className: "game-card-status completed" },
  "in-progress": {
    label: "В розробці",
    className: "game-card-status in-progress",
  },
  planned: { label: "Заплановано", className: "game-card-status planned" },
};

export function GameCard({ game }: GameCardProps) {
  const status = STATUS_LABELS[game.status] || STATUS_LABELS.planned;
  const imageUrl =
    getImageUrl(game.banner_path) || getImageUrl(game.thumbnail_path);

  return (
    <Link href={`/games/${game.slug}`} className="game-card">
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

      <div className="game-card-content">
        <h3 className="game-card-title">{game.name}</h3>
        <p className="game-card-team">{game.team}</p>

        <div className="game-card-footer">
          <span className={status.className}>{status.label}</span>

          {game.status !== "planned" && game.translation_progress > 0 && (
            <div className="game-card-progress">
              <div className="game-card-progress-text">
                {game.translation_progress}%
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${game.translation_progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
