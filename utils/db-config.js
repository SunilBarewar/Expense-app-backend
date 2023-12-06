const { connect } = require("mongoose");

const connectDB = (callback) => {
  connect(process.env.MONGO_DB_URL)
    .then(() => {
      callback();
    })
    .catch((error) => console.log(error));
};

module.exports = connectDB;
