const Expense = require("../models/Expense.model");
const User = require("../models/User.model");
const shortid = require("shortid");
const uploadToS3 = require("../service/uploadToS3");

exports.getUsersWithTotalExpenses = async (req, res) => {
  const { isPremium } = req.user;
  if (!isPremium)
    return res
      .status(403)
      .json({ message: "Access Forbidden! , you aren't the premium user" });

  try {
    const result = await User.find({})
      .select("name totalExpense")
      .sort({ totalExpense: -1 });
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

exports.generateReportOfExpenses = async (req, res) => {
  const { isPremium, _id } = req.user;
  if (!isPremium)
    return res
      .status(403)
      .json({ message: "Access Forbidden! , you aren't the premium user" });

  try {
    const expenses = await Expense.find({ userId: _id }).select(
      "category desc amount createdAt -_id"
    );
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `expense-report-${shortid.generate()}.json`;
    uploadToS3(res, filename, stringifiedExpenses);
    // res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "failed to generate report" });
  }
};
