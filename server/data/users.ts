import { User } from "../types";

let users: User[] = [];

const getUser = (userId: string) => users.find((user) => user.id === userId);

const getRoomMembers = (roomId: string): User[] => {
  return users.filter((user) => user.roomId === roomId) ?? [];
};

const addUser = (user: User) => users.push(user);

const removeUser = (userId: string) => {
  users = users.filter((user) => user.id !== userId);
};

const getAllusers = () => {
  console.log({ users });
  return users;
};

const wordToGuess = () => {
  return "apple";
};

export {
  getUser,
  getRoomMembers,
  addUser,
  removeUser,
  getAllusers,
  wordToGuess,
};
