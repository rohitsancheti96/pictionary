"use client";
import DrawingCanvas from "@/components/DrawingCanvas";
import WordDisplay from "@/components/WordDisplay";
import { useGameStore } from "@/stores/useGame";
import React from "react";

const RoomPage = () => {
  const [word, turn] = useGameStore((state) => [state.word, state.turn]);

  return (
    <>
      {/* <WordDisplay word={word} turn={turn} /> */}
      <DrawingCanvas />
    </>
  );
};

export default RoomPage;
