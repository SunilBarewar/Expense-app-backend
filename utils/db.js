const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: "localhost",
  }
);

async function connectDB() {
  await sequelize.sync({});
}
module.exports = {
  sequelize,
  connectDB,
};
