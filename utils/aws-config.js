const AWS = require("aws-sdk");

module.exports = new AWS.S3({
  accessKeyId: process.env.IAM_AWS_ACCESS_KEY,
  secretAccessKey: process.env.IAM_AWS_SECRET_KEY,
});
