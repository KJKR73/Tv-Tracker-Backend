const express = require("express");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const cors = require("cors");
const { urlencoded } = require("express");
require("dotenv").config();
const userRouter = require("./routes/users");
const seriesRouter = require("./routes/series");
const watchingRouter = require("./routes/watching");
const completedRouter = require("./routes/completed");
const droppedRouter = require("./routes/dropped");
const miscRouter = require("./routes/miscs");
const passport = require("passport");

const app = express();
const port = process.env.PORT || 7000;
require("./config/passport-setup")(passport);

app.use(cors());
app.use(passport.initialize());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/user", userRouter);
app.use("/series", seriesRouter);
app.use("/tracker/watching", watchingRouter);
app.use("/tracker/completed", completedRouter);
app.use("/tracker/dropped", droppedRouter);
app.use("/misc", miscRouter);

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
