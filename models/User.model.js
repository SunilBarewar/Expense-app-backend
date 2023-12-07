const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  totalExpense: {
    type: Number,
    default: 0,
  },
});

UserSchema.methods.updateTotalExpense = function (updatedTotalExpense) {
  this.totalExpense = updatedTotalExpense;
  return this.save();
};

module.exports = model("User", UserSchema);
