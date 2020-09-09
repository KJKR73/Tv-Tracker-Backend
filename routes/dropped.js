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

// Drop the current series in the tracker
router.post("/dropSeries", async (req, res) => {
  const tracker = await Tracker.findById(req.body.id);
  if (!tracker) {
    return res.status(400).json("Invalid Tracker");
  }

  // Check if the series is preset in the tracker watching list
  var _check = false;
  tracker.watching.forEach((element) => {
    if (element._id == req.body.s_id) {
      _check = true;
    }
  });

  if (!_check) {
    return res.status(200).json("The series does not exist in your tracker");
  }

  // Check if the series already exist the dropped list
  var _check_drop = false;
  if (tracker.dropped != []) {
    tracker.dropped.forEach((element) => {
      if (element._id == req.body.s_id) {
        _check_drop = true;
      }
    });
  }

  if (_check_drop) {
    return res
      .status(400)
      .json("The series already exits in your drop list please delete it");
  }

  // Remove the tracker and add it to the dropped list
  var obj = tracker.watching.find((obj) => obj["_id"] == req.body.s_id);
  var new_watching = tracker.watching.filter(
    (obj) => obj["_id"] != req.body.s_id
  );

  var drop_obj = {
    _id: obj["_id"],
    name: obj["name"],
    total: obj["total"],
    last: obj["current"],
    date: Date.now(),
  };

  // Save the data
  Tracker.findByIdAndUpdate(
    { _id: req.body.id },
    {
      watching: new_watching,
      $push: {
        dropped: drop_obj,
      },
    }
  )
    .then((data) => res.status(200).send("success"))
    .catch((err) => console.log(err));
});

module.exports = router;
