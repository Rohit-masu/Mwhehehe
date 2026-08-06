import React, { useEffect, useRef, useState } from "react";
import "./DeskScene.css";

import woodDesk from "../../assets/images/wood-desk.webp";

import FairyLights from "./FairyLights";
import NewspaperNote from "./NewspaperNote";
import VintageCassette from "./VintageCassette";
import CandleDecor from "./CandleDecor";
import AmbientParticles from "./AmbientParticles";
import SunflowerCluster from "./SunflowerCluster";
import PetalsDecor from "./PetalsDecor";
import CakeDecor from "./CakeDecor";
import BirthdayMessage from "./BirthdayMessage";

function DeskScene({ children }) {
  const [isCelebrating, setIsCelebrating] = useState(false);
  const timeoutRef = useRef(null);

  const handleWish = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsCelebrating(true);

    timeoutRef.current = setTimeout(() => {
      setIsCelebrating(false);
    }, 4200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
  <main
    className={`desk-scene ${
      isCelebrating ? "is-celebrating" : ""
    }`}
    style={{
      "--desk-background-image": `url(${woodDesk})`,
    }}
  >
    {/* Everything that should blur */}
    <div className="desk-scene__visuals">
      <div className="desk-scene__spotlight" />
      <div className="desk-scene__vignette" />
      <div className="desk-scene__grain" />

      <AmbientParticles />
      <FairyLights />
      <NewspaperNote />
      <VintageCassette />
      <SunflowerCluster />
      <PetalsDecor />
      <CandleDecor />
      <CakeDecor onWish={handleWish} />

      <div className="desk-scene__content">
        {children}
      </div>
    </div>

    {/* This must remain outside visuals */}
    <BirthdayMessage show={isCelebrating} />
  </main>
);
}

export default DeskScene;