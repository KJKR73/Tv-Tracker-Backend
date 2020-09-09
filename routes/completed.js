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

router.post("/add_to_completed", async (req, res) => {
  const { error } = validate_tracker(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if tracker is preset
  var tracker = await Tracker.findById(req.body.id);
  if (!tracker) {
    return res.status(400).json("Invalid Tracker id");
  }

  // Check if series is present
  var series = await Series.findById(req.body.s_id);
  if (!series) {
    return res.status(400).json("Series id invalid");
  }

  // Else push the series to the completed list
  var obj = tracker.watching.find((obj) => obj["_id"] == req.body.s_id);
  var new_watching = tracker.watching.filter(
    (obj) => obj["_id"] != req.body.s_id
  );
  var comp_obj = {
    _id: series._id,
    name: obj["name"],
    total: obj["total"],
    date: Date.now(),
  };
  await Tracker.findByIdAndUpdate(
    { _id: req.body.id },
    {
      watching: new_watching,
      $push: {
        completed: comp_obj,
      },
    }
  )
    .then((data) => res.status(200).json("success"))
    .catch((err) => console.log(err));
});

router.post("/get_completed", async (req, res) => {
  const tracker = await Tracker.findById(req.body.id);
  if (!tracker) {
    return res.status(400).send("Tracker does not exit");
  }
  res.status(200).json(tracker.completed);
});

module.exports = router;
