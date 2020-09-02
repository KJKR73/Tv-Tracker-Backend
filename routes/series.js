const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Series, validate_series } = require("../models/series.model");
const { compareSync } = require("bcrypt");

router.post("/add", async (req, res) => {
  const { error } = validate_series(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if the series already exists
  const series = await Series.findOne({ name: req.body.name });
  if (series) {
    return res.status(400).send("The series already exists");
  }

  // Else create a new series
  const newSeries = new Series(req.body);
  newSeries
    .save()
    .then((ser) => res.status(200).send(ser))
    .catch((err) => console.log(err));
});

router.post("/search", async (req, res) => {
  // User will search here and send the keyword in the body
  const result = await Series.find({ name: new RegExp(req.body.query, "i") });
  if (!result) {
    return res.status(200).send("No Results Found");
  }

  return res.status(200).send(result);
});

router.get("/getall", async (req, res) => {
  const result = await Series.find({});
  if (!result) {
    return res.status(400).send("Backend Problem");
  }
  res.status(200).send(result);
});

module.exports = router;
