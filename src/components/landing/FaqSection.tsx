"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    question: "Як це працює?",
    answer:
      "Усе дуже просто: завантажте лаунчер — він автоматично знайде встановлені ігри на вашому комп'ютері. Оберіть потрібну гру й натисніть «Встановити переклад». Готово!",
  },
  {
    question: "Чи безпечно використовувати LB Launcher?",
    answer:
      "Так, це безпечно. Код лаунчера повністю відкритий на GitHub, тож кожен може перевірити його. До того ж перед встановленням перекладу лаунчер автоматично створює резервну копію оригінальних файлів.",
  },
  {
    question: "Як видалити переклад і повернути оригінал?",
    answer:
      "Оберіть гру в лаунчері й натисніть кнопку «Видалити переклад». Лаунчер автоматично відновить оригінальні файли з резервної копії.",
  },
  {
    question: "Які ігри підтримуються?",
    answer:
      "Наразі підтримується понад 80 ігор, і цей список постійно поповнюється. Серед них — популярні AAA-тайтли, інді-ігри та класика. Повний перелік доступний у самому лаунчері.",
  },
  {
    question: "Лаунчер безкоштовний?",
    answer:
      "Так, LB Launcher повністю безкоштовний — і таким залишиться назавжди. Ми робимо це для української спільноти ґеймерів.",
  },
  {
    question: "Як додати свій переклад до лаунчера?",
    answer:
      "Напишіть нам у Telegram через бота @lb_launcher_bot. Обговоримо деталі й допоможемо інтегрувати ваш переклад — швидко та просто!",
  },
  {
    question: "На чому зроблений лаунчер?",
    answer: "tech-stack",
  },
];

const TECH_STACK = [
  {
    name: "Electron 39 + Vite",
    desc: "настільний фреймворк та швидке збирання",
  },
  { name: "React 18 + TypeScript", desc: "інтерфейс користувача" },
  { name: "Tailwind CSS", desc: "стилі та дизайн" },
  { name: "Framer Motion", desc: "плавні анімації інтерфейсу" },
  { name: "Zustand", desc: "керування станом застосунку" },
  {
    name: "better-sqlite3",
    desc: "локальна база даних для швидкої роботи офлайн",
  },
  { name: "Supabase", desc: "синхронізація даних та realtime оновлення" },
  { name: "electron-builder", desc: "білд та автооновлення" },
  { name: "Lucide React", desc: "іконки" },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-sec">
      <div className="container">
        <h2 className="section-title center">Часті питання</h2>

        <div className="faq-list">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "active" : ""}`}
            >
              <button className="faq-question" onClick={() => toggle(index)}>
                <span>{item.question}</span>
                <i className="fa-solid fa-chevron-down" />
              </button>

              <div className="faq-answer">
                {item.answer === "tech-stack" ? (
                  <ul className="tech-stack">
                    {TECH_STACK.map((tech, i) => (
                      <li key={i}>
                        <strong>{tech.name}</strong> — {tech.desc}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{item.answer}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
