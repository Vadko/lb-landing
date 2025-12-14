import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Сторінку не знайдено</h1>
        <p className="not-found-text">
          Схоже, ця сторінка не існує або була переміщена.
        </p>
        <div className="not-found-buttons">
          <Link href="/" className="btn-primary">
            <i className="fa-solid fa-home" />
            На головну
          </Link>
          <Link href="/games" className="btn-secondary">
            <i className="fa-solid fa-gamepad" />
            Каталог ігор
          </Link>
        </div>
      </div>
    </section>
  );
}
