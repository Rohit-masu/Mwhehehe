import "./WelcomePage.css";

const memoryChapters = [
  {
    number: "I",
    page: "02",
    title: "Kuch baatein ishaaron mein",
    note: "old sayings, familiar clues",
  },
  {
    number: "II",
    page: "03",
    title: "Bollywood rewind",
    note: "songs that somehow stayed",
  },
  {
    number: "III",
    page: "04",
    title: "Gokuldham memories",
    note: "faces you probably still know",
  },
  {
    number: "IV",
    page: "05",
    title: "Put it back together",
    note: "one picture, a few pieces",
  },
];

export default function WelcomePage() {
  return (
    <section className="welcome-page">
      <div className="welcome-page__stamp" aria-hidden="true">
        SHRADDHA / ARCHIVE
      </div>

      <header className="welcome-page__header">
        <p className="welcome-page__eyebrow">private &amp; personal</p>
        <h1 className="welcome-page__name">Shraddha&apos;s archive</h1>

        <div className="welcome-page__ornament" aria-hidden="true">
          <span />
          <b>✦</b>
          <span />
        </div>
      </header>

      <section className="welcome-page__index" aria-label="Memory chapters">
        <div className="welcome-page__index-title">
          <span />
          <h2>Memory index</h2>
          <span />
        </div>

        <div className="welcome-page__chapter-list">
          {memoryChapters.map((chapter) => (
            <div className="welcome-page__chapter" key={chapter.number}>
              <span className="welcome-page__chapter-number">
                {chapter.number}
              </span>
              <div className="welcome-page__chapter-copy">
                <strong>{chapter.title}</strong>
                <em>{chapter.note}</em>
              </div>
              <span className="welcome-page__chapter-page">
                {chapter.page}
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer className="welcome-page__footer">
        <p>contents</p>
        <span className="welcome-page__tiny-flower" aria-hidden="true">
          ❈
        </span>
        <p>01 / 05</p>
      </footer>
    </section>
  );
}
