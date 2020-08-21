const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    maxlength: 30,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 100,
    required: true,
  },
  password: {
    type: String,
    minlength: 4,
    required: true,
    trim: true,
  },
});

const User = mongoose.model("User", userSchema);

function validate_user_body(data) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().min(5).max(100).required(),
    password: Joi.string().min(4).max(20).required(),
  });
  return schema.validate(data);
}

exports.User = User;
exports.validate_user_body = validate_user_body;
