const passport = require("passport");
const LocalStratergy = require("passport-local");
const GoogleStratergy = require("passport-google-oauth");

passport.use(new GoogleStratergy({}), () => {});
