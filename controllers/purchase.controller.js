const Razorpay = require("razorpay");
const shortid = require("shortid");
const OrderModel = require("../models/Order.model");
const UserModel = require("../models/User.model");
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
  const { userId } = req.user;
  try {
    const order = await razorpay.orders.create(options);
    await OrderModel.create({ userId, order_id: order.id });
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
  const { userId } = req.user;
  try {
    await OrderModel.update(
      { payment_id, payment_status },
      {
        where: {
          order_id: order_id,
        },
      }
    );
    const isPremium = payment_status === "successful";
    const token = generateAccessToken({ userId, isPremium });
    if (isPremium) {
      await UserModel.update({ isPremium: true }, { where: { id: userId } });
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
