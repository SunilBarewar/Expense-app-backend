const Expense = require("../models/Expense.model");

const addExpense = async (req, res) => {
  try {
    const { _id, totalExpense } = req.user;
    const expensePromise = new Expense({ ...req.body, userId: _id }).save();

    const updatedTotalExpense = Number(totalExpense) + Number(req.body.amount);

    const userPromise = req.user.updateTotalExpense(updatedTotalExpense);

    await Promise.all([expensePromise, userPromise]);

    return res
      .status(200)
      .json({ totalExpense: Number(req.user.totalExpense) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllExpensesOfUser = async (req, res) => {
  try {
    const { _id } = req.user;
    const { limit = 10, page = 1 } = req.query;
    const offset = limit * (page - 1);
    // const { rows, count } = await Expense.find({ userId: _id })
    //   .skip(offset)
    //   .limit(limit);
    const result = await Expense.aggregate([
      { $match: { userId: _id } },
      {
        $facet: {
          expenses: [{ $skip: offset }, { $limit: limit }],
          totalCount: [{ $count: "value" }],
        },
      },
    ]); //{ expenses: rows, totalPages: Math.ceil(count / limit) }
    return res.status(200).json({
      expenses: result[0].expenses,
      totalPages: Math.ceil(result[0].totalCount[0].value / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: "failed to fetch expenses" });
  }
};

module.exports = {
  addExpense,
  getAllExpensesOfUser,
};
