"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { socket } from "@/lib/socket";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { useGameStore } from "@/stores/useGame";

function LeaveRoom() {
  const router = useRouter();
  const [user, setUser] = useUserStore((state) => [state.user, state.setUser]);
  const [setWord] = useGameStore((state) => [state.setWord]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      variant="destructive"
      className="absolute bottom-0 w-full"
      onClick={() => {
        setIsLoading(true);
        socket.emit("leave-room");
        setUser(null);
        setWord(null);
        setTimeout(() => {
          router.replace("/");
        }, 600);
      }}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Leave Room"}
    </Button>
  );
}

export default LeaveRoom;
