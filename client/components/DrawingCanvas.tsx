"use client";
import { useDraw } from "@/hooks/useDraw";
import { socket } from "@/lib/socket";
import { drawLine } from "@/lib/utils";
import { Draw } from "@/types/typing";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useRef } from "react";

const DrawingCanvas = () => {
  const { roomId } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const onDraw = useCallback(
    ({ prevPoint, currentPoint, ctx }: Draw) => {
      drawLine({ prevPoint, currentPoint, ctx, color: "#000" });
      socket.emit("draw-line", { prevPoint, currentPoint, color: "#000" });
    },
    [roomId]
  );

  const { canvasRef, onMouseDown, clear } = useDraw(onDraw);

  useEffect(() => {
    const setCanvasDimensions = () => {
      if (!containerRef.current && !canvasRef.current) return;

      const { width, height } =
        containerRef.current?.getBoundingClientRect() as DOMRect;

      if (canvasRef.current) {
        canvasRef.current.width = width - 50;
        canvasRef.current.height = height - 50;
      }
    };
    setCanvasDimensions();
  }, [canvasRef]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full flex items-center justify-center"
    >
      <canvas
        width={0}
        height={0}
        className="border border-black rounded-md"
        ref={canvasRef}
        onMouseDown={onMouseDown}
      ></canvas>
    </div>
  );
};

export default DrawingCanvas;
