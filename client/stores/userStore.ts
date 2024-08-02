import { create } from "zustand";

export interface User {
  id: string;
  username: string;
  roomId?: string;
  score?: number;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
