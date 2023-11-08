const jwt = require("jsonwebtoken");

const generateAccessToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET_KEY);
};

module.exports = generateAccessToken;
