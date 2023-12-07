const { Schema, model } = require("mongoose");

const ForgotPasswordRequestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Forgotpassrequest", ForgotPasswordRequestSchema);
