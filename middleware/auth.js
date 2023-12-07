const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const authenticate = async (req, res, next) => {
  try {
    const authorizationToken = req.header("Authorization");
    const data = jwt.verify(authorizationToken, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(data.userId);
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "you are not authenticated to access this service" });
  }
};

module.exports = authenticate;
