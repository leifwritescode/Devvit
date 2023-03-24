import { Comment, Devvit, KeyValueStorage, RedditAPIClient } from '@devvit/public-api';
import { CommentSubmit, Metadata, PostSubmit } from '@devvit/protos';

const reddit = new RedditAPIClient();

const honkingGreatRegex: string = "";

async function honkQuestionMarkExclamationPoint(comment: Comment) {

}

async function honkQuestionMark(comment: Comment) {
  var parentId = comment.parentId;
  if (parentId.startsWith("t1_")) {
    return await honkQuestionMarkExclamationPoint(comment);
  }

  var parent = await reddit.getCommentById(parentId);
  if (parent.authorName != "my current author name") {
    // if the parent is a comment, and it wasn't made by us, then we're not interested.
    return;
  }

  switch (comment.body) {
    case "good bot":
      comment.reply({ text: "_honks seductively_" });
      break;
    case "bad bot":
      comment.reply({ text: "_hissssssss_" });
      break;
    default:
      break;
  }
}

Devvit.addTrigger({
  event: Devvit.Trigger.CommentSubmit,
  async handler(request: CommentSubmit, Metadata?: Metadata) {
    console.log("received new comment");
    var theComment = await reddit.getCommentById(request.comment!.id);
    await honkQuestionMark(theComment);
  }
});

export default Devvit;
