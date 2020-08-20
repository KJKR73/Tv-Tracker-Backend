const jwt = require("jsonwebtoken");

module.exports.issueJwt = (user) => {
  const _id = user._id;
  const expiresIn = "1d";
  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: expiresIn,
  });

  return {
    token: "Bearer " + token,
    expiresIn: expiresIn,
  };
};
