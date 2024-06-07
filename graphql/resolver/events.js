const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("./merge");

//upload image
const FormData = require("form-data");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },

  event: async (args) => {
    try {
      const events = await Event.find({ creator: args.userId });
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },

  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }

    const event = new Event({
      caption: args.eventInput.caption,
      date: new Date(args.eventInput.date),
      image: args.eventInput.image,
      creator: req.userId,
    });

    try {
      let createdEvent;

      const result = await event.save();
      createdEvent = transformEvent(result);
      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new error("user not found");
      }
      creator.createdEvents.push(event);
      await creator.save();
      return createdEvent;
    } catch (err) {
      throw err;
    }
  },

  deleteEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }

    try {
      const event = await Event.findById(args.eventId);
      await Event.deleteOne({ _id: args.eventId });
      return transformEvent(event);
    } catch (err) {
      throw err;
    }
  },

  addLike: async (args, req) => {
    // if (!req.isAuth){
    //   throw new Error('Unauthenticated');
    // }

    const event = await Event.findById(args.likeInput.postId);
    const user = await User.findById(args.likeInput.userId);
    event.likedUsers.push(user);
    await event.save();

    user.likedPosts.push(event);
    await user.save();

    return event;
  },

  removeLike: async (args, req) => {
    // if (!req.isAuth){
    //   throw new Error('Unauthenticated');
    // }
    const event = await Event.findById(args.likeInput.postId);
    const user = await User.findById(args.likeInput.userId);
    event.likedUsers.pull(user);
    await event.save();
    user.likedPosts.pull(event);
    await user.save();
    return event;
  },
};
