const mysql = require("mysql2");

const pool = mysql.Pool({
  host: "localhost",
  user: "root",
  database: "node",
  password: "Radziejowska1"
});

module.exports = pool.promise();
