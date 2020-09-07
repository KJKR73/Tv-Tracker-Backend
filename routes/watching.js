const express = require("express");
const router = express.Router();
const {
  Tracker,
  validate_tracker,
  validate_initialize_tracker,
  validate_update_tracker,
} = require("../models/tracker.model");
const { User } = require("../models/user.model");
const passport = require("passport");
const { Series } = require("../models/series.model");

// Intit the user ////////////////////////////////////////////////////////////////////
router.post("/initializeUserTracker", async (req, res) => {
  const { error } = validate_initialize_tracker(req.body);
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
  var result = false;
  if (tracker.watching.length > 0) {
    tracker.watching.forEach((element) => {
      if (element["_id"] == req.body.s_id) {
        result = true;
      }
    });
  }

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
    .then((ans) => res.status(200).send("success"))
    .catch((err) => res.status(400).send(err));
});
//////////////////////////////////////////////////////////////////////////////////////

// GET the tracker of the user ///////////////////////////
router.post("/getracker", async (req, res) => {
  const result = await Tracker.findById(req.body.id);
  if (!result) {
    return res.status(400).send("Tracker does not exit");
  }

  res.status(200).json(result);
});
/////////////////////////////////////////////////////////

//Update the tracker//////////////////////////////////////////////////////////
router.post("/update", async (req, res) => {
  const { error } = validate_update_tracker(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  const tracker = await Tracker.findById(req.body.id);
  if (!tracker) {
    return res.status(400).json("Backend Error");
  }

  // Check if the series is present in tracker
  var result = false;
  if (tracker.watching.length > 0) {
    tracker.watching.forEach((element) => {
      if (element["_id"] == req.body.s_id) {
        result = true;
      }
    });
  }

  if (!result) {
    return res.status(400).send("The series does not exists in your tracker");
  }

  // update the tracke else
  const index = tracker.watching.findIndex(
    (obj) => obj["_id"] == req.body.s_id
  );
  var obj = tracker.watching.find((obj) => obj["_id"] == req.body.s_id);
  const newObj = {
    _id: obj._id,
    name: req.body.name,
    total: req.body.total,
    current: req.body.current,
  };

  var trackerList = tracker.watching;
  trackerList[index] = newObj;

  // update tracker
  await Tracker.findByIdAndUpdate(
    { _id: req.body.id },
    {
      watching: trackerList,
    }
  )
    .then((data) => res.status(200).json("success"))
    .catch((err) => console.log(err));
});
//////////////////////////////////////////////////////////////////////////////

module.exports = router;
