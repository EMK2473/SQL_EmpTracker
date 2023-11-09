const inquirer = require("inquirer");
const mySQL = require("mysql2");

const connection = mySQL.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mentos",
  database: "employeetracker_db",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected");
  start();
});

async function start() {
  const answers = await inquirer.prompt({
    type: "list",
    name: "promptStart",
    message: "Hello Business Owner. o/",
    choices: [
      "View all dept",
      "View all employees",
      "View all roles",
      "Add department",
      "Add role",
      "Add employee",
      "Update employee role",
      "Exit app",
    ],
  });
  switch (answers.promptStart) {
    case "View all dept":
      viewAllDepartments();
      break;
    case "View all employees":
      viewAllEmployees();
      break;
    case "View all roles":
      viewAllRoles();
    case "Add department":
      addDepartment();
      break;
    // case "Add role":
    //   addRole();
    //   break;
    // case "Add employee":
    //   addEmployee();
    //   break;
    // case "Update emp role":
    //   updateEmpRole();
    //   break;
    case "Exit app":
      connection.end();
      console.log("Exiting...\r\n Until next time... Business Owner. o7");
      break;
  }
}

function viewAllDepartments() {
  const query = `SELECT d.department_name AS department, r.title AS role, d.id AS departmentId
  FROM departments d
  LEFT JOIN roles r ON r.department_id = d.id
  ORDER BY d.id;`;
  connection.query(query, (err, res) => {
    if (err) {
      console.error("Error executing query:", err);
    } else {
      console.table(res);
      start();
    }
  });
}

function viewAllEmployees() {
  const query = `select CONCAT(first_name, ' ', last_name) AS allEmp from employee;`;
  connection.query(query, (err, res) => {
    if (err) {
      console.error("Error executing query:", err);
    } else {
      console.table(res);
      start();
    }
  });
}

function viewAllRoles() {
  const query = `select title, salary from roles;`;
  connection.query(query, (err, res) => {
    if (err) {
      console.error("Error executing query:", err);
    } else {
      console.table(res);
      start();
    }
  });
}

async function addDepartment() {
  try {
    const answer = await inquirer.prompt({
      type: "input",
      name: "name",
      message: "Enter the name of the new department:",
    });
    console.log(answer.name);
    const query = `INSERT INTO departments (department_name) VALUES (?)`;
    connection.query(query, [answer.name], (err, res) => {
      if (err) {
        console.error('Error executing query:', err);
        return;
      }
      console.log(`Added department ${answer.name} to the database!`);
      start();
    });
  } catch (error) {
    console.error('Error adding department:', error);
  }
}


process.on("Exit app", () => {
  connection.end();
});
