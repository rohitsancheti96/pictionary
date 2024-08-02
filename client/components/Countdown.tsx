"use client";
import { socket } from "@/lib/socket";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function Countdown() {
  const [time, setTime] = useState(30);
  const { roomId } = useParams();
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let timeLeft = prev - 0.5;
        if (timeLeft < 0) {
          socket.emit("turn-over", roomId);
          setTime(0);
          clearInterval(interval);
        }
        return timeLeft;
      });
    }, 1000);
  }, []);
  return <div>{time}</div>;
}

export default Countdown;
