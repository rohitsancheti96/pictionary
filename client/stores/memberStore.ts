import { create } from "zustand";
import { User } from "@/stores/userStore";

interface UserState {
  members: User[];
  setMembers: (members: User[]) => void;
}

export const useMemberStore = create<UserState>((set) => ({
  members: [],
  setMembers: (members) => set({ members }),
}));
