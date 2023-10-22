"use client";

import JoinGame from "@/components/joinGame";
import { useDraw } from "@/hooks/useDraw";
import { useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import { io } from "socket.io-client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CreateRoomForm from "@/components/CreateRoomForm";
import { nanoid } from "nanoid";
import { Separator } from "@/components/ui/separator";
import JoinRoomButton from "@/components/JoinRoomButton";
import { socket } from "@/lib/socket";
import { Draw, Point } from "@/types/typing";

type DrawLineProps = {
  prevPoint: Point | null;
  currentPoint: Point;
  ctx: CanvasRenderingContext2D;
  color: string;
};

export default function Home() {
  const roomId = "123456789123456789123";
  return (
    <div className="flex h-screen flex-col items-center justify-between pb-5 pt-[13vh]">
      <Card className="w-[90vw] max-w-[400px]">
        <CardHeader>
          <CardTitle>Pictionary</CardTitle>
          <CardDescription>
            Draw on the same canvas with your friends in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <CreateRoomForm roomId={roomId} />

          <div className="flex items-center justify-center space-x-2">
            {/* <Separator  /> */}
            <span className="text-xs text-muted-foreground">OR</span>
            {/* <Separator /> */}
          </div>

          <JoinRoomButton />
        </CardContent>
      </Card>
    </div>
  );
}

// function GameBoard() {
//   const [color, setColor] = useState("#000");
//   const { canvasRef, onMouseDown, clear } = useDraw(createLine);

//   useEffect(() => {
//     const ctx = canvasRef.current?.getContext("2d");

//     socket.emit("client-ready");

//     socket.on("get-canvas-state", () => {
//       if (!canvasRef.current?.toDataURL()) return;
//       console.log("sending canvas state");
//       socket.emit("canvas-state", canvasRef.current.toDataURL());
//     });

//     socket.on("canvas-state-from-server", (state: string) => {
//       console.log("I received the state");
//       const img = new Image();
//       img.src = state;
//       img.onload = () => {
//         ctx?.drawImage(img, 0, 0);
//       };
//     });

//     socket.on(
//       "draw-line",
//       ({ prevPoint, currentPoint, color }: DrawLineProps) => {
//         if (!ctx) return console.log("no ctx here");
//         drawLine({ prevPoint, currentPoint, ctx, color });
//       }
//     );

//     socket.on("clear", clear);

//     return () => {
//       socket.off("get-canvas-state");
//       socket.off("canvas-state-from-server");
//       socket.off("draw-line");
//       socket.off("clear");
//     };
//   }, [canvasRef]);

//   function createLine({ prevPoint, currentPoint, ctx }: Draw) {
//     socket.emit("draw-line", { prevPoint, currentPoint, color });
//     drawLine({ prevPoint, currentPoint, ctx, color });
//   }

//   function drawLine({ prevPoint, currentPoint, ctx, color }: DrawLineProps) {
//     const { x: currX, y: currY } = currentPoint;
//     const lineColor = color;
//     const lineWidth = 5;

//     let startPoint = prevPoint ?? currentPoint;
//     ctx.beginPath();
//     ctx.lineWidth = lineWidth;
//     ctx.strokeStyle = lineColor;
//     ctx.moveTo(startPoint.x, startPoint.y);
//     ctx.lineTo(currX, currY);
//     ctx.stroke();

//     ctx.fillStyle = lineColor;
//     ctx.beginPath();
//     ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
//     ctx.fill();
//   }

//   return (
//     <div className="w-screen h-screen bg-white flex justify-center items-center">
//       <div className="flex flex-col gap-10 pr-10">
//         <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
//         <button
//           type="button"
//           className="p-2 rounded-md border border-black"
//           onClick={() => socket.emit("clear")}
//         >
//           Clear
//         </button>
//       </div>
//       <canvas
//         width={450}
//         height={450}
//         className="border border-black rounded-md"
//         ref={canvasRef}
//         onMouseDown={onMouseDown}
//       ></canvas>
//     </div>
//   );
// }
