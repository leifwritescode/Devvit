import { Board, Player } from './Types.js'

export function hasWinner(board: Board, player: Player): boolean {
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
    
    return lines.some(line => line.every(cell => board[cell] === player));
}

export function getLegalMoves(board: Board): number[] {
    return board.reduce<number[]>((acc: number[], el: (Player | null), i: number) => (el === null) ? [...acc, i] : acc, []);
}