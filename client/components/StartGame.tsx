"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { socket } from "@/lib/socket";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useGameStore } from "@/stores/useGame";

function StartGame() {
  const { roomId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [word] = useGameStore((state) => [state.word]);

  useEffect(() => {
    setIsLoading(false);
    console.log({ word });
  }, [word]);

  return word ? null : (
    <Button
      className="absolute bottom-12 w-full"
      onClick={() => {
        setIsLoading(true);
        socket.emit("start-game", roomId);
      }}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start"}
    </Button>
  );
}

export default StartGame;
