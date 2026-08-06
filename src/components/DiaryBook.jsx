import React, { useRef, useState, useEffect, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import Page from "./Page";
import MuhavaraDiaryGame from "./games/MuhavaraDiaryGame";
import BollywoodSongs from "./games/BollywoodSongs";
import CardMatch from "./games/CardMatch";
import JigsawPuzzle from "./games/JigsawPuzzle";

const serifDisplay = { fontFamily: "'Playfair Display', serif" };
const serifBody = { fontFamily: "'EB Garamond', serif" };

// Breakpoint below which the diary shows a single page per flip.
// Above it, the diary shows a two-page spread.
const MOBILE_BREAKPOINT = 768;

const DiaryBook = () => {
  const bookRef = useRef(null);

  // Simple state: which chapter-games are complete, and which fragment
  // word each one unlocked. No context, no redux — just local state.
  const [completedGames, setCompletedGames] = useState({});
  const [unlockedFragments, setUnlockedFragments] = useState({});

  // Fixed-size dimensions per breakpoint. We deliberately use size="fixed"
  // instead of "stretch" so the book doesn't continuously resize/jump as
  // the window drags across the breakpoint — it snaps between two known
  // sizes instead, wrapped in a centering container.
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const bookWidth = isMobile ? 300 : 380;
  const bookHeight = isMobile ? 460 : 540;

  const goPrev = () => bookRef.current?.pageFlip()?.flipPrev();

  // Called by a chapter's game when it finishes. The game itself already
  // shows its own wax-stamp / fragment reveal before calling onWin, so by
  // the time this fires we just record the fragment and turn the page.
  const handleGameWin = useCallback((pageNumber, fragment) => {
    setUnlockedFragments((prev) => ({ ...prev, [pageNumber]: fragment }));
    setCompletedGames((prev) => ({ ...prev, [pageNumber]: true }));
    bookRef.current?.pageFlip()?.flipNext();
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <HTMLFlipBook
        ref={bookRef}
        width={bookWidth}
        height={bookHeight}
        size="fixed"
        minWidth={280}
        maxWidth={520}
        minHeight={400}
        maxHeight={720}
        showCover={true}
        mobileScrollSupport={true}
        usePortrait={isMobile}
        maxShadowOpacity={0.6}
        className="diary-flipbook"
      >
        {/* Page 0 — Hard Front Cover */}
        <Page isHardCover>
          <div className="text-center text-[#e8d4a4]">
            <p className="text-xs tracking-[0.35em] uppercase mb-3 text-[#c9a86a]">
              Private &amp; Personal
            </p>
            <h1 className="text-4xl mb-2" style={serifDisplay}>
              Shraddha's Diary
            </h1>
            <p className="text-sm italic text-[#c9a86a] mt-4">
              a keepsake of memories
            </p>
          </div>
        </Page>

        {/* Page 1 — Welcome */}
        <Page number={1}>
          <h2 className="text-2xl text-[#4a3420] mb-4" style={serifDisplay}>
            Welcome
          </h2>
          <p className="text-[#3b2f2a] leading-7" style={serifBody}>
            Dear Shraddha, turn the pages gently — this diary holds a little
            world made just for you.
          </p>
        </Page>

        {/* Page 2 — Table of Contents */}
        <Page number={2}>
          <h2 className="text-2xl text-[#4a3420] mb-4" style={serifDisplay}>
            Table of Contents
          </h2>
          <ul className="text-[#3b2f2a] space-y-2" style={serifBody}>
            <li>Chapter I .......................... 3</li>
            <li>Chapter II ......................... 4</li>
            <li>Chapter III ........................ 5</li>
            <li>Chapter IV ......................... 6</li>
            <li>The Locked Chamber ................. 7</li>
            <li>A Little Envelope .................. 8</li>
          </ul>
        </Page>

        {/* Page 3 — Chapter I: Emoji Muhavre Game (reward: "I") */}
        <Page number={3}>
          <MuhavaraDiaryGame
            onWin={(fragment) => handleGameWin(3, fragment)}
            onBack={goPrev}
          />
        </Page>

        {/* Page 4 — Chapter II: Bollywood Songs (reward: "HATE") */}
        <Page number={4}>
          <BollywoodSongs
            onWin={(fragment) => handleGameWin(4, fragment)}
            onBack={goPrev}
          />
        </Page>

        {/* Page 5 — Chapter III: TMKOC Memory Match (reward: "DAAL") */}
        <Page number={5}>
          <CardMatch
            onWin={(fragment) => handleGameWin(5, fragment)}
            onBack={goPrev}
          />
        </Page>

        {/* Page 6 — Chapter IV: Best of Luck Nikki Puzzle (reward: "CHAWAL") */}
        <Page number={6}>
          <JigsawPuzzle
            onWin={(fragment) => handleGameWin(6, fragment)}
            onBack={goPrev}
          />
        </Page>

        {/* Page 7 — Passkey Chamber placeholder */}
        <Page number={7}>
          <h2 className="text-2xl text-[#4a3420]" style={serifDisplay}>
            The Locked Chamber
          </h2>
          <p className="text-[#3b2f2a]/60 italic mt-4" style={serifBody}>
            placeholder — passkey chamber
          </p>
        </Page>

        {/* Page 8 — Envelope placeholder */}
        <Page number={8}>
          <h2 className="text-2xl text-[#4a3420]" style={serifDisplay}>
            A Little Envelope
          </h2>
          <p className="text-[#3b2f2a]/60 italic mt-4" style={serifBody}>
            placeholder — envelope
          </p>
        </Page>

        {/* Page 9 — Hard Back Cover */}
        <Page isHardCover>
          <div className="text-center text-[#c9a86a]">
            <p className="text-xs tracking-[0.3em] uppercase">close gently</p>
          </div>
        </Page>
      </HTMLFlipBook>
    </div>
  );
};

export default DiaryBook;