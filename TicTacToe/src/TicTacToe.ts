import { Board, Player, PlayResult } from "./Types.js";
import { TicTacToeState } from "./TicTacToeState.js";

export class TicTacToe {
    private state: TicTacToeState;

    constructor(state: TicTacToeState = {
        board: new Array(9).fill(null),
        currentPlayer: 'X',
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

        if (this.hasWinner()) {
            this.state.winner = this.state.currentPlayer;
            return PlayResult.PlayerHasWon;
        } else if (this.isDraw()) {
            this.state.winner = 'Stalemate';
            return PlayResult.Stalemate;
        } else {
            this.state.currentPlayer = this.state.currentPlayer === 'X' ? 'O' : 'X';
            return PlayResult.NextPlayerTurn;
        }
    }

    public isGameOver(): boolean {
        return this.state.winner !== null || this.state.board.every(cell => cell !== null);
    }

    public hasWinner(): boolean {
        const lines = [
            // rows
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            // columns
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            // diagonals
            [0, 4, 8],
            [2, 4, 6],
        ];

        return lines.some(line => line.every(cell => this.state.board[cell] == this.state.currentPlayer));
    }

    public isDraw(): boolean {
        return this.state.board.every(cell => cell !== null) && !this.hasWinner();
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
