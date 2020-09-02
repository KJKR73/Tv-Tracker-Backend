const mongoose = require("mongoose");
const express = require("express");
const Joi = require("@hapi/joi");
const { Series, validate_series } = require("../models/series.model");
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

module.exports = router;
