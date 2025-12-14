const CARDS = [
  {
    icon: "fa-solid fa-rocket",
    title: "Додайте свою гру",
    description:
      "Український переклад вашої гри стане доступний тисячам користувачів.",
    link: "https://t.me/lb_launcher_bot",
    linkText: "Написати нам",
    linkIcon: "fa-brands fa-telegram",
    isGithub: false,
  },
  {
    icon: "fa-brands fa-github",
    title: "Відкритий код",
    description:
      "Увесь код лаунчера доступний на GitHub — перевіряйте й долучайтеся.",
    link: "https://github.com/Vadko/littlebit-launcher",
    linkText: "Переглянути код",
    linkIcon: "fa-brands fa-github",
    isGithub: true,
  },
  {
    icon: "fa-solid fa-users",
    title: "Спільнота",
    description:
      "Приєднуйтеся до нашого Telegram-каналу — для новин і спілкування.",
    link: "https://t.me/LittleBitUA",
    linkText: "Приєднатися",
    linkIcon: "fa-brands fa-telegram",
    isGithub: false,
  },
];

export function CollaborationSection() {
  return (
    <section id="collaboration" className="collaboration-sec">
      <div className="container">
        <h2 className="section-title center">Приєднуйтесь до спільноти</h2>

        <div className="collab-grid">
          {CARDS.map((card, index) => (
            <div key={index} className="collab-card">
              <div className="collab-icon">
                <i className={card.icon} />
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <a
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`collab-btn ${card.isGithub ? "github" : ""}`}
              >
                <i className={card.linkIcon} />
                {card.linkText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
