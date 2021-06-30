const inquirer = require("inquirer");
const mysql = require("msql");
const { error } = require("console");
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Be sure to update with your own MySQL password!
  password: "",
  database: "employee_trackerDB",
});

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: '',
  database: 'employee_trackerDB',
});

// const afterConnection = () => {
//   connection.query('SELECT * FROM departments', (err, res) => {
//     if (err) throw err;
//     console.log(res);
//     connection.end();
//   });
// };

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  afterConnection();
});