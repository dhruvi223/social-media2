const User = require("../../models/user"); // database collection for users
const Comment = require("../../models/comment");
const Event = require("../../models/event");
const { user } = require("./merge");
const { singleEvent } = require("./merge");

module.exports = {
  likeComment: async (args, req) => {
    // if (!req.isAuth){
    //   throw new Error('Unauthenticated');
    // }
    const comment = await Comment.findById(args.likeComInput.commentId);
    const user = await User.findById(args.likeComInput.userId);
    comment.likeUserId.push(user);
    await comment.save();

    user.likedComments.push(comment);
    await user.save();

    return comment;
  },

  dislikeComment: async (args, req) => {
    // if (!req.isAuth){
    //   throw new Error('Unauthenticated');
    // }
    const comment = await Comment.findById(args.likeComInput.commentId);
    const user = await User.findById(args.likeComInput.userId);
    comment.likeUserId.pull(user);
    await comment.save();
    user.likedComments.pull(comment);
    await user.save();
    return comment;
  },

  createComment: async (args, req) => {
    // if (!req.isAuth){
    //   throw new Error('Unauthenticated');
    // }
    const comment = new Comment({
      creator: args.commentInput.userId,
      post: args.commentInput.postId,
      commentBody: args.commentInput.commentBody,
    });

    try {
      let createdComment;

      const comment2 = await comment.save();
      createdComment = {
        ...comment2._doc,
        _id: comment2._id,
        commentBody: comment2.commentBody,
        creator: user.bind(this, args.commentInput.userId),
        post: singleEvent.bind(this, args.commentInput.postId),
      };

      const creator = await User.findById(args.commentInput.userId);
      if (!creator) {
        throw new error("user not found");
      }
      creator.comments.push(comment);
      await creator.save();

      const post = await Event.findById(args.commentInput.postId);
      if (!post) {
        throw new error("post not found");
      }
      post.comments.push(comment);
      await post.save();
      return createdComment;
    } catch (err) {
      throw err;
    }
  },

  deleteComment: async (args, req) => {
    // if (!req.isAuth){
    //   throw new Error('Unauthenticated');
    // }
    const comment = await Comment.findById(args.commentId);
    if (!comment) {
      throw new Error("comment not found");
    }

    const creator = await User.findById(comment.creator);
    // if (creator.id !== req.userId) {
    //     throw new Error("unauthorized");
    // }

    //deleting comment
    const result = await Comment.deleteOne({ _id: args.commentId });

    //removing comment from creater
    creator.comments.pull(comment);
    await creator.save();

    //removing comment from post
    const post = await Event.findById(comment.post);
    post.comments.pull(comment);
    await post.save();

    //removing comment from likedComments array of user if present
    if (comment.likeUserId.length > 0) {
      const user = await User.findById(comment.likeUserId);
      user.likedComments.pull(comment);
      await user.save();
    }

    return result;
  },
};
