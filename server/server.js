const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const http = require("http");
const { makeExecutableSchema } = require("graphql-tools");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { loadFilesSync } = require("@graphql-tools/load-files");
const path = require("path");
const mongoose = require("mongoose");
const { authCheckMiddleware } = require("./helpers/auth");
const cors = require("cors");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");
require("dotenv").config();

const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, "./typeDefs"))
);
const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, "./resolvers"))
);

const app = express();

app.use(cors());
app.use(bodyParser.json());

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
  context: ({ req, res }) => ({ req, res }),
});

apolloServer.applyMiddleware({ app });

//const httpServer = http.createServer(app);

app.get("/rest", authCheckMiddleware, (req, res) => {
  res.json({
    data: "you hit rest endpoint",
  });
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.post("/uploadimages", authCheckMiddleware, (req, res) => {
  cloudinary.uploader.upload(
    req.body.image,
    (response) => {
      console.log(response);
      res.send({
        url: response.secure_url,
        public_id: response.public_id,
      });
    },
    {
      public_id: `${Date.now()}`, // public name,
      resource_type: "auto", // JPEG, PNG, SVG, etc...
    }
  );
});

app.post("/removeimage", authCheckMiddleware, (req, res) => {
  const imageId = req.body.public_id;

  cloudinary.uploader.destroy(imageId, (error, result) => {
    if (error) {
      return res.json({ success: false, error });
    } else {
      res.send("OK");
    }
  });
});

app.listen(process.env.PORT, () =>
  console.log(`Listening on Port: ${process.env.PORT}`)
);
