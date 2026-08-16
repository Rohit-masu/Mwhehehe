import {
  lazy,
  Suspense,
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

import "./DiaryBook.css";

const MOBILE_BREAKPOINT = 768;
const MOBILE_GAME_PAGE_INDEXES = {
  muhavara: 2,
  bollywood: 3,
  cardMatch: 4,
  jigsaw: 5,
};
const DESKTOP_GAME_PAGE_INDEXES = {
  muhavara: 4,
  bollywood: 6,
  cardMatch: 8,
  jigsaw: 10,
};

const MuhavaraDiaryGame = lazy(
  () => import("../games/MuhavaraDiaryGame")
);
const BollywoodSongs = lazy(
  () => import("../games/BollywoodSongs")
);
const CardMatch = lazy(() => import("../games/CardMatch"));
const JigsawPuzzle = lazy(() => import("../games/JigsawPuzzle"));

function GameLoadingPage() {
  return (
    <div
      className="diary-game-loading"
      role="status"
      aria-live="polite"
      aria-label="Loading the next memory"
    >
      <div className="diary-game-loading__mark" aria-hidden="true">
        <svg
          className="diary-game-loading__divider"
          viewBox="0 0 148 24"
          focusable="false"
        >
          <path d="M2 12h52c8 0 10-7 20-7s12 7 20 7h52" />
          <path d="M2 12h52c8 0 10 7 20 7s12-7 20-7h52" />
          <circle cx="74" cy="12" r="3" />
        </svg>

        <span className="cover-content__ornament diary-game-loading__ornament">
          ❦
        </span>

        <p className="cover-content__subtitle diary-game-loading__subtitle">
          a keepsake of memories
        </p>
      </div>
    </div>
  );
}

export default function DiaryBook({
  onOpenChange,
  onEnvelopeOpen,
  isEnvelopeFocusOpen = false,
}) {
  const bookRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(0);

  const [isBookLocked, setIsBookLocked] = useState(false);
  const [activatedGames, setActivatedGames] = useState(() => new Set());

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

  const bookWidth = isMobile ? 250 : 300;
  const bookHeight = isMobile ? 385 : 450;

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
    ? MOBILE_GAME_PAGE_INDEXES
    : DESKTOP_GAME_PAGE_INDEXES;

  useEffect(() => {
    // Start loading only the next game while the reader is on the page before it.
    const preloadDistance = isMobile ? 1 : 2;

    setActivatedGames((previousGames) => {
      const nextGames = new Set(previousGames);

      Object.entries(gamePageIndexes).forEach(([game, pageIndex]) => {
        if (currentPage >= pageIndex - preloadDistance) {
          nextGames.add(game);
        }
      });

      return nextGames.size === previousGames.size
        ? previousGames
        : nextGames;
    });
  }, [currentPage, gamePageIndexes, isMobile]);

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
      content: activatedGames.has("muhavara") ? (
        <Suspense fallback={<GameLoadingPage />}>
          <MuhavaraDiaryGame
            isActive={isPhysicalPageVisible(gamePageIndexes.muhavara)}
            onLockChange={setIsBookLocked}
            onComplete={(clue) => saveClue("muhavara", clue)}
          />
        </Suspense>
      ) : null,
    }),

    ...createContentPage({
      key: "bollywood",
      number: 3,
      content: activatedGames.has("bollywood") ? (
        <Suspense fallback={<GameLoadingPage />}>
          <BollywoodSongs
            isActive={isPhysicalPageVisible(gamePageIndexes.bollywood)}
            onLockChange={setIsBookLocked}
            onComplete={(clue) => saveClue("bollywood", clue)}
          />
        </Suspense>
      ) : null,
    }),

    ...createContentPage({
      key: "tmkoc",
      number: 4,
      content: activatedGames.has("cardMatch") ? (
        <Suspense fallback={<GameLoadingPage />}>
          <CardMatch
            isActive={isPhysicalPageVisible(gamePageIndexes.cardMatch)}
            onLockChange={setIsBookLocked}
            onComplete={(clue) => saveClue("cardMatch", clue)}
          />
        </Suspense>
      ) : null,
    }),

    ...createContentPage({
      key: "nikki",
      number: 5,
      content: activatedGames.has("jigsaw") ? (
        <Suspense fallback={<GameLoadingPage />}>
          <JigsawPuzzle
            isActive={isPhysicalPageVisible(gamePageIndexes.jigsaw)}
            onLockChange={setIsBookLocked}
            onComplete={(clue) => saveClue("jigsaw", clue)}
          />
        </Suspense>
      ) : null,
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
