const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const seriesSchema = mongoose.Schema({
  watching: [
    {
      name: {
        type: String,
        maxlength: 200,
        required: true,
      },
      total: {
        type: String,
        default: "?",
      },
      watched: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const Series = mongoose.model("Series", seriesSchema);

function validate_series(data) {
  const schema = Joi.object({
    name: Joi.string().max(200).required(),
    total: Joi.string().max(200),
    watched: Joi.number(),
  });
  return schema.validate(data);
}

exports.Series = Series;
exports.validate_series = validate_series;
