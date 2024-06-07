const Event = require("../../models/event");
const User = require("../../models/user");
const Comment = require("../../models/comment");

const { dateToString } = require("../../helpers/date");
const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const comments = async (commentIds) => {
  try {
    const comments = await Comment.find({ _id: { $in: commentIds } });
    return comments.map((comment) => {
      return {
        ...comment._doc,
        _id: comment.id,
        commentBody: comment.commentBody,
        creator: user.bind(this, comment.creator),
        post: singleEvent.bind(this, comment.post),
      };
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return transformUser(user);
  } catch (err) {
    throw err;
  }
};

const multipleusers = async (userIds) => {
  try {
    const users = await User.find({ _id: { $in: userIds } });
    return users.map((user) => {
      return transformUser(user);
    });
  } catch (err) {
    throw err;
  }
};

const transformEvent = async (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator),
    comments: comments.bind(this, event._doc.comments),
    likedUsers: multipleusers.bind(this, event._doc.likedUsers),
  };
};

const transformUser = async (oneuser) => {
  return {
    ...oneuser._doc,
    _id: oneuser.id,
    createdEvents: events.bind(this, oneuser._doc.createdEvents),
    comments: comments.bind(this, oneuser._doc.comments),
    likedPosts: events.bind(this, oneuser._doc.likedPosts),
    followers: multipleusers.bind(this, oneuser._doc.followers),
    following: multipleusers.bind(this, oneuser._doc.following),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.user = user;
exports.singleEvent = singleEvent;
exports.events = events;
exports.comments = comments;
exports.multipleusers = multipleusers;
exports.transformUser = transformUser;
