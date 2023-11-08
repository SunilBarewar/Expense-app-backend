const {
  getUsersWithTotalExpenses,
  generateReportOfExpenses,
} = require("../controllers/premiumFeature.controller");
const authenticate = require("../middleware/auth");

const router = require("express").Router();

router.get("/leaderboard", authenticate, getUsersWithTotalExpenses);

router.get("/generate-report", authenticate, generateReportOfExpenses);

module.exports = router;
