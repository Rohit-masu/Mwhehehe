import React, { forwardRef } from "react";

import leatherTexture from "../../assets/images/leather-texture.webp";
import paperTexture from "../../assets/images/diary_paper.webp";

import "./DiaryBook.css";

const Page = forwardRef(
  (
    {
      children,
      number,
      isHardCover = false,
      isBackCover = false,
      isInsideCover = false,
      side = null,
      className = "",
    },
    ref
  ) => {
    /* =========================
       HARD COVER
       ========================= */
    if (isHardCover) {
      return (
        <div
          ref={ref}
          className={[
            "diary-page",
            "diary-page--hard",
            isBackCover ? "diary-page--back-cover" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          data-density="hard"
        >
          <div
            className="diary-cover-leather"
            style={{
              backgroundImage: `url(${leatherTexture})`,
            }}
          />

          <div className="diary-cover-light" />
          <div className="diary-cover-vignette" />

          <div className="diary-cover-frame diary-cover-frame--outer" />
          <div className="diary-cover-frame diary-cover-frame--inner" />

          <div className="diary-page__content">{children}</div>
        </div>
      );
    }

    /* =========================
       INSIDE COVER (endpaper)
       ========================= */
    if (isInsideCover) {
      return (
        <div
          ref={ref}
          className={[
            "diary-page",
            "diary-page--inside-cover",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          data-density="soft"
        >
          <div className="diary-page__content">{children}</div>
        </div>
      );
    }

    /* =========================
       PAPER PAGE
       ========================= */
    return (
      <div
        ref={ref}
        className={[
          "diary-page",
          "diary-page--paper",
          side === "left" ? "diary-page--left" : "",
          side === "right" ? "diary-page--right" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        data-density="soft"
      >
        <div
          className="diary-paper-texture"
          style={{
            backgroundImage: `url(${paperTexture})`,
          }}
        />

        <div className="diary-paper-warmth" />
        <div className="diary-paper-noise" />
        <div className="diary-paper-lines" />

        <div className="diary-page__content diary-page__content--paper">
          {children}
        </div>

        {number != null && (
          <span className="diary-page__number">{number}</span>
        )}
      </div>
    );
  }
);

Page.displayName = "Page";

export default Page;