const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

type Event {
    _id: ID!
    caption: String!
    date: String!
    image: String
    creator: User!
    comments: [Comment!]
    likedUsers: [User!]
}

type Comment {
    _id: ID!
    creator: User
    post: Event
    commentBody: String!
    likeUserId: ID
}
type User {
    _id: ID!
    username: String!
    bio: String
    profileImage: String
    name: String!
    email: String!
    mobile: String!
    password: String
    createdEvents: [Event!]
    comments: [Comment!]
    likedPosts: [Event!]
    followers: [User!]
    following: [User!]
}

type AuthData{
    userId: ID!
    token: String!
    tokenExpiration: Int!
}

input EventInput {
    caption: String!
    date: String!
    image: String
}

input UserInput {
    username: String!
    bio: String
    name: String!
    email: String!
    mobile: String!
    password: String
}

input ProfileInput {
    id: ID!
    name: String
    bio: String
    profileImage: String
}

input CommentInput {
    userId: ID!
    postId: ID!
    commentBody: String!
}

input LikeInput {
    userId: ID!
    postId: ID!
}

input FollowInput {
    userId: ID!
    followingId: ID!
}

input LikeComInput{
    userId: ID!
    commentId: ID!
}

type RootQuery {
   events : [Event!]!
   event(userId: ID!): [Event!]
   bookings: [Booking!]!
   booking(userId: ID!): Booking
   users : [User!]!
   user(userId: ID!): User!
   login(email: String!, password: String!): AuthData!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
    deleteEvent(eventId: ID!): Event!
    editProfile(profileInput: ProfileInput): User
    createComment(commentInput: CommentInput) : Comment
    addLike(likeInput: LikeInput) : Event
    removeLike(likeInput: LikeInput) : Event
    follow(followInput: FollowInput) : User
    unfollow(followInput: FollowInput) : User
    likeComment(likeComInput: LikeComInput) : Comment
    dislikeComment(likeComInput: LikeComInput) : Comment
    deleteComment(commentId: ID!) : Comment
}

schema {
      query: RootQuery,
      mutation: RootMutation
}
`);
