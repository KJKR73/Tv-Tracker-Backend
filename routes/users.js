const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { User, validate_user_body } = require("../models/user.model");
const bcrypt = require("bcrypt");
const { issueJwt } = require("../utils/issue_jwt");

// Create a new user
router.post("/register", async (req, res) => {
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

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPass,
  });

  if (!newUser) {
    return res.status(400).json("Error creating an id with these credentials");
  }
  console.log(newUser);

  // Else save the user
  newUser
    .save()
    .then((user) => {
      return res.status(200).json({ success: true, user: user });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json("Backend error occured");
    });
});

router.post("/login", (req, res) => {
  const { username, email, password } = req.body;

  // Find the user if he exists
  User.findOne({ username, email })
    .then(async (user) => {
      if (!user) {
        return res.status(500).json({
          err: "The user does not exist or credientials are incorrect",
        });
      }

      // if user is present check the credentails
      const validateUser = await bcrypt.compare(password, user.password);
      console.log(validateUser);
      if (!validateUser) {
        return res.status(500).json("Invalid username or password");
      }

      // issue the token else
      const token = issueJwt(user);
      return res.status(200).json({ success: true, token: token });
    })
    .catch((err) => {
      return res.status(500).send("Backend error occured");
    });
});

module.exports = router;
