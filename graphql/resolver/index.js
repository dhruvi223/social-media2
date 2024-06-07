const authResover = require("./auth");
const bookingResover = require("./booking");
const eventResover = require("./events");
const commentResolver = require("./comment");

const rootResolver = {
  ...authResover,
  ...bookingResover,
  ...eventResover,
  ...commentResolver,
};

module.exports = rootResolver;
