const express = require("express");
const router = express.Router();
const { Tracker, validate_tracker } = require("../models/tracker.model");
const { User } = require("../models/user.model");
const passport = require("passport");
const { Series } = require("../models/series.model");

// Intit the user ////////////////////////////////////////////////////////////////////
router.post("/initializeUserTracker", async (req, res) => {
  const { error } = validate_tracker(req.body);
  if (error) {
    return res.status(400).send("Invalid Detail Entered");
  }

  const tracker = await Tracker.findOne({ _id: req.body.id });

  if (tracker) {
    return res.status(500).send("The user already exists");
  }

  // Verify if the object id actually exits
  const user = await User.findOne({ _id: req.body.id });

  // Create the new series here
  const newTracker = new Tracker({
    _id: user._id,
  });

  newTracker.save().then((tracker) => res.status(200).send(tracker));
});
//////////////////////////////////////////////////////////////////////////////////////

// Add new series ////////////////////////////////////////////////////////////////////
router.post("/addNewSeries", async (req, res) => {
  const { error } = validate_tracker(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if the user exits
  const user = await User.findOne({ _id: req.body.id });
  if (!user) {
    return res.status(400).send("The user does not exit");
  }

  // Retrieve the data for the series selected during search
  const series = await Series.findOne({ _id: req.body.s_id });
  if (!series) {
    return res.status(400).send("The series does not exist");
  }

  const tracker = await Tracker.findOne({ _id: req.body.id });
  if (!tracker) {
    return res.status(400).send("The user has not created a tracker yet");
  }

  // Check if the series already exist
  const result = tracker.watching.filter(
    (series) => series._id != req.body.s_id
  );
  if (result) {
    return res.status(400).send("The series already exists in your tracker");
  }

  // If user exist add his/her series
  const add_new = {
    _id: series._id,
    name: series.name,
    total: series.total,
  };

  Tracker.findOneAndUpdate(
    { _id: req.body.id },
    {
      $push: {
        watching: add_new,
      },
    }
  )
    .then((ans) => res.status(200).send(ans))
    .catch((err) => res.status(400).send(err));
});
//////////////////////////////////////////////////////////////////////////////////////

module.exports = router;
