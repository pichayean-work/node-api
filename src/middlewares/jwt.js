const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  if (!req.headers["authorization"]) {
    res.status(401).end();
    return;
  }
  const authToken = req.headers["authorization"];

  try {
    jwt.verify(authToken, "SECRET");
    next();
  } catch (e) {
    res.status(403).end();
    return;
  }
};
