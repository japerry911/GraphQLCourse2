const express = require("express");
require("dotenv").config();

const app = express();

app.get("/rest", (req, res) => {
  res.json({
    data: "you hit rest endpoint",
  });
});

app.listen(process.env.PORT, () =>
  console.log(`Listening on Port: ${process.env.PORT}`)
);
