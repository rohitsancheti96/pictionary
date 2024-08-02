export interface User {
  id: string;
  username: string;
  roomId: string;
  score: number; // room related keys
  lastPlayedRoundNumber: number; // room related keys
}

export interface JoinRoomData {
  username: string;
  roomId: string;
}
