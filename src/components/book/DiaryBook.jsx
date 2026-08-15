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
import InsideCoverPage from "./pages/InsideCoverPage";
import WelcomePage from "./pages/WelcomePage";
import MuhavaraDiaryGame from "../games/MuhavaraDiaryGame";
import BollywoodSongs from "../games/BollywoodSongs";
import CardMatch from "../games/CardMatch";
import JigsawPuzzle from "../games/JigsawPuzzle";

import "./DiaryBook.css";

const MOBILE_BREAKPOINT = 768;

export default function DiaryBook({
  onOpenChange,
  onEnvelopeOpen,
  isEnvelopeFocusOpen = false,
}) {
  const bookRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(0);

  const [isBookLocked, setIsBookLocked] = useState(false);

  const [, setUnlockedClues] = useState({});

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

  const bookWidth = isMobile ? 260 : 300;
  const bookHeight = isMobile ? 400 : 450;

  const openBook = () => {
    bookRef.current?.pageFlip()?.flipNext();
  };

  const saveClue = useCallback((key, clue) => {
    setUnlockedClues((previousClues) => {
      if (previousClues[key] === clue) {
        return previousClues;
      }

      return {
        ...previousClues,
        [key]: clue,
      };
    });
  }, []);

  const isPhysicalPageVisible = useCallback(
    (pageIndex) => {
      if (isMobile) {
        return currentPage === pageIndex;
      }

      return currentPage === pageIndex || currentPage === pageIndex - 1;
    },
    [currentPage, isMobile]
  );

  const handleFlip = useCallback(
    (event) => {
      const nextPage = event.data;

      setCurrentPage(nextPage);
      onOpenChange?.(nextPage > 0);
    },
    [onOpenChange]
  );

  /*
   * Creates one content spread
   *
   * DESKTOP:
   * [ blank left ][ real content right ]
   *
   * MOBILE:
   * [ real content only ]
   */
  const createContentPage = ({
    key,
    number,
    content,
    includeBlank = true,
  }) => {
    const result = [];

    if (!isMobile && includeBlank) {
      result.push(
        <Page
          key={`${key}-blank`}
          side="left"
          className="diary-page--blank"
        />
      );
    }

    result.push(
      <Page
        key={key}
        number={number}
        side="right"
      >
        {content}
      </Page>
    );

    return result;
  };

  const gamePageIndexes = isMobile
    ? {
        muhavara: 2,
        bollywood: 3,
        cardMatch: 4,
        jigsaw: 5,
      }
    : {
        muhavara: 4,
        bollywood: 6,
        cardMatch: 8,
        jigsaw: 10,
      };

  const pages = [
    /* =========================
       FRONT COVER
       ========================= */
    <Page
      key="front-cover"
      isHardCover
    >
      <CoverContent onOpen={openBook} />
    </Page>,

    /* =========================
       DESKTOP INSIDE FRONT COVER
       LEFT SIDE = BROWN
       ========================= */
    !isMobile && (
      <Page
        key="inside-front-cover"
        isInsideCover
      >
        <InsideCoverPage />
      </Page>
    ),

    /* =========================
       PAGE 1 — WELCOME
       RIGHT SIDE
       ========================= */
    <Page
      key="welcome"
      number={1}
      side="right"
    >
      <WelcomePage />
    </Page>,

    /* =========================
       FUTURE CONTENT PAGES
       ========================= */
    ...createContentPage({
      key: "muhavara",
      number: 2,
      content: (
        <MuhavaraDiaryGame
          isActive={isPhysicalPageVisible(gamePageIndexes.muhavara)}
          onLockChange={setIsBookLocked}
          onComplete={(clue) => saveClue("muhavara", clue)}
        />
      ),
    }),

    ...createContentPage({
      key: "bollywood",
      number: 3,
      content: (
        <BollywoodSongs
          isActive={isPhysicalPageVisible(gamePageIndexes.bollywood)}
          onLockChange={setIsBookLocked}
          onComplete={(clue) => saveClue("bollywood", clue)}
        />
      ),
    }),

    ...createContentPage({
      key: "tmkoc",
      number: 4,
      content: (
        <CardMatch
          isActive={isPhysicalPageVisible(gamePageIndexes.cardMatch)}
          onLockChange={setIsBookLocked}
          onComplete={(clue) => saveClue("cardMatch", clue)}
        />
      ),
    }),

    ...createContentPage({
      key: "nikki",
      number: 5,
      content: (
        <JigsawPuzzle
          isActive={isPhysicalPageVisible(gamePageIndexes.jigsaw)}
          onLockChange={setIsBookLocked}
          onComplete={(clue) => saveClue("jigsaw", clue)}
        />
      ),
    }),

    /* =========================
       FINAL WHITE PAPER
       LEFT SIDE
       ========================= */
    !isMobile && (
      <Page
        key="final-paper"
        side="left"
        className="diary-page--blank"
      />
    ),

    /* =========================
       INSIDE BACK COVER
       RIGHT SIDE = BROWN
       ========================= */
    <Page
      key="inside-back-cover"
      isInsideCover
    >
      <InsideCoverPage
        showEnvelope={!isEnvelopeFocusOpen}
        onEnvelopeOpen={onEnvelopeOpen}
      />
    </Page>,

    /* =========================
       BACK COVER
       ========================= */
    <Page
      key="back-cover"
      isHardCover
      isBackCover
    >
      <CoverContent isBackCover />
    </Page>,
  ].filter(Boolean);

  return (
    <BookStage>
      <HTMLFlipBook
        key={isMobile ? "diary-mobile" : "diary-desktop"}
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
        disableFlipByClick={true}
        useMouseEvents={!isBookLocked}

        swipeDistance={99999}
        showPageCorners={!isBookLocked}

        mobileScrollSupport={false}

        onFlip={handleFlip}

        className="diary-flipbook"
      >
        {pages}
      </HTMLFlipBook>
    </BookStage>
  );
}
