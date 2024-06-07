const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({

    username:{
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String    
    },
    name : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage :{
        type: String
    },
    createdEvents: [
        {
            type: Schema.Types.ObjectId,
            ref: "Event"
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],

    likedPosts: [ // posts liked by users
        {
            type: Schema.Types.ObjectId,
            ref: "Event"
        }
    ], 
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    likedComments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

userSchema.index({ username: 1 }, { unique: true });

userSchema.pre('save', function (next) {
    const user = this;
    user.likedComments = [...new Set(user.likedComments.map(comment => comment.toString()))];
    user.followers = [...new Set(user.followers.map(follower => follower.toString()))];
    user.following = [...new Set(user.following.map(following => following.toString()))];
    user.likedPosts = [...new Set(user.likedPosts.map(post => post.toString()))];
    user.comments = [...new Set(user.comments.map(comment => comment.toString()))];
    user.createdEvents = [...new Set(user.createdEvents.map(event => event.toString()))];
  
    next();
  });

module.exports = mongoose.model("User", userSchema);