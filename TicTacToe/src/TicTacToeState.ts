import { Board, Player } from './Types.js';
import { KeyValueStorage } from '@devvit/public-api';

export interface TicTacToeState {
    board: Board;
    currentPlayer: Player;
    winner: Player | 'Stalemate' | null;
}

export const getTicTacToeStateFromKeyValueStore = async (key: string, keyValueStorage: KeyValueStorage): Promise<TicTacToeState | undefined> => {
    var value = await keyValueStorage.get(key);
    if (value === undefined) {
        return undefined;
    }

    // Whomsoever designed this syntax is either a wildebeest or the antichrist.
    return <TicTacToeState> <unknown> value;
}
