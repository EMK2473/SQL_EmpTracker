require('dotenv').config(); 
const inquirer = require("inquirer");
const mySQL = require("mysql2");
const {
  viewAllDepartments,
  viewAllEmployees,
  viewAllRoles,
  addDepartment,
  addRole,
  addEmployee,
  viewBusiness,
  updateEmpRole,
} = require("./functions");

const connection = mySQL.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected");
  startApp(connection);
});

async function startApp(connection) {
  const answers = await inquirer.prompt({
    type: "list",
    name: "promptStart",
    message:
      "\r\no/  Hello Business Owner!\r\n \r\nLet's operate your business: ",
    choices: [
      "View all operations", 
      "View all departments",
      "View all roles",
      "View all employees",
      "Add department",
      "Add role",
      "Add employee",
      "Update employee role",
      "Exit app",
    ],
  });
  switch (answers.promptStart) {
    case "View all operations":
      viewBusiness(connection, startApp);
      break;
    case "View all departments":
      viewAllDepartments(connection, startApp);
      break;
    case "View all employees":
      viewAllEmployees(connection, startApp);
      break;
    case "View all roles":
      viewAllRoles(connection, startApp);
      break;
    case "Add department":
      addDepartment(connection, startApp);
      break;
    case "Add role":
      addRole(connection, startApp);
      break;
    case "Add employee":
      addEmployee(connection, startApp);
      break;
    case "Update employee role":
      updateEmpRole(connection, startApp);
      break;
    case "Exit app":
      connection.end();
      console.log("Disconnecting...\r\n \r\nUntil next time... o/");
      break;
  }
}

process.on("exit", () => {
  connection.end();
});

module.exports = connection;
