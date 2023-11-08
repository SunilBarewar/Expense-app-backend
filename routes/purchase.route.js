const {
  purchasePremiumMembership,
  updatePaymentAndMembershipStatus,
} = require("../controllers/purchase.controller");
const authenticate = require("../middleware/auth");

const router = require("express").Router();

router.post("/premium-membership", authenticate, purchasePremiumMembership);

// update payment and membership status
router.post("/update-status", authenticate, updatePaymentAndMembershipStatus);

module.exports = router;
