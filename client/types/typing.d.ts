import { User } from "@/stores/userStore";

interface Draw {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
}

type Point = {
  x: number;
  y: number;
};

type Game = {
  playerList: Player[];
  playerTurn: string; // playerId
  roomId: string;
};

type Player = {
  playerId: string;
  playName: string;
};

export interface RoomJoinedData {
  user: User;
  roomId: string;
  members: User[];
}

export interface Notification {
  title: string;
  message: string;
}

export interface DrawOptions extends Draw {
  // strokeColor: string
  // strokeWidth: number[]
  // dashGap: number[]
  color: string;
}
