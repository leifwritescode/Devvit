import { Devvit, KeyValueStorage, RedditAPIClient } from '@devvit/public-api';
import { CommentSubmit, Metadata, PostSubmit } from '@devvit/protos';

const keyValueStorage = new KeyValueStorage();
const reddit = new RedditAPIClient();

const cellFriendNameToCellIndex: string[] = [ "top left", "top middle", "top right", "middle left", "middle", "middle right", "bottom left", "bottom middle", "bottom right" ];
const initialPostBody = `|-|-|-|
| | | |
| | | |
| | | |`

const winConditions: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8]
];

// construct markdown table from raw board
function constructBoardRepresentation(board: number[]): string {
  var boardString = "|-|-|-|\n";
  for (var rowIndex = 0; rowIndex <= 6; rowIndex += 3) {
    boardString += `|${board[rowIndex + 0]}|${board[rowIndex + 1]}|${board[rowIndex + 2]}|`
  }
  return boardString.replace("-1", " ");
}

// check for no valid moves remaining
function isStalemate(board: number[]): boolean {
  return !board.some(cell => cell == -1)
}

// simple check to see if the board matches any of the win conditons for the supplied token
function playerHasWon(board: number[], token: number): boolean {
  return winConditions.some(winCondition => winCondition.every(cell => board[cell] == token));
}

// naively plays the first available cell
function playNaiveTicTacToeAlgorithm(board: number[], token: number): number[] {
  var nextPlayableCell = board.indexOf(-1);
  board[nextPlayableCell] == token;
  return board;
}

Devvit.addTrigger({
  event: Devvit.Trigger.PostSubmit,
  async handler(request: PostSubmit, metadata?: Metadata) {
    console.log("received new post!");
    var theRealPost = await reddit.getPostById(request.post!.id);

    if (request.post?.title != "play tictactoe") {
      console.log("this post is not a new game");

      await theRealPost.delete();
      return;
    }

    var gameState = await keyValueStorage.get<number[]>(request.author!.id);
    if (gameState != undefined) {
      console.log("the user tried to make a game, but one is already in progress!");

      await theRealPost.delete();
      return;
    }

    // prep the game board
    await keyValueStorage.put(request.author!.id, [-1, -1, -1, -1, -1, -1, -1, -1, -1]);

    // start new game
    // reply with the rules and how to play
    var replyBody = `Let's play tic-tac-toe. You'll be 'x,' and move first.
    You can issue a move by making a comment with any of the following cell names:
    ${cellFriendNameToCellIndex.join(", ")}
    It doesn't matter whether you leave a top comment, or reply to an existing comment.
    Each time you send a move, I'll update the body of the post with the current state of the board.
    `;

    await theRealPost.addComment({ text: replyBody });
    await theRealPost.edit({ text: initialPostBody });
  },
})


Devvit.addTrigger({
  event: Devvit.Trigger.CommentSubmit,
  async handler(request: CommentSubmit, metadata?: Metadata) {
    console.log("received new comment");
    var theRealComment = await reddit.getCommentById(request.comment!.id);

    if (request.author?.id != request.post?.authorId) {
      console.log("a rogue user appeared! deleting their comment.");

      await theRealComment.delete();
      return;
    }
  
    var gameState = await keyValueStorage.get<number[]>(request.author!.id);
    if (gameState == undefined) {
      console.log("the user doesn't have an active game");

      await theRealComment.delete();
      return;
    }

    var theCellIndex = cellFriendNameToCellIndex.indexOf(request.comment!.body);
    if (gameState[theCellIndex] != -1)
    {
      console.log("can't play that cell");

      await theRealComment.delete();
      return;
    }

    var theRealPost = await reddit.getPostById(request.post!.id);

    // play X
    gameState[theCellIndex] == 0;
    if (playerHasWon(gameState, 0)) {
      console.log("the player wins!");

      var theNewPostBody = `You win!
      ${constructBoardRepresentation(gameState)}`;
      await theRealPost.edit({ text: theNewPostBody });
      return;
    }

    // need to check for stalemate now
    if (isStalemate(gameState)) {
      console.log("stalemate");

      var theNewPostBody = `It's a stalemate. :(
      ${constructBoardRepresentation(gameState)}`;
      await theRealPost.edit({ text: theNewPostBody });
      return;
    }

    // make our play
    gameState = playNaiveTicTacToeAlgorithm(gameState, 1);

    // determine if win
    if (playerHasWon(gameState, 1)) {
      console.log("the ai wins!");

      var theNewPostBody = `The computer won!
      ${constructBoardRepresentation(gameState)}`;
      await theRealPost.edit({ text: theNewPostBody });
      return;
    }
  },
})

export default Devvit;
