"use client";
import { User, useUserStore } from "@/stores/userStore";
import React from "react";

function WordDisplay({
  word,
  turn,
}: {
  word: string | null;
  turn: User | null;
}): JSX.Element {
  const user = useUserStore((state) => state.user);
  return (
    <div className="h-[3rem] flex justify-center items-centers">
      <>
        {word ? (
          turn && user?.id === turn.id ? (
            <div className="h-[3rem] flex items-center">{word}</div>
          ) : (
            word
              .split("")
              .map((x, index) => (
                <span
                  key={index}
                  className="m-1 px-[15px] py-2.5 border-b-[black] border-b border-solid"
                ></span>
              ))
          )
        ) : (
          <div className="h-[3rem] flex items-center justify-center"></div>
        )}
      </>
    </div>
  );
}

export default WordDisplay;
