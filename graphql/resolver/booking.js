const booking = require("../../models/booking");
const Booking = require("../../models/booking");
const Event = require("../../models/event");

const { transformEvent } = require("./merge");
const { transformBooking } = require("./merge");
const { user } = require("./merge");
const { singleEvent } = require("./merge");
const { dateToString } = require("../../helpers/date");

module.exports = {
  bookings: async (args, req) => {
    // if (!req.isAuth){
    //   throw new Error('Unauthenticated');
    // }

    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },

  booking: async (args, req) => {
    // if (!req.isAuth){
    //   throw new Error('Unauthenticated');
    // }

    try {
      const bookings = await Booking.find({ user: args.userId });
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          _id: booking.id,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: dateToString(booking._doc.createdAt),
          updatedAt: dateToString(booking._doc.updatedAt),
        };
      });
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }

    try {
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        user: req.userId,
        event: fetchedEvent,
      });
      const result = await booking.save();
      return transformBooking(result);
    } catch (err) {
      throw err;
    }
  },

  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }

    try {
      // populate('event') replaces the event field's ObjectId(from Booking collection) with the actual document from the Event collection.
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
