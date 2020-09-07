const { gql } = require("apollo-server-express");
const { posts } = require("../temp");
const { authCheck } = require("../helpers/auth");

const totalPosts = () => posts.length;
const allPosts = async (parentValue, args, { req }) => {
  await authCheck(req);
  return posts;
};
const newPost = (parentValue, args) => {
  //const { title, description } = args.input;

  const post = {
    id: posts.length++,
    ...args.input,
    //title,
    //description,
  };

  posts.push(post);

  return post;
};

module.exports = {
  Query: {
    totalPosts,
    allPosts,
  },
  Mutation: {
    newPost,
  },
};
