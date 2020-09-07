const { gql } = require("apollo-server-express");
const { authCheck } = require("../helpers/auth");

const me = async (parentValue, args, { req, res }) => {
  await authCheck(req);
  return "Skylord";
};

module.exports = {
  Query: {
    me,
  },
};
