import type { Game } from "@/lib/types";

interface GameFAQProps {
  game: Game;
}

export function GameFAQ({ game }: GameFAQProps) {
  return (
    <section className="game-section game-faq">
      <h2>Часті питання про переклад {game.name}</h2>
      <div className="faq-list">
        <details className="faq-item">
          <summary>Чи безкоштовний український переклад {game.name}?</summary>
          <p>
            Так, переклад {game.name} від команди {game.team} повністю
            безкоштовний. Завантажте LB Launcher та встановіть українську
            локалізацію за кілька клаців.
          </p>
        </details>
        <details className="faq-item">
          <summary>
            Чи потрібна ліцензійна гра для встановлення перекладу?
          </summary>
          <p>
            Так, для коректної роботи перекладу потрібна оригінальна гра{" "}
            {game.name}. Переклад працює з версіями з{" "}
            {game.platforms?.join(", ") || "Steam, GOG, Epic Games"}.
          </p>
        </details>
        <details className="faq-item">
          <summary>Як оновити переклад до нової версії?</summary>
          <p>
            LB Launcher автоматично перевіряє оновлення. Коли вийде нова версія
            перекладу, ви отримаєте сповіщення та зможете оновити в один клац.
          </p>
        </details>
        {game.voice_progress && game.voice_progress > 0 && (
          <details className="faq-item">
            <summary>Чи є українська озвучка для {game.name}?</summary>
            <p>
              Так! Команда {game.team} працює над українською озвучкою. Наразі
              озвучено {game.voice_progress}% гри.
            </p>
          </details>
        )}
      </div>
    </section>
  );
}
