const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { User, validate_user_body } = require("../models/user.model");
const bcrypt = require("bcrypt");

// Create a new user
router.post("/signup", async (req, res) => {
  const { error } = validate_user_body(req.body);

  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  // Find the user if he already exits throw an error
  const user = await User.findOne({
    email: req.body.email,
    username: req.body.username,
  });

  if (user) {
    return res.status(400).json("The user with the credentials already exists");
  }

  // Encrypt the password
  const salt = await bcrypt.genSalt(10);

  // Encrypt the user passoword before saving to the database
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPass,
  });

  if (!user) {
    res.status(400).json("Error creating an id with these credentials");
  }

  // Else save the user
  user
    .save()
    .then(() => {
      res.json(user);
    })
    .catch(() => {
      res.status(500).json("Backend error occured");
    });
});
