const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
  },
  commentBody: {
    type: String,
  },
  likeUserId: [
    {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
]

});

commentSchema.pre('save', function (next) {
  const user = this;
  user.likeUserId = [...new Set(user.likeUserId.map(user => user.toString()))];

  next();
});


module.exports = mongoose.model("Comment", commentSchema);
