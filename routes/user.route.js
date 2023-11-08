const router = require("express").Router();
const {
  signupUser,
  signinUser,
  sendForgotPasswordEmail,
  updatePassword,
  isForgotPasswordRequestActive,
} = require("../controllers/user.controller");

router.post("/sign-up", signupUser);

router.post("/sign-in", signinUser);

router.post("/forgot-password/send-mail", sendForgotPasswordEmail);

router.put("/update-password", updatePassword);

router.get("/forgot-password/:request_id", isForgotPasswordRequestActive);

module.exports = router;
