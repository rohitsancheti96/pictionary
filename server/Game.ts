import { User } from "./types";
import { wordBank } from "./utils/wordBank";

export class Game {
  gameId: string;
  users: User[]; // 5users in game
  turn: User;
  onGoingRoundNumber: number; // 1
  totalRounds: number; //2
  currentWord: string;
  wordsDone: string[];

  constructor(users: User[]) {
    this.gameId = Math.random().toString(36).slice(2);
    this.users = users.map((user) => ({
      ...user,
      lastPlayedRoundNumber: 0,
      score: 0,
    }));
    this.turn = users[0];
    this.onGoingRoundNumber = 1;
    this.totalRounds = 2;
    this.currentWord = wordBank[this.onGoingRoundNumber - 1];
    this.wordsDone = [];
  }

  removeUser(userId: string) {
    this.users = this.users.filter((user) => user.id !== userId);
    console.log({ users: this.users });
    // if no user, game over
  }

  getTurn() {
    if (this.onGoingRoundNumber <= this.totalRounds) {
      let playersLeftToPlay = this.users.filter(
        (user) => user.lastPlayedRoundNumber < this.onGoingRoundNumber
      );
      if (playersLeftToPlay.length === 0) {
        this.wordsDone = [...this.wordsDone, this.currentWord];
        this.onGoingRoundNumber++;
        this.currentWord = wordBank[this.onGoingRoundNumber - 1];
        this.getTurn();
      } else {
        let playerToDraw = {
          ...playersLeftToPlay[0],
          lastPlayedRoundNumber: this.onGoingRoundNumber,
        };
        this.turn = playerToDraw;
        return playerToDraw;
      }
    }
    return null; //games over
  }

  checkWord(user: User, message: string) {
    if (message === this.currentWord) {
      // this.turn.score++;
      user.score++;
    }
  }
}
