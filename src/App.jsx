import React, { useState } from "react";

import DiaryBook from "./components/book/DiaryBook";
import DeskScene from "./components/scene/DeskScene";

function App() {
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=EB+Garamond:ital@0;1&display=swap');
      `}</style>

      <DeskScene isDiaryOpen={isDiaryOpen}>
        <DiaryBook onOpenChange={setIsDiaryOpen} />
      </DeskScene>
    </>
  );
}

export default App;