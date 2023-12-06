const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
dotenv.config();

const Routes = require("./routes");
const connectDB = require("./utils/db-config");

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

const PORT = process.env.PORT || 8001;

app.use("/api", Routes);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Expense Tracky" });
});

connectDB(() => {
  app.listen(PORT, () =>
    console.log(`server running at PORT:${PORT} successfully`)
  );
});
