const { Sequelize } = require("sequelize");
const ExpenseModel = require("../models/Expense.model");
const UserModel = require("../models/User.model");
const { sequelize } = require("../utils/db-config");

const addExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userId, totalExpense } = req.user;
    const expensePromise = ExpenseModel.create(
      { ...req.body, userId },
      { transaction: t }
    );

    const updatedTotalExpense = Number(totalExpense) + Number(req.body.amount);

    const userPromise = UserModel.update(
      { totalExpense: updatedTotalExpense },
      {
        where: {
          id: userId,
        },
        transaction: t,
      }
    );

    await Promise.all([expensePromise, userPromise]);

    await t.commit();
    return res.status(200).json({ totalExpense: Number(req.body.amount) });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: error.message });
  }
};

const getAllExpensesOfUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const { limit = 10, page = 1 } = req.query;
    const offset = limit * (page - 1);
    const { rows, count } = await ExpenseModel.findAndCountAll({
      where: {
        userId: userId,
      },
      limit: limit,
      offset: offset,
    });
    console.log(rows.length);
    return res
      .status(200)
      .json({ expenses: rows, totalPages: Math.ceil(count / limit) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addExpense,
  getAllExpensesOfUser,
};
