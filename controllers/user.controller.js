const bcrypt = require("bcrypt");
const brevo = require("@getbrevo/brevo");
const { v4: uuidv4 } = require("uuid");

const UserModel = require("../models/User.model");
const generateAccessToken = require("../utils/generateAccessToken");
const createHtmlContentForMail = require("../utils/mailTemplate");
const ForgotPasswordRequestModel = require("../models/ForgotPasswordRequest.model");
const { sequelize } = require("../utils/db-config");

exports.signupUser = async (req, res, next) => {
  const saltRounds = 10;
  try {
    const { email, password } = req.body;
    let user = await UserModel.findOne({ where: { email: email } });

    if (user) {
      return res.status(409).json({ message: "user already exits" });
    }
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      user = await UserModel.create({ ...req.body, password: hash });

      const { isPremium, totalExpense } = user;

      const token = generateAccessToken({
        userId: user.id,
        isPremium,
        totalExpense,
      });

      return res.status(200).json({
        token,
        isPremium,
        totalExpense,
      });
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.signinUser = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const user = await UserModel.findOne({
      where: {
        email,
      },
    });

    // user does not found
    if (!user)
      return res.status(404).json({ message: "email does not exists!" });

    const match = await bcrypt.compare(password, user.password);

    // password didn't matched
    if (!match) return res.status(401).json({ message: "wrong password" });

    const { isPremium, totalExpense } = user;

    const token = generateAccessToken({
      userId: user.id,
      isPremium,
      totalExpense,
    });

    return res.status(200).json({
      token,
      isPremium,
      totalExpense,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.sendForgotPasswordEmail = async (req, res) => {
  const { email } = req.body;

  // first check that this email/user exists or not
  const user = await UserModel.findOne({
    where: {
      email,
    },
  });

  // if not exist return 404 NOT FOUND Status
  if (!user) return res.status(404).json({ message: "email does not exists!" });

  const uid = uuidv4();

  const link = `${process.env.CLIENT_URL}/reset-password/${uid}`;

  // create an email
  let defaultClient = brevo.ApiClient.instance;

  let apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  let apiInstance = new brevo.TransactionalEmailsApi();
  let sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = "{{params.subject}}";
  sendSmtpEmail.htmlContent = createHtmlContentForMail(link);
  sendSmtpEmail.sender = {
    name: "Expense Tracker",
    email: "sunilvbarewar@gmail.com",
  };

  // email : anishbarewar1@gmail.com , name : "shahin das"
  sendSmtpEmail.to = [{ email: email, name: user.name }];
  sendSmtpEmail.params = {
    subject: "Reset Your Password",
  };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    async function (data) {
      // after successfully sending the mail , create a forgotPasswordRequest
      await ForgotPasswordRequestModel.create({
        request_id: uid,
        userId: user.id,
        isActive: true,
      });

      res.status(200).json({ message: "mail sent successfully!!" });
    },
    function (error) {
      res.status(400).json(error.message);
      console.error(error);
    }
  );
};

exports.updatePassword = async (req, res) => {
  const { request_id, newPassword } = req.body;
  console.log(req.body);
  const saltRounds = 10;
  try {
    const result = await ForgotPasswordRequestModel.findOne({
      where: { request_id },
    });

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const p1 = UserModel.update(
      { password: hashedPassword },
      {
        where: {
          id: result.userId,
        },
      }
    );
    result.isActive = false;
    const p2 = result.save();

    await Promise.all([p1, p2]);
    res.status(200).json({ message: "password updated successfully!!" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.isForgotPasswordRequestActive = async (req, res) => {
  const { request_id } = req.params;
  try {
    const result = await ForgotPasswordRequestModel.findOne({
      where: { request_id },
    });

    // if request id did not exist or it's not active
    if (!result || !result.isActive)
      return res.status(404).json({ message: "request did not found" });

    // if the request is expired
    let timeDiff = new Date() - new Date(result.createdAt);
    let isExpired = Math.floor(timeDiff / (1000 * 60)) > 10;

    if (isExpired) {
      result.isActive = false;
      await result.save();
      return res.status(404).json({ message: "request did not found" });
    }
    res.status(200).json({ message: "request found" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
