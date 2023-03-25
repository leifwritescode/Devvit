import { Computer } from "./Computer.js";
import { TicTacToe } from "./TicTacToe.js";
import { TicTacToeState } from "./TicTacToeState.js";
import { PlayResult } from "./Types.js";

export class NaiveComputer implements Computer {
    private state: TicTacToeState;

    constructor(state: TicTacToeState) {
        this.state = state;
    }

    play(ticTacToe: TicTacToe): PlayResult {
        var move = this.state.board.indexOf(null);
        return ticTacToe.play(move);    
    }
}
