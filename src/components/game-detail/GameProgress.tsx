interface GameProgressProps {
  translationProgress: number;
  editingProgress: number;
  voiceProgress?: number | null;
  fontsProgress?: number | null;
  texturesProgress?: number | null;
}

export function GameProgress({
  translationProgress,
  editingProgress,
  voiceProgress,
  fontsProgress,
  texturesProgress,
}: GameProgressProps) {
  return (
    <section className="game-section">
      <h2>Прогрес перекладу</h2>
      <div className="game-progress-list">
        <div className="game-progress-item">
          <div className="game-progress-header">
            <span>Переклад тексту</span>
            <span>{translationProgress}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${translationProgress}%` }}
            />
          </div>
        </div>

        {editingProgress != null && (
          <div className="game-progress-item">
            <div className="game-progress-header">
              <span>Редактура</span>
              <span>{editingProgress}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${editingProgress}%` }}
              />
            </div>
          </div>
        )}

        {voiceProgress != null && (
          <div className="game-progress-item">
            <div className="game-progress-header">
              <span>Озвучення</span>
              <span>{voiceProgress}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${voiceProgress}%` }}
              />
            </div>
          </div>
        )}

        {fontsProgress != null && (
          <div className="game-progress-item">
            <div className="game-progress-header">
              <span>Шрифти</span>
              <span>{fontsProgress}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${fontsProgress}%` }}
              />
            </div>
          </div>
        )}

        {texturesProgress != null && (
          <div className="game-progress-item">
            <div className="game-progress-header">
              <span>Текстури</span>
              <span>{texturesProgress}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${texturesProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
