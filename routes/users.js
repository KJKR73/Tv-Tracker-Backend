const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");
const { User, validate_user_body } = require("../models/user.model");
const bcrypt = require("bcrypt");

// Create a new user
Router.post("/signup", async (req, res) => {
  const { error } = validate_user_body(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Find the user if he already exits throw an error
  const user = User.findOne({
    email: req.body.email,
    username: req.body.username,
  });

  if (user) {
    return res.status(400).send("The user with the credentials already exists");
  }

  // Else create a new user

  // Encrypt the password
  const salt = await bcrypt.genSalt();

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
});
