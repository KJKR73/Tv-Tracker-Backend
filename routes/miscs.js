const mongoose = require("mongoose");
const express = require("express");
const Joi = require("@hapi/joi");
const { Series, validate_series } = require("../models/series.model");
const {
  Tracker,
  validate_tracker,
  validate_initialize_tracker,
  validate_update_tracker,
} = require("../models/tracker.model");
const router = express.Router();

router.post("/getimage", async (req, res) => {
  const { error } = validate_image_body(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }

  const series = await Series.findById(req.body.series_id);
  if (!series) {
    return res.status(400).send("Series not found");
  }

  res.status(200).json(series.cover);
});

function validate_image_body(body) {
  const schema = Joi.object({
    series_id: Joi.string().required(),
  });
  return schema.validate(body);
}

router.post("/getPieData", async (req, res) => {
  const tracker = await Tracker.findById(req.body.id);
  if (!tracker) {
    return res.status(400).send("Error Loading data");
  }

  // Collect the data
  const watching_data_len = tracker.watching.length;
  const dropped_data_len = tracker.dropped.length;
  const completed_data_len = tracker.completed.length;

  const total = watching_data_len + dropped_data_len + completed_data_len;

  var watching_per = (watching_data_len / total) * 100;
  var dropped_per = (dropped_data_len / total) * 100;
  var completed_per = (completed_data_len / total) * 100;

  var dataArray = [];
  dataArray.push({
    name: "Watching",
    percent: watching_per,
  });
  dataArray.push({
    name: "Dropped",
    percent: dropped_per,
  });
  dataArray.push({
    name: "Completed",
    percent: completed_per,
  });

  res.status(200).send(dataArray);
});

module.exports = router;
