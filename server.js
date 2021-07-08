const inquirer = require("inquirer");

const mysql = require("mysql");

const allController = require("./controllers/all");
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
          "view all employees by department",
          "add employee",
          "add department",
          "add role",
          "update employee role",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.Action) {
        case "view all employees":
          displayAll(mainMenu);

          break;
        case "view all employees by role":
          displayAllByRole(mainMenu);
          break;
        case "view all employees by department":
          break;
        case "add employee":
          addEmployee();
          break;
        case "add department":
          break;
        case "add role":
          break;
        case "update employee role":
          break;
      }
    });
};
mainMenu();

// callback as a parameter in order to redirect to main menu after selection.
const displayAll = (callBack = () => {}) => {
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

  let query = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC;`;
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    callBack();
  });

  connection.end();
};
const displayAllByRole = (callBack = () => {}) => {
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
  let roleArray = [];
  let query1 = `SELECT title FROM role;`;
  connection.query(query1, function (err, res) {
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
          connection.end();
        });
      });
  });
};

async function addEmployee() {
  console.log(`Adding employee`);
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
  let roleArray = [];
  let managerArray = [];
  //
  const allResults = await Promise.all([
    // query selecting ID,title from role
    connection.query(`SELECT id, title FROM role ORDER BY title ASC; `,([rows, fields]) => {
      console.log(rows);
        return rows;
      }),
      // query selecting by employee.id and concat first and last name AS Employee from the employee table
    connection.query(`SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) AS Employee FROM employee ORDER BY Employee ASC;`
      ,(([rows, fields]) => {
        return rows;
      }),
  )]);
  // allResults is a array with of arrays for 0
  for (let i = 0; i < allResults[0].length; i++) {
    roleArray.push(allResults[0][i].title);
  }
   // allResults is a array with of arrays for 1
  for (let i = 0; i < allResults[1].length; i++) {
    managerArray.push(allResults[1][i].Employee);
  }
  console.log(roleArray);
  console.log(managerArray);
  // prompt to add a employee
  await inquirer
    .prompt([
      {
        name: "first_name",
        type:`input`,
        message: "add your employee first name",
        validate:(input)=>{
          if(input === ``){
            console.log(`Enter a name`);
            return false;
          }
          return true;
        }
      },
      {
        name: "last_name",
        message: "add your employee last name",
      },
      {
        name: `role`,
        type: "list",
        message: `whats the employee role ?`,
        choices: roleArray,
      },
      {
        name: `manager`,
        type: "list",
        message: `Who is the Manager ?`,
        choices: managerArray,
      },
    ])
    // .then to carry the answer over to insert our user data into connection.query
    .then((answer) => {
      let roleId = null;
      let managerId = null;
      for (let i = 0; i < allResults[0].length; i++) {
        roleId = allResults[0][i].id;
      }
      for (let i = 0; i < allResults[1].length; i++) {
        managerId = allResults[1][i].id;
      }
      // inserting into employee first and last name role id and manager id using template literals to insert our answers and ids.
      connection.query(
        `INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES("${answers.first_name}","${answers.last_name}",${roleId},${managerId});`,
        (err, res) => {
          if (err) throw err;
          console.log(
            `\n employee ${answer.first_name} ${answer.last_name}  was  added!\n`
          );
          console.log(`${res.affectedRows} employee added!\n`);
          mainMenu();
          connection.end();
        }
      );
    });
}
