const express = require("express");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const cors = require("cors");
const { urlencoded } = require("express");
require("dotenv").config();
const userRouter = require("./routes/users");
const seriesRouter = require("./routes/series");
const trackerRouter = require("./routes/trackers");
const passport = require("passport");

const app = express();
const port = process.env.PORT || 7000;
require("./config/passport-setup")(passport);

app.use(cors());
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", userRouter);
app.use("/series", seriesRouter);
app.use("/tracker", trackerRouter);

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
