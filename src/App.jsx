import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";

import DiaryBook from "./components/book/DiaryBook";
import DeskScene from "./components/scene/DeskScene";
import EnvelopeFocus from "./components/scene/EnvelopeFocus";

function App() {
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [isEnvelopeFocusOpen, setIsEnvelopeFocusOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=EB+Garamond:ital@0;1&display=swap');
      `}</style>

      <DeskScene isDiaryOpen={isDiaryOpen}>
        <DiaryBook
          onOpenChange={setIsDiaryOpen}
          onEnvelopeOpen={() => setIsEnvelopeFocusOpen(true)}
          isEnvelopeFocusOpen={isEnvelopeFocusOpen}
        />
      </DeskScene>

      <AnimatePresence>
        {isEnvelopeFocusOpen && (
          <EnvelopeFocus onClose={() => setIsEnvelopeFocusOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
