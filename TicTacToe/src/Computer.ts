import { TicTacToe } from "./TicTacToe.js";
import { PlayResult } from "./Types.js";

export interface Computer {
    play(ticTacToe: TicTacToe): PlayResult;
}
