const Razorpay = require("razorpay");
const shortid = require("shortid");
const Order = require("../models/Order.model");
const User = require("../models/User.model");
const generateAccessToken = require("../utils/generateAccessToken");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const purchasePremiumMembership = async (req, res) => {
  const amount = 100 * 50;
  const currency = "INR";

  const options = {
    amount,
    currency,
    receipt: shortid.generate(),
  };
  const { _id } = req.user;
  try {
    const order = await razorpay.orders.create(options);
    await new Order({ userId: _id, order_id: order.id }).save();
    return res.status(200).json({
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(403).json(error.message);
  }
};

const updatePaymentAndMembershipStatus = async (req, res) => {
  const { order_id, payment_id, payment_status } = req.body;
  const { _id } = req.user;
  try {
    await Order.findOneAndUpdate(
      { order_id: order_id },
      { payment_id, payment_status }
    );
    const isPremium = payment_status === "successful";
    const token = generateAccessToken({ userId: _id, isPremium });
    if (isPremium) {
      await User.findByIdAndUpdate(_id, { isPremium: true });
    }
    return res.status(200).json({ token, isPremium });
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

module.exports = {
  purchasePremiumMembership,
  updatePaymentAndMembershipStatus,
};
