const express = require("express");
const http = require("http");
import { Server, type Socket } from "socket.io";

import { joinRoomSchema } from "./lib/validations/joinRoom";
import { z } from "zod";
import { addUser, getRoomMembers } from "./data/users";
import { JoinRoomData } from "./types";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

type Point = { x: number; y: number };

type DrawLine = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
};

function validateJoinRoomData(socket: Socket, joinRoomData: JoinRoomData) {
  try {
    return joinRoomSchema.parse(joinRoomData);
  } catch (err) {
    if (err instanceof z.ZodError) {
      socket.emit("invalid-data", {
        message:
          "The entities you provided are not correct and cannot be processed.",
      });
    }
  }
}

function joinRoom(socket: Socket, roomId: string, username: string) {
  socket.join(roomId);
  const user = {
    id: socket.id,
    username,
  };
  addUser({ ...user, roomId });
  const members = getRoomMembers(roomId);

  socket.emit("room-joined", { user, roomId, members });
  socket.to(roomId).emit("update-members", members);
  socket.to(roomId).emit("send-notification", {
    title: "New member arrived!",
    message: `${username} joined the party`,
  });
}

io.on("connection", (socket) => {
  socket.on("create-room", (joinRoomData: JoinRoomData) => {
    const validatedData = validateJoinRoomData(socket, joinRoomData);

    if (!validatedData) return;
    const { roomId, username } = validatedData;

    joinRoom(socket, roomId, username);
  });

  socket.on("client-ready", (roomId: string) => {
    const members = getRoomMembers(roomId);

    if (members.length === 1) return socket.emit("client-loaded");
    const adminMember = members[0];

    if (!adminMember) return;

    socket.to(adminMember.id).emit("get-canvas-state");
  });

  socket.on("send-canvas-state", (canvasState: string, roomId: string) => {
    const members = getRoomMembers(roomId);

    const lastMember = members[members.length - 1];

    if (!lastMember) return;

    socket.to(lastMember.id).emit("canvas-state-from-server", canvasState);
  });

  socket.on("draw-line", ({ prevPoint, currentPoint, color }: DrawLine) => {
    socket.broadcast.emit("draw-line", { prevPoint, currentPoint, color });
  });

  socket.on("clear", () => io.emit("clear"));
});

server.listen(5000, () => {
  console.log("Server listening on 5000");
});
