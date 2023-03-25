export type Player = 'X' | 'O';

export type Board = (Player | null)[];

export enum PlayResult {
    InvalidState,
    InvalidMove,
    NextPlayerTurn,
    PlayerHasWon,
    Stalemate,
};

export enum Difficulty {
    Trivial,
    Hard,
    LiterallySatan
};
