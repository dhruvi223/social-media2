const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  caption: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comments:[
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    }
  ],
  likedUsers:[  // users who liked posts
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  ]

});

eventSchema.pre('save', function (next) {
  const user = this;
  user.likedUsers = [...new Set(user.likedUsers.map(user => user.toString()))];
  user.comments = [...new Set(user.comments.map(comment => comment.toString()))];
  next();
});


module.exports = mongoose.model("Event", eventSchema);
