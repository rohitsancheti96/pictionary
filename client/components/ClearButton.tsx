import { socket } from "@/lib/socket";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "./ui/button";

interface ClearButtonProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  clear: () => void;
}

const ClearButton = ({ canvasRef, clear }: ClearButtonProps) => {
  const { roomId } = useParams();

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    clear();

    socket.emit("clear-canvas", roomId);
  };

  useEffect(() => {
    socket.on("clear-canvas", () => clear);

    return () => {
      socket.off("clear-canvas");
    };
  }, [clear]);

  return (
    <Button size="sm" onClick={clearCanvas}>
      Clear
    </Button>
  );
};

export default ClearButton;
