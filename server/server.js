const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const http = require("http");
const { makeExecutableSchema } = require("graphql-tools");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { loadFilesSync } = require("@graphql-tools/load-files");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, "./typeDefs"))
);
const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, "./resolvers"))
);

const app = express();

const db = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_CLOUD, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log("DB Connected");
  } catch (error) {
    console.log(`Mongoose connection error - ${error}`);
  }
};

db();

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
