import { Board, Player, PlayResult } from "./Types.js";
import { TicTacToeState } from "./TicTacToeState.js";
import { hasWinner } from "./Utils.js";

export class TicTacToe {
    private state: TicTacToeState;

    constructor(state: TicTacToeState = {
        board: new Array(9).fill(null),
        currentPlayer: Player.Redditor,
        winner: null,
    }) {
        this.state = state;
    }

    public play(index: number): PlayResult {
        if (this.isGameOver()) {
            throw PlayResult.InvalidState;
        }

        if (this.state.board[index] !== null) {
            return PlayResult.InvalidMove;
        }

        this.state.board[index] = this.state.currentPlayer;

        if (hasWinner(this.state.board, this.state.currentPlayer)) {
            this.state.winner = this.state.currentPlayer;
            return PlayResult.PlayerHasWon;
        } else if (this.isDraw()) {
            this.state.winner = 'Stalemate';
            return PlayResult.Stalemate;
        } else {
            this.state.currentPlayer = this.state.currentPlayer === Player.Redditor ? Player.Computer : Player.Redditor;
            return PlayResult.NextPlayerTurn;
        }
    }

    public isGameOver(): boolean {
        return this.state.winner !== null || this.state.board.every(cell => cell !== null);
    }

    public isDraw(): boolean {
        return this.state.board.every(cell => cell !== null) && !hasWinner(this.state.board, this.state.currentPlayer);
    }

    public getWinner(): Player | 'Stalemate' | null {
        return this.state.winner;
    }

    public getCurrentPlayer(): Player {
        return this.state.currentPlayer;
    }

    public getBoard(): Board {
        return [...this.state.board];
    }
}
