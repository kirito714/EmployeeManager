const inquirer = require("inquirer");
const allController = require("./controllers/all")
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
            case "view all employees" :
            //    allController.displayAll(mainMenu)
            console.log(allController);
                break;
            case "view all employees by role" :
                
                break;
            case "view all employees by department" :
                
                break;
            case "add employee" :
                
                break;
            case "add department" :
                
                break;
            case "add role" :
                
                break;
            case "update employee role" :
                
                break;
          
            
        }
    });
};
mainMenu();
