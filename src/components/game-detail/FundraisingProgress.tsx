interface FundraisingProgressProps {
  current: number | null;
  goal: number | null;
}

export function FundraisingProgress({
  current,
  goal,
}: FundraisingProgressProps) {
  // Don't render if no fundraising goal is set
  if (!goal || goal <= 0) {
    return null;
  }

  const currentAmount = current ?? 0;
  const percentage = Math.min(Math.round((currentAmount / goal) * 100), 100);
  const isCompleted = currentAmount >= goal;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("uk-UA").format(amount);
  };

  return (
    <section className="game-section game-fundraising">
      <h2>
        <i className="fa-solid fa-hand-holding-heart" /> Збір коштів
      </h2>
      <div className="fundraising-content">
        <div className="fundraising-header">
          <span className="fundraising-amounts">
            <span className="fundraising-current">{formatAmount(currentAmount)} ₴</span>
            <span className="fundraising-separator"> / </span>
            <span className="fundraising-goal">{formatAmount(goal)} ₴</span>
          </span>
          <span className={`fundraising-percentage ${isCompleted ? "completed" : ""}`}>
            {percentage}%
          </span>
        </div>
        <div className="progress-bar fundraising-bar">
          <div
            className={`progress-bar-fill ${isCompleted ? "fundraising-completed" : "fundraising-active"}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {isCompleted && (
          <p className="fundraising-message success">
            <i className="fa-solid fa-check-circle" /> Збір завершено! Дякуємо всім, хто підтримав!
          </p>
        )}
      </div>
    </section>
  );
}
