const ExpenseModel = require("../models/Expense.model");
const UserModel = require("../models/User.model");
const shortid = require("shortid");
const uploadToS3 = require("../service/uploadToS3");

exports.getUsersWithTotalExpenses = async (req, res) => {
  const { isPremium } = req.user;
  if (!isPremium)
    return res
      .status(403)
      .json({ message: "Access Forbidden! , you aren't the premium user" });

  try {
    const result = await UserModel.findAll({
      attributes: ["name", "totalExpense"],
    });
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

exports.generateReportOfExpenses = async (req, res) => {
  const { isPremium, userId } = req.user;
  if (!isPremium)
    return res
      .status(403)
      .json({ message: "Access Forbidden! , you aren't the premium user" });

  try {
    const expenses = await ExpenseModel.findAll({
      attributes: ["category", "desc", "amount", "createdAt"],
      where: {
        userId,
      },
    });

    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `expense-report-${shortid.generate()}.json`;
    uploadToS3(res, filename, stringifiedExpenses);
  } catch (error) {
    res.status(500).send("Error generating the PDF");
  }
};
