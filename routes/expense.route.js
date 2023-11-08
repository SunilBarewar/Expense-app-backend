const router = require("express").Router();

const {
  addExpense,
  getAllExpensesOfUser,
} = require("../controllers/expense.controller");
const authenticate = require("../middleware/auth");

router.post("/add-expense", authenticate, addExpense);

router.get("/all-expenses", authenticate, getAllExpensesOfUser);

module.exports = router;
