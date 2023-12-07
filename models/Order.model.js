const { Schema, model } = require("mongoose");

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    order_id: String,
    payment_id: String,
    payment_status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = model("Order", OrderSchema);

// const { DataTypes } = require("sequelize");

// const { sequelize } = require("../utils/db-config");

// const OrderModel = sequelize.define("orders", {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     allowNull: false,
//     autoIncrement: true,
//   },
//   order_id: DataTypes.STRING,
//   payment_id: DataTypes.STRING,
//   payment_status: {
//     type: DataTypes.STRING,
//     defaultValue: "pending",
//   },
// });

// module.exports = OrderModel;
