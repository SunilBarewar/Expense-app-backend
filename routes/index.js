const router = require("express").Router();
const UserRoutes = require("./user.route");
const ExpenseRoutes = require("./expense.route");
const PurchaseRoutes = require("./purchase.route");
const PremiumRoutes = require("./premiumFeature.route");

router.use("/user", UserRoutes);

router.use("/expense", ExpenseRoutes);

router.use("/purchase", PurchaseRoutes);

router.use("/premium", PremiumRoutes);

module.exports = router;
