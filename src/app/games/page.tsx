import type { Metadata } from "next";
import { Suspense } from "react";
import { GamesList } from "@/components/games/GamesList";

export const metadata: Metadata = {
  title: "Каталог ігор з українською локалізацією",
  description:
    "Повний список ігор з українським перекладом. Знайдіть українізатор для вашої улюбленої гри. Грайте українською — понад 80+ локалізацій.",
  keywords: [
    "каталог українських ігор",
    "список ігор українською",
    "українізатор ігор список",
    "ігри з українською локалізацією",
    "українські переклади ігор каталог",
  ],
  openGraph: {
    title: "Каталог ігор з українською локалізацією | LB Launcher",
    description:
      "Повний список ігор з українським перекладом. Знайдіть українізатор для вашої улюбленої гри.",
  },
};

export default function GamesPage() {
  return (
    <section className="games-page">
      <div className="container">
        <div className="games-header">
          <h1>Каталог ігор</h1>
          <p>
            Усі ігри з українським перекладом в одному місці. Знайдіть свою
            улюблену гру та грайте українською.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="loading-spinner">
              <div className="spinner" />
            </div>
          }
        >
          <GamesList />
        </Suspense>
      </div>
    </section>
  );
}
