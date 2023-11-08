const { sequelize } = require("../utils/db-config");
const { DataTypes } = require("sequelize");

const ForgotPasswordRequestModel = sequelize.define("ForgotPasswordRequests", {
  request_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = ForgotPasswordRequestModel;
