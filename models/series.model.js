const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const seriesSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true,
  },
  total: {
    type: String,
    default: "?",
  },
  cover: {
    type: String,
    default: "",
  },
  season: {
    type: String,
    default: "1",
  },
  synopsis: {
    type: String,
  },
});

const Series = mongoose.model("Series", seriesSchema);

function validate_series(data) {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    total: Joi.string(),
    cover: Joi.string(),
    season: Joi.string(),
    synopsis: Joi.String(),
  });
  return schema.validate(data);
}

exports.Series = Series;
exports.validate_series = validate_series;
