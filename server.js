const inquirer = require("inquirer");
const mySQL = require("mysql2");

const connection = mySQL.createConnection({
  host: "localhost",
  port: 3001,
  user: "root",
  password: "mentos",
  database: "employeetracker_db",
});

connection.connect((err) => {
  console.log("Connected");
  start();
});

async function start(){
  const answers = await inquirer.prompt({
    type: "list",
    name: "promptStart",
    message: "Hello Business Owner. o7",
    choices: [
      "View all dept",
      "View all employee roles",
      "View all employees",
      "Add department",
      "Add role",
      "Add employee",
      "Add manager",
      "Update employee role",
      "Exit app",
    ],
  })
  switch (answers.promptStart) {
    case "View all dept":
      viewAllDepartments();
      break;
    case "View all emp roles":
      viewAllEmpRoles();
      break;
    case "View all employees":
      viewAllEmployees();
      break;
    case "Add department":
      addDepartment();
      break;
    case "Add role":
      addRole();
      break;
    case "Add employee":
      addEmployee();
      break;
    case "Update emp role":
      // updateEmpRole();
      break;
    case "Exit app":
      connection.end();
      console.log("Exiting...\r\n Until next time... Business Owner. o7");
      break;
  }
};
// console.table() to log the tables??
function viewAllDepartments() {
  const query = "SELECT * FROM departments";
  connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      // restart the application
      start();
  });
}

process.on("Exit app", () => {
  connection.end();
});
