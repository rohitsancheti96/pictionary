const express = require("express");
const http = require("http");
import { Server, type Socket } from "socket.io";

import { joinRoomSchema } from "./lib/validations/joinRoom";
import { z } from "zod";
import {
  addUser,
  getAllusers,
  getRoomMembers,
  getUser,
  removeUser,
  wordToGuess,
} from "./data/users";
import { JoinRoomData, User } from "./types";
import { Game } from "./Game";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  // @ts-ignore
  cors: {
    origin: "*",
  },
});

type Point = { x: number; y: number };

let Games: { [key: string]: Game } = {};
type DrawLine = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
};

function isRoomCreated(roomId: string) {
  const rooms = [...io.sockets.adapter.rooms];
  return rooms?.some((room) => room[0] === roomId);
}

function leaveRoom(socket: Socket) {
  const user = getUser(socket.id);
  if (!user) return;

  const { username, roomId } = user;
  removeUser(socket.id);
  const members = getRoomMembers(roomId);
  console.log({ members });
  socket.to(roomId).emit("update-members", members);
  socket.to(roomId).emit("send-notification", {
    title: "Member left!",
    message: `${username} left the party`,
  });
  socket.leave(roomId);
}

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
    roomId: roomId,
    score: 0,
    lastPlayedRoundNumber: 0,
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

  socket.on("join-room", (joinRoomData: JoinRoomData) => {
    const validatedData = validateJoinRoomData(socket, joinRoomData);
    if (!validatedData) return;
    const { roomId, username } = validatedData;

    if (isRoomCreated(roomId)) {
      return joinRoom(socket, roomId, username);
    }

    socket.emit("room-not-found", {
      message: "Oops! The Room ID you entered does not exist.",
    });
  });

  socket.on("start-game", (roomId: string) => {
    console.log({ roomId });
    const roomMembers = getRoomMembers(roomId);
    const game = new Game(roomMembers);
    Games[game.gameId] = game;

    const payload = JSON.stringify(game);
    console.log({ payload });
    socket.nsp.to(roomId).emit("send-turn", payload);

    socket.on("turn-over", (roomId: string) => {
      console.log("turn over");
      socket.nsp.to(roomId).emit("turn-over", game);
    });

    socket.on("get-next-turn", () => {
      const turn = game.getTurn();

      if (!turn) {
        socket.nsp.to(roomId).emit("game-over", game);
        return;
      }

      const payload = JSON.stringify(game);
      console.log({ payload });
      socket.nsp.to(roomId).emit("send-turn", payload);
    });
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

  socket.on("draw-line", ({ drawOptions, roomId }) => {
    socket.to(roomId).emit("update-canvas-state", drawOptions);
  });

  socket.on("leave-room", () => {
    leaveRoom(socket);
  });

  // After Game Start events

  socket.on(
    "send-message",
    ({ user, message }: { user: User; message: string }) => {
      const payload = JSON.stringify({
        user,
        message,
      });
      console.log(payload);
      socket.to(user.roomId).emit("receive-message", payload);
      // game.checkWord(user, message);
    }
  );

  // socket disconnect
  socket.on("disconnect", () => {
    console.log("socket disconnected");
    leaveRoom(socket);
    // game.removeUser(socket.id);
  });

  socket.on("clear", () => io.emit("clear"));
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
