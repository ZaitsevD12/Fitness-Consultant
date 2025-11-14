const mysql = require("mysql2/promise");

mysql.c;

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "fitnessfiles",
    // port: 3306,
});
// admin@example.com
// admin_password
module.exports = pool;
