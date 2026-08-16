import { lazy, Suspense, useState } from "react";
import { AnimatePresence } from "framer-motion";

import DiaryBook from "./components/book/DiaryBook";
import DeskScene from "./components/scene/DeskScene";

const EnvelopeFocus = lazy(
  () => import("./components/scene/EnvelopeFocus")
);

function App() {
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [isEnvelopeFocusOpen, setIsEnvelopeFocusOpen] = useState(false);

  return (
    <>
      <DeskScene isDiaryOpen={isDiaryOpen}>
        <DiaryBook
          onOpenChange={setIsDiaryOpen}
          onEnvelopeOpen={() => setIsEnvelopeFocusOpen(true)}
          isEnvelopeFocusOpen={isEnvelopeFocusOpen}
        />
      </DeskScene>

      <AnimatePresence>
        {isEnvelopeFocusOpen && (
          <Suspense fallback={null}>
            <EnvelopeFocus onClose={() => setIsEnvelopeFocusOpen(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
