"use client";
import { useDraw } from "@/hooks/useDraw";
import { socket } from "@/lib/socket";
import { drawLine, drawWithDataURL } from "@/lib/utils";
import { useGameStore } from "@/stores/useGame";
import { User, useUserStore } from "@/stores/userStore";
import { Draw, DrawOptions } from "@/types/typing";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ModalComponent from "./ModalComponent";
import ClearButton from "./ClearButton";

const DrawingCanvas = () => {
  const { roomId } = useParams();

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [isCanvasLoading, setCanvasLoading] = useState(true);
  const user = useUserStore((state) => state.user);
  const [word, setWord, turn, setTurn] = useGameStore((state) => [
    state.word,
    state.setWord,
    state.turn,
    state.setTurn,
  ]);

  const containerRef = useRef<HTMLDivElement>(null);

  const onDraw = useCallback(
    ({ prevPoint, currentPoint, ctx }: Draw) => {
      const drawOptions = {
        prevPoint,
        currentPoint,
        ctx,
        color: "#000",
      };
      drawLine(drawOptions);
      socket.emit("draw-line", { drawOptions, roomId });
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

    socket.on("update-canvas-state", (drawOptions: DrawOptions) => {
      if (!ctx) return;
      drawLine({ ...drawOptions, ctx });
    });

    socket.on("send-turn", (res: string) => {
      console.log({ res });
      const response = JSON.parse(res);
      setWord(response.currentWord);
      setTurn(response.turn);
    });

    socket.on("turn-over", () => {
      setIsOpen(true);
    });

    return () => {
      socket.off("get-canvas-state");
      socket.off("canvas-state-from-server");
      socket.off("update-canvas-state");
    };
  }, [canvasRef, roomId]);

  useEffect(() => {
    // const setCanvasDimensions = () => {
    //   if (!containerRef.current && !canvasRef.current) return;
    //   const { width, height } =
    //     containerRef.current?.getBoundingClientRect() as DOMRect;
    //   console.log({ height });
    //   if (canvasRef.current) {
    //     canvasRef.current.width = width - 50;
    //     canvasRef.current.height = height - 50;
    //   }
    // };
    // setCanvasDimensions();
  }, [canvasRef]);

  // turn?.id !== user?.id ? "cursor-not-allowed pointer-events-none" : ""

  return (
    <div
      ref={containerRef}
      className="w-full flex items-start justify-center mt-2"
    >
      {/* <ModalComponent modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} /> */}

      <div className="relative">
        <canvas
          id="canvas"
          width={650}
          height={650}
          className={`border border-black rounded-md `}
          ref={canvasRef}
          onMouseDown={onMouseDown}
        ></canvas>
        <div className="absolute right-[0px] top-[0px] flex select-none rounded-none rounded-bl rounded-tr-[2.5px]">
          <ClearButton canvasRef={canvasRef} clear={clear} />
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;
