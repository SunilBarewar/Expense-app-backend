const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");

dotenv.config();

const { connectDB } = require("./utils/db");
const Routes = require("./routes");
const ExpenseModal = require("./models/Expense.model");
const UserModal = require("./models/User.model");
const OrderModel = require("./models/Order.model");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());

// making associations
UserModal.hasMany(ExpenseModal, {
  onDelete: "CASCADE",
});

ExpenseModal.belongsTo(UserModal);

UserModal.hasMany(OrderModel);
OrderModel.belongsTo(UserModal);

const PORT = process.env.PORT || 8001;
connectDB();

app.use("/api", Routes);
app.get("");
app.listen(PORT, () =>
  console.log(`server running at PORT:${PORT} successfully`)
);
