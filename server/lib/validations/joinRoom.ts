import * as z from "zod";

export const joinRoomSchema = z.object({
  username: z
    .string()
    .min(2, "Username must contain atleast 2 characters")
    .max(50, "Username must not contain more than 50 characters"),
  roomId: z
    .string()
    .trim()
    .length(6, "Room ID must contain exactly 21 characters"),
});
