const bcrypt = require("bcryptjs");
const User = require("../../models/user"); // database collection for users
const jwt = require("jsonwebtoken");
const { transformUser } = require("./merge");

module.exports = {
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User exist already");
      }

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        username: args.userInput.username,
        name: args.userInput.name,
        email: args.userInput.email,
        mobile: args.userInput.mobile,
        password: hashedPassword,
      });
      const result = await user.save();
      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  users: async () => {
    try {
      const users = await User.find();
      return users.map((oneuser) => {
        return transformUser(oneuser);
      });
    } catch (err) {
      throw err;
    }
  },

  user: async (args) => {
    try {
      const user = await User.findById(args.userId);
      return transformUser(user);
    } catch (err) {
      throw err;
    }
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist");
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect");
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "somesupersecretkey",
      {
        expiresIn: "1h",
      }
    );
    return { userId: user.id, token: token, tokenExpiration: 5 };
  },

  editProfile: async (args) => {
    const user = await User.findById(args.profileInput.id);

    const user2 = await User.findByIdAndUpdate(args.profileInput.id, {
      bio: args.profileInput.bio,
      name: args.profileInput.name,
      profileImage: args.profileInput.profileImage,
    });

    return user2;
  },

  follow: async (args, req) => {
    // if (!req.isAuth){
    //   throw new Error('Unauthenticated');
    // }
    const follower = await User.findById(args.followInput.userId);
    const following = await User.findById(args.followInput.followingId);
    follower.following.push(following);
    following.followers.push(follower);
    await follower.save();
    await following.save();
    return following;
  },

  unfollow: async (args, req) => {
    // if (!req.isAuth){
    //   throw new Error('Unauthenticated');
    // }
    const follower = await User.findById(args.followInput.userId);
    const following = await User.findById(args.followInput.followingId);
    follower.following.pull(following);
    following.followers.pull(follower);
    await follower.save();
    await following.save();
    return following;
  },
};
