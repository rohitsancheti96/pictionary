import { create } from "zustand";
import { User } from "./userStore";

interface GameState {
  word: string | null;
  turn: User | null;
  setWord: (word: string) => void;
  setTurn: (turn: User) => void;
  messages: { user: User; message: string }[];
  setMessages: (messages: { user: User; message: string }[]) => void;
}

export const useGameStore = create<GameState>((set) => ({
  word: null,
  turn: null,
  messages: [],
  setWord: (word: string) => set({ word }),
  setTurn: (turn: User) => set({ turn }),
  setMessages: (messages: { user: User; message: string }[]) =>
    set({ messages }),
}));
