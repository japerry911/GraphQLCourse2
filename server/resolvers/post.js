const { gql } = require("apollo-server-express");
const { posts } = require("../temp");

const totalPosts = () => posts.length;
const allPosts = () => posts;
const newPost = (parentValue, args) => {
  const post = {
    id: posts.length++,
    ...args,
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
