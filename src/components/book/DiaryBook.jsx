import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import HTMLFlipBook from "react-pageflip";

import BookStage from "./BookStage";
import Page from "./Page";
import CoverContent from "./CoverContent";

import "./DiaryBook.css";

const MOBILE_BREAKPOINT = 768;

export default function DiaryBook() {
  const bookRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(0);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined"
      ? window.innerWidth < MOBILE_BREAKPOINT
      : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /*
    Closed:
    one 300px page.

    Open desktop:
    ~600px spread.

    This leaves significantly more room for cake.
  */
  const bookWidth = isMobile ? 260 : 300;
  const bookHeight = isMobile ? 400 : 450;

  const isOpen = currentPage > 0;

  const openBook = () => {
    bookRef.current?.pageFlip()?.flipNext();
  };

  const handleFlip = useCallback((event) => {
    setCurrentPage(event.data);
  }, []);

  return (
    <BookStage
      isOpen={isOpen}
      isMobile={isMobile}
    >
      <HTMLFlipBook
        ref={bookRef}

        width={bookWidth}
        height={bookHeight}

        size="fixed"

        showCover={true}
        usePortrait={isMobile}

        drawShadow={true}
        maxShadowOpacity={0.5}
        flippingTime={900}

        clickEventForward={true}
        useMouseEvents={true}
        swipeDistance={25}
        showPageCorners={true}

        mobileScrollSupport={false}

        onFlip={handleFlip}

        className="diary-flipbook"
      >
        {/* FRONT COVER */}
        <Page isHardCover>
          <CoverContent onOpen={openBook} />
        </Page>

        {/* PAGE 1 */}
        <Page number={1}>
          <div className="demo-page">
            <h2>Welcome</h2>

            <p>
              Dear Shraddha, turn the pages gently —
              this diary holds a little world made
              just for you.
            </p>
          </div>
        </Page>

        {/* PAGE 2 */}
        <Page number={2}>
          <div className="demo-page">
            <h2>Table of Contents</h2>

            <p>Chapter I — Emoji Muhavare</p>
            <p>Chapter II — Old Bollywood</p>
            <p>Chapter III — TMKOC</p>
            <p>Chapter IV — Best of Luck Nikki</p>
          </div>
        </Page>

        {/* BACK COVER */}
        <Page
          isHardCover
          isBackCover
        >
          <CoverContent isBackCover />
        </Page>
      </HTMLFlipBook>
    </BookStage>
  );
}