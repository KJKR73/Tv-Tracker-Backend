const express = require("express");
const router = express.Router();
const {
  User,
  validate_user_body,
  validate_user,
} = require("../models/user.model");
const bcrypt = require("bcrypt");
const { issueJwt } = require("../utils/issue_jwt");
const passport = require("passport");
const { route } = require("./miscs");

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
    image: "null",
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

// Login here
router.post("/login", (req, res) => {
  const { username, email, password } = req.body;

  // Find the user if he exists
  User.findOne({ email })
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
      return res.status(200).json({
        success: true,
        user_id: user._id,
        token: token.token,
        username: user["username"],
      });
    })
    .catch((err) => {
      return res.status(500).send("Backend error occured");
    });
});

// Test route
router.get(
  "/test",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).send(req.user);
  }
);

router.post("/saveImage", async (req, res) => {
  const { error } = validate_user(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  // Get user
  const user = await User.findById(req.body.id);
  if (!user) {
    return res.status(400).json("User Not Found");
  }

  // Else add the user image
  User.findByIdAndUpdate(
    { _id: req.body.id },
    {
      image: req.body.image,
    }
  )
    .then((data) => res.status(200).json("success"))
    .catch((err) => console.log(err));
});

router.post("/getImage", async (req, res) => {
  const user = await User.findById(req.body.id);
  if (!user) {
    return res.status(400).json("User Not Found");
  }
  if (user.image == "") {
    return res.status(400).send("Invalid Image");
  }
  res.status(200).json(user.image);
});

router.post("/getUsername", async (req, res) => {
  const user = await User.findById(req.body.id);
  if (!user) {
    return res.status(400).json("User Not Found");
  }
  res.status(200).json(user.username);
});

module.exports = router;
