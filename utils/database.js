const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "Radziejowska1", {
  host: "localhost",
  dialect: "mysql"
});

module.exports = sequelize;
