const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const authorizationToken = req.header("Authorization");
    const user = jwt.verify(authorizationToken, process.env.JWT_SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "you are not authenticated to access this service" });
  }
};

module.exports = authenticate;
