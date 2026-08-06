import React, { forwardRef } from "react";
import leatherTexture from "../../assets/images/leather-texture.webp";
import "./DiaryBook.css";

const Page = forwardRef(
  (
    {
      children,
      number,
      isHardCover = false,
      isBackCover = false,
    },
    ref
  ) => {
    if (isHardCover) {
      return (
        <div
          ref={ref}
          className={[
            "diary-page",
            "diary-page--hard",
            isBackCover ? "diary-page--back-cover" : "",
          ].join(" ")}
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

          <div className="diary-page__content">
            {children}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className="diary-page diary-page--paper"
        data-density="soft"
      >
        <div className="diary-paper-noise" />
        <div className="diary-paper-lines" />

        <div className="diary-page__content diary-page__content--paper">
          {children}
        </div>

        {number && (
          <span className="diary-page__number">
            {number}
          </span>
        )}
      </div>
    );
  }
);

Page.displayName = "Page";

export default Page;