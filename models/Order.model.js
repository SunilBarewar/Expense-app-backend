const { DataTypes } = require("sequelize");

const { sequelize } = require("../utils/db-config");

const OrderModel = sequelize.define("orders", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  order_id: DataTypes.STRING,
  payment_id: DataTypes.STRING,
  payment_status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
});

module.exports = OrderModel;
