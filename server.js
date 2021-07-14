const inquirer = require("inquirer");

const mysql = require("mysql");
const { exit, allowedNodeEnvironmentFlags } = require("process");
const util = require("util");

const allController = require("./controllers/all");
let connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Be sure to update with your own MySQL password!
  password: "",
  database: "employee_TrackerDB",
});
connection.connect();
connection.query = util.promisify(connection.query);

// // import controllers
// const departmentController = require("./controllers/department");

const mainMenu = async () => {
  console.log("Welcome pick a option!");
  await inquirer
    .prompt([
      {
        type: "list",
        name: "Action",
        message: "Main Menu",
        choices: [
          "view all employees",
          "view all employees by role",
          "view all departments",
          "view all roles",
          "add employee",
          "add department",
          "add role",
          "update employee role",
          "Exit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.Action) {
        case "view all employees":
          displayAll();
          break;
        case "view all employees by role":
          displayAllByRole();
          break;
        case "view all departments":
          displayAllDept();
          break;
        case "view all roles":
          displayAllRoles();
          break;
        case "add employee":
          addEmployee();
          break;
        case "add department":
          addDepartment();
          break;
        case "add role":
          addRole();
          break;
        case "update employee role":
          updateEmployee();
          break;
        case "Exit":
          process.exit();
      }
    });
};
mainMenu();

// callback as a parameter in order to redirect to main menu after selection.
const displayAll = (callBack = () => {}) => {
  let query = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC;`;
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    callBack();
    mainMenu();
  });
};

const displayAllByRole = (callBack = () => {}) => {
  let roleArray = [];
  let query1 = `SELECT title FROM role;`;
  connection.query(query1, function (err, res) {
    console.log(err);
    for (let i = 0; i < res.length; i++) {
      roleArray.push(res[i].title);
    }
    inquirer
      .prompt({
        name: `role`,
        type: `list`,
        message: `Choose a role to view!`,
        choices: roleArray,
      })
      .then((answer) => {
        let query2 = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE role.title = '${answer.role}' ORDER BY ID ASC;`;
        connection.query(query2, (err, res) => {
          if (err) throw err;
          console.table(res);
          callBack();
          mainMenu();
        });
      });
  });
};

async function updateEmployee() {
  let checkEmployees = await connection.query(
    `SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) AS Employee FROM employee ORDER BY Employee ASC;`
  );
  let allRoles = await connection.query(
    `SELECT id, title FROM role ORDER BY title ASC; `
  );
  checkEmployees = checkEmployees.map((i) => ({
    name: i.Employee,
    value: i.id,
  }));

  allRoles = allRoles.map((i) => ({ name: i.title, value: i.id }));

  const { roleId, employeeId } = await inquirer.prompt([
    {
      type: "list",
      name: "employeeId",
      message: "which employee do you want to update?",
      choices: checkEmployees,
    },
    {
      type: "list",
      name: "roleId",
      message: "whats their new role?",
      choices: allRoles,
    },
  ]);
  connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [
    roleId,
    employeeId,
  ]);
  mainMenu();
}

async function displayAllRoles() {
  let allRoles = await connection.query(
    `SELECT id, title FROM role ORDER BY title ASC; `
  );
  console.table(allRoles);
  mainMenu();
}

async function displayAllDept() {
  let allDept = await connection.query(`SELECT id, name FROM department;`);

  await console.table(allDept);

  mainMenu();
}

async function addDepartment() {
  let allDept = await connection.query(`SELECT id, name FROM department;`);
  const response = await inquirer.prompt([
    {
      name: "name",
      message: "add your dept!",
    },
  ]);

  connection.query(`INSERT INTO department SET ?;`, response);
  console.table(allDept);
  mainMenu();
}

async function addRole() {
  let allDept = await connection.query(`SELECT id, name FROM department;`);

  allDept = allDept.map((i) => ({ name: i.name, value: i.id }));

  const response = await inquirer.prompt([
    {
      name: "title",
      message: "add your role!",
    },
    {
      name: "salary",
      message: "starting salary",
    },
    {
      type: "list",
      name: "department_Id",
      message: "which Dept?",
      choices: allDept,
    },
  ]);
  connection.query(`INSERT INTO role SET ?;`, response);

  mainMenu();
}

async function addEmployee() {
  let allRoles = await connection.query(
    `SELECT id, title FROM role ORDER BY title ASC; `
  );
  const allEmployees = await connection.query(
    `SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) AS Employee FROM employee ORDER BY Employee ASC;`
  );
  allRoles = allRoles.map((i) => ({ name: i.title, value: i.id }));

  const response = await inquirer.prompt([
    {
      name: "first_name",
      message: "add your employee first name",
      validate: (input) => {
        if (input === ``) {
          console.log(`Enter a name`);
          return false;
        }
        return true;
      },
    },
    {
      name: "last_name",
      message: "add your employee last name",
    },
    {
      name: `role_id`,
      type: "list",
      message: `whats the employee role ?;`,
      choices: allRoles,
    },
  ]);

  connection.query(`INSERT INTO employee SET ?;`, response);
  mainMenu();
}
