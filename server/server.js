const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const http = require("http");
require("dotenv").config();

const app = express();

const typeDefs = `
  type Query {
    totalPosts: Int!
  }  
`;

const resolvers = {
  Query: {
    totalPosts: () => 42,
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

apolloServer.applyMiddleware({ app });

const httpServer = http.createServer(app);

app.get("/rest", (req, res) => {
  res.json({
    data: "you hit rest endpoint",
  });
});

app.listen(process.env.PORT, () =>
  console.log(`Listening on Port: ${process.env.PORT}`)
);
