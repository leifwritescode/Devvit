import { Computer } from "./Computer.js";
import { TicTacToe } from "./TicTacToe.js";
import { TicTacToeState } from "./TicTacToeState.js";
import { Board, PlayResult, Player } from "./Types.js";
import { hasWinner, getLegalMoves } from "./Utils.js";

export class ModifiedMinMaxComputer implements Computer {
    private state: TicTacToeState;
    
    constructor(state: TicTacToeState) {
        this.state = state;
    }
    
    private isGameOver(board: Board): boolean {
        return board.every(cell => cell !== null);
    }
    
    private score(board: Board): number {
        if (hasWinner(board, Player.Redditor)) {
            return 10;
        }
        
        if (hasWinner(board, Player.Computer)) {
            return -10;
        }
        
        return 0;
    }

    private minimax(board: Board, depth: number, player: Player): number {
        if (this.isGameOver(board)) {
            return this.score(board);
        }
        
        const emptyCells = getLegalMoves(board);
        
        if (player === Player.Computer) {
            let bestScore = Number.NEGATIVE_INFINITY;
            for (const i of emptyCells) {
                board[i] = Player.Computer;
                const score = this.minimax(board, depth + 1, Player.Redditor);
                board[i] = null;
                bestScore = Math.max(bestScore, score);
            }
            return bestScore;
        } else {
            let bestScore = Number.POSITIVE_INFINITY;
            for (const i of emptyCells) {
                board[i] = Player.Redditor;
                const score = this.minimax(board, depth + 1, Player.Computer);
                board[i] = null;
                bestScore = Math.min(bestScore, score);
            }
            return bestScore;
        }
    }

    private getBestMove(board: Board, player: Player = Player.Computer): number {
        const emptyCells = getLegalMoves(board);
        let bestMove: number = -1;
        let bestScore = Number.NEGATIVE_INFINITY;

        for (const i of emptyCells) {
            board[i] = player;
            const score = this.minimax(board, 0, player === Player.Computer ? Player.Redditor : Player.Computer);
            board[i] = null;
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }

        return bestMove;
    }
    
    public play(ticTacToe: TicTacToe): PlayResult {
        var move = this.getBestMove(this.state.board);
        if (move === -1) {
            console.log("I can't seem to play...");
            return PlayResult.InvalidState;
        }

        return ticTacToe.play(move);
    }
}
