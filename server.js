const inquirer = require("inquirer");
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
          allController.displayAll(mainMenu);
          
          break;
        case "view all employees by role":
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

const addEmployee = async () => {
  console.log("Welcome!!");
  await inquirer
    .prompt([
      {
        type: "input",
        name: "EmployeeName",
        message: "Enter the name of your employee",
        validate: (answer) => {
          if (answer === "") {
            console.log("Please enter a name");
            return false;
          }
          return true;
        },
      },
    ])
    .then((answers) => {
      console.table(answers);

      return mainMenu();
    });
};
