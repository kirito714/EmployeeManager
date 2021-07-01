const mysql = require("mysql2");
const consoleTable = require("console.table");

const all = {
  // callback as a parameter in order to redirect to main menu after selection.
  displayAll: (callBack = () => {}) => {
    let connection = mysql.createConnection({
      host: "localhost",

      // Your port; if not 3306
      port: 3306,

      // Your username
      user: "root",

      // Be sure to update with your own MySQL password!
      password: "",
      database: "employee_trackerDB",
    });
    let query = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC;`;
    connection.query(query, function (err, res) {
      if (err) throw err;
      console.table(res);
      callBack();

    });
    connection.end();
  },
};

module.export = all;