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

  dropped: [
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
      last: {
        type: Number,
        default: 0,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],

  completed: [
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
      date: {
        type: Date,
        default: Date.now(),
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

function validate_update_tracker(data) {
  const schema = Joi.object({
    id: Joi.string().required(),
    s_id: Joi.string().required(),
    name: Joi.string(),
    total: Joi.string(),
    current: Joi.number(),
  });
  return schema.validate(data);
}

exports.Tracker = Tracker;
exports.validate_tracker = validate_tracker;
exports.validate_initialize_tracker = validate_initialize_tracker;
exports.validate_update_tracker = validate_update_tracker;
