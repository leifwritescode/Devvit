import { Computer } from "./Computer.js";
import { TicTacToe } from "./TicTacToe.js";
import { TicTacToeState } from "./TicTacToeState.js";
import { PlayResult } from "./Types.js";

export class ModifiedMinMax implements Computer {
    private state: TicTacToeState;

    constructor(state: TicTacToeState) {
        this.state = state;
    }

    public play(ticTacToe: TicTacToe): PlayResult {
        // todo depth-adjusted minmax alg
        var move = this.state.board.indexOf(null);
        return ticTacToe.play(move);
    }
}