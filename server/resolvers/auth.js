const { gql } = require("apollo-server-express");
const { authCheck } = require("../helpers/auth");
const User = require("../models/user");
const shortid = require("shortid");

const profile = async (parentValue, args, { req, res }) => {
  const currentUser = await authCheck(req);
  return await User.findOne({ email: currentUser.email }).exec();
};

const userCreate = async (parentValue, args, { req }) => {
  const currentUser = await authCheck(req);
  const user = await User.findOne({ email: currentUser.email });
  return user
    ? user
    : new User({
        email: currentUser.email,
        username: shortid.generate(),
      }).save();
};

const userUpdate = async (parentValue, args, { req }) => {
  const currentUser = await authCheck(req);
  return await User.findOneAndUpdate(
    { email: currentUser.email },
    { ...args.input },
    { new: true }
  ).exec();
};

module.exports = {
  Query: {
    profile,
  },
  Mutation: {
    userCreate,
    userUpdate,
  },
};
