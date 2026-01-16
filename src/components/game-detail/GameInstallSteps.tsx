interface GameInstallStepsProps {
  gameName: string;
}

export function GameInstallSteps({ gameName }: GameInstallStepsProps) {
  return (
    <section className="game-section">
      <h2>Як встановити український переклад {gameName}</h2>
      <ol className="game-install-steps">
        <li>
          <strong>Завантажте LB Launcher</strong> — безкоштовну програму для
          встановлення українських перекладів ігор
        </li>
        <li>
          <strong>Знайдіть {gameName}</strong> у каталозі ігор лаунчера
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
  );
}
