const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const trackerSchema = mongoose.Schema({
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
      current: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const Tracker = mongoose.model("Tracker", trackerSchema);

function validate_tracker(data) {
  const schema = Joi.object({
    id: Joi.string().required(),
    s_id: Joi.string().required(),
  });
  return schema.validate(data);
}

function validate_initialize_tracker(data) {
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  return schema.validate(data);
}

exports.Tracker = Tracker;
exports.validate_tracker = validate_tracker;
exports.validate_initialize_tracker = validate_initialize_tracker;
