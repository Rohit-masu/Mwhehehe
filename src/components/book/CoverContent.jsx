import "./DiaryBook.css";

export default function CoverContent({
  isBackCover = false,
  onOpen,
}) {
  if (isBackCover) {
    return (
      <div className="cover-content cover-content--back">
        <span className="cover-content__back-text">
          close gently
        </span>

        <span className="cover-content__back-symbol">
          ❦
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="cover-content"
      onClick={onOpen}
      aria-label="Open Shraddha's diary"
    >
      <span className="cover-content__eyebrow">
        Private &amp; Personal
      </span>

      <h1 className="cover-content__title">
        Shraddha's Diary
      </h1>

      <span className="cover-content__ornament">
        ❦
      </span>

      <p className="cover-content__subtitle">
        a keepsake of memories
      </p>

      <span className="cover-content__hint">
        tap gently to open ♡
      </span>
    </button>
  );
}