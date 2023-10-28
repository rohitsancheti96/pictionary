"use client";
import { useDraw } from "@/hooks/useDraw";
import { socket } from "@/lib/socket";
import { drawLine, drawWithDataURL } from "@/lib/utils";
import { Draw } from "@/types/typing";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

const DrawingCanvas = () => {
  const { roomId } = useParams();

  const [isCanvasLoading, setCanvasLoading] = useState(true);
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
    const canvesElement = canvasRef.current;
    const ctx = canvesElement?.getContext("2d");

    socket.emit("client-ready", roomId);

    socket.on("client-loaded", () => {
      setCanvasLoading(false);
    });

    socket.on("get-canvas-state", () => {
      const canvasState = canvasRef.current?.toDataURL();
      if (!canvasState) return;
      console.log("sending canvas state");
      socket.emit("send-canvas-state", canvasState);
    });

    socket.on("canvas-state-from-server", (canvasState: string) => {
      if (!ctx || !canvesElement) return;

      drawWithDataURL(canvasState, ctx, canvesElement);
      setCanvasLoading(false);
    });

    socket.on("update-canvas-state", () => {});

    return () => {
      socket.off("get-canvas-state");
      socket.off("canvas-state-from-server");
      socket.off("update-canvas-state");
    };
  });

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
