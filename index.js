const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
dotenv.config();

const { connectDB } = require("./utils/db-config");
const Routes = require("./routes");
const ExpenseModal = require("./models/Expense.model");
const UserModal = require("./models/User.model");
const OrderModel = require("./models/Order.model");
const ForgotPasswordRequestsModel = require("./models/ForgotPasswordRequest.model");

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());
app.use(morgan("common", { stream: accessLogStream }));
// making associations
UserModal.hasMany(ExpenseModal, {
  onDelete: "CASCADE",
});

ExpenseModal.belongsTo(UserModal);

UserModal.hasMany(OrderModel);
OrderModel.belongsTo(UserModal);

UserModal.hasMany(ForgotPasswordRequestsModel);
ForgotPasswordRequestsModel.belongsTo(UserModal);

const PORT = process.env.PORT || 8001;
connectDB();

app.use("/api", Routes);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Expense Tracky backend" });
});
app.listen(PORT, () =>
  console.log(`server running at PORT:${PORT} successfully`)
);
