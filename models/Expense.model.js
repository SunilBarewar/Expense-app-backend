const { Schema, model } = require("mongoose");

const ExpenseSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    desc: String,
    amount: {
      type: Number,
      default: 0,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("Expense", ExpenseSchema);
