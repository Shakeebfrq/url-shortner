const express = require("express");
const router = require("./routes/url");
const mongoose = require("mongoose");

const app = express();

const DB =
  "mongodb+srv://Shakeebfrq:895148@cluster0.iud3hlr.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connected");
  })
  .catch(() => {
    console.log("error");
  });

app.use(express.json());

app.use("/url", router);

app.use("/", router);

PORT = 3000;
app.listen(PORT, () => {
  console.log("server running on PORT 3000");
});
