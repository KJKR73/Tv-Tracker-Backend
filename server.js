const express = require("express");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAB_DB_URI;

// connect to mongoose here/////////////////////////////
mongoose.connect(uri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connected to MongoDB Cluster(AWS) successfully.....");
});
///////////////////////////////////////////////////////

// start the server here
app.listen(port, () => {
  console.log(`Listening on localhost:${port}....`);
});