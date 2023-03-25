import { Computer } from "./Computer.js";
import { TicTacToe } from "./TicTacToe.js";
import { TicTacToeState } from "./TicTacToeState.js";
import { Player, PlayResult } from "./Types.js";

export class NaiveComputer implements Computer {
    private state: TicTacToeState;

    constructor(state: TicTacToeState) {
        this.state = state;
    }

    play(ticTacToe: TicTacToe): PlayResult {
        var legalMoves = this.state.board.reduce<number[]>((acc: number[], el: (Player | null), i: number) => (el === null) ? [...acc, i] : acc, []);
        var move = Math.floor(Math.random() * legalMoves.length);
        return ticTacToe.play(move);    
    }
}
