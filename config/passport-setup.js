const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { User } = require("../models/user.model");
const { function } = require("@hapi/joi");

// Define the options
const config_options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
};

// Config passport here
const strategy = new JwtStrategy(config_options, (jwt_payload, done) => {
  User.findOne({ _id: jwt_payload.sub }, function (err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
});

module.exports = (passport) => {
  passport.use(strategy);
};
