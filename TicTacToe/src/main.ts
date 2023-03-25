import { Devvit, KeyValueStorage, RedditAPIClient, RichTextBuilder } from '@devvit/public-api';
import { CommentSubmit, Metadata, PostSubmit } from '@devvit/protos';
import { TicTacToe } from './TicTacToe.js';
import { Difficulty, PlayResult } from './Types.js';
import { TicTacToeState, getTicTacToeStateFromKeyValueStore } from './TicTacToeState.js';
import { NaiveComputer } from './NaiveComputer.js';
import { Computer } from './Computer.js';
import { ModifiedMinMaxComputer } from './ModifiedMinMaxComputer.js';

const keyValueStorage = new KeyValueStorage();
const reddit = new RedditAPIClient();

const cellFriendlyNamesByIndex: string[] = [ "top left", "top middle", "top right", "middle left", "middle", "middle right", "bottom left", "bottom middle", "bottom right" ];

// construct markdown table from raw board
function constructBoardRepresentation(board: number[]): RichTextBuilder {
    var rtb = new RichTextBuilder();
    rtb.table(table => {
        for (var rowIndex = 0; rowIndex <= 6; rowIndex += 3) {
            for (var cellIndex = 0; cellIndex <= 2; ++cellIndex) {      
                table.row(row => {
                    var value = board[rowIndex + cellIndex];
                    var text = " ";
                    switch (value) {
                        case 1:
                        text = "O";
                        break;
                        case 0:
                        text = "X";
                        break;
                        default:
                        break;
                    }
                    
                    row.cell(cell => cell.text({ text: text}));
                });
            }
        }
    });
    
    return rtb;
}

Devvit.addTrigger({
    event: Devvit.Trigger.PostSubmit,
    async handler(request: PostSubmit, metadata?: Metadata) {
        console.log("received new post!");
        /*
        var theRealPost = await reddit.getPostById(request.post!.id, metadata);

        if (request.post?.title != "play tictactoe") {
            console.log("this post is not a new game");
            
            await theRealPost.delete();
            return;
        }

        var gameState = await keyValueStorage.get<number[]>(request.author!.id);
        if (gameState != undefined) {
            console.log("the user tried to make a game, but one is already in progress -- starting again!");
            await keyValueStorage.delete(request.author!.id);
            return;
        }

        // prep the game board
        await keyValueStorage.put(request.author!.id, [-1, -1, -1, -1, -1, -1, -1, -1, -1]);

        // start new game
        // reply with the rules and how to play
        var replyBody = `Let's play tic-tac-toe. You'll be 'x,' and move first.
        You can issue a move by making a comment with any of the following cell names:
        ${cellFriendlyNamesByIndex.join(", ")}
        It doesn't matter whether you leave a top comment, or reply to an existing comment.
        Each time you send a move, I'll update the body of the post with the current state of the board.
        `;
        
        await theRealPost.addComment({ text: replyBody });
        await theRealPost.edit({ richtext: constructBoardRepresentation([-1, -1, -1, -1, -1, -1, -1, -1, -1]) });
        */
    },
})

function newComputer(state: TicTacToeState, difficulty: Difficulty): Computer {
    switch (difficulty) {
        case Difficulty.Trivial:
            return new NaiveComputer(state);
        case Difficulty.Hard:
            return new NaiveComputer(state); // todo regular minmax, as a treat
        case Difficulty.LiterallySatan:
            return new ModifiedMinMaxComputer(state);
    }
}

Devvit.addTrigger({
    event: Devvit.Trigger.CommentSubmit,
    async handler(request: CommentSubmit, metadata?: Metadata) {
        var author = request.author!;
        var comment = request.comment!;

        var state = await getTicTacToeStateFromKeyValueStore(author.id, keyValueStorage);
        if (state === undefined) {
            console.error(`game state is undefined for ${author.name}`);
            return;
        }

        var ticTacToe = new TicTacToe(state);
        var move = cellFriendlyNamesByIndex.indexOf(comment.body);
        if (move === -1) {
            console.error(`player ${author.name} attempted an invalid move: ${comment.body}`);
            return;
        }

        var result = ticTacToe.play(move);
        switch (result) {
            case PlayResult.InvalidState:
                console.error(`player ${author.name} attempted to play after game over`);
                return;

            case PlayResult.InvalidMove:
                console.error(`player ${author.name} attempted a move incompatible with the game state`);
                return;

            // the only outcome that should proceed with play is this
            case PlayResult.NextPlayerTurn:
                console.log(`player ${author.name} played at ${comment.body}, next turn`);
                break;

            case PlayResult.PlayerHasWon:
                console.log(`player ${author.name} has triumphed against the computer`); // or indeed the computer against the player
                return;

            case PlayResult.Stalemate:
                console.log(`player ${author.name} drew with the computer`);
                return;
        };

        var computer = newComputer(state, Difficulty.Trivial);
        result = computer.play(ticTacToe);
        switch (result) {
            case PlayResult.InvalidState:
                console.error(`the computer attempted to play after game over`);
                break;

            case PlayResult.InvalidMove:
                console.error(`the computer attempted a move incompatible with the game state`);
                break;

            case PlayResult.NextPlayerTurn:
                console.log(`the computer played at TODO, next turn`);
                break;

            case PlayResult.PlayerHasWon:
                console.log(`the computer has triumphed against player ${author.name}`); // or indeed the computer against the player
                break;

            case PlayResult.Stalemate:
                console.log(`the computer drew with player ${author.name}`);
                break;
        }
    },
})

export default Devvit;
