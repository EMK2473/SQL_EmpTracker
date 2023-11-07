const inquirer = require("inquirer");
const mySQL = require("mysql2");
const cfonts = require("cfonts");

const connection = mySQL.createConnection({
  host: "localhost",
  port: 3001,
  user: "root",
  password: "mentos",
  database: "empTracker_database",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
  prompt();
});

cfonts.say("Welcome|Business|Owner", {
  font: "block", // define the font face
  align: "left", // define text alignment
  colors: ["system"], // define all colors
  background: "transparent", // define the background color, you can also use `backgroundColor` here as key
  letterSpacing: 1, // define letter spacing
  lineHeight: 1, // define the line height
  space: true, // define if the output text should have empty lines on top and on the bottom
  maxLength: "0", // define how many character can be on one line
  gradient: false, // define your two gradient colors
  independentGradient: false, // define if you want to recalculate the gradient for each new line
  transitionGradient: false, // define if this is a transition between colors directly
  env: "node", // define the environment cfonts is being executed in
});

function prompt() {
  inquirer
    .prompt({
      type: "list",
      name: "initQ",
      message: "Business Operations:",
      choices: [
        "View all dept",
        "View all emp roles",
        "View all employees",
        "Add department",
        "Add role",
        "Add employee",
        "Add manager",
        "Update emp role",
        "Exit app",
      ],
    })
    .then((answers) => {
      switch (answers.initQ) {
        case "View all dept":
          viewAllDept();
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
          updateEmpRole();
          break;
        case "Exit app":
          connection.end();
          console.log("Exiting...\r\n Until next time... Business Owner");
          break;
      }
    });
}
// console.table() to log the tables??
function viewAllDept() {
  const query = 'SELECT * FROM departments';
  connection.query(query, (err, res) =>{
    if (err) throw err;
    console.table(res);
    prompt();
  })
  // select all from departments
  // console log(response)
  // run prompt()
}

function viewAllEmpRoles() {
  const query = 'SELECT roles.title, roles.id, role.salary, departments.department_name, from roles JOIN departments on roles.department_id = departments.id';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    prompt();
  })
  // select all roles, id, depart, salaries
  // console.log(response)
  // run prompt()
}

function viewAllEmployees() {
  // REVIEW THIS QUERY
  const query = `SELECT employee.id, employee.first_name, role.title, departments.department_name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name FROM employee employee 
  LEFT JOIN roles roles ON employee.role_id = role.id
  LEFT JOIN departments d on r.department_id = d.id
  LEFT JOIN employee manager ON employee.manager_id = manager.id;`
  connection.query(query, (err, res)=>{
    if (err) throw err;
    console.table(res);
    prompt();
  })
  // select all employees
  // console.log(response)
  // run prompt()
}

function addDepartment() {
  inquirer.prompt({
    type: 'input',
    name: 'newDep',
    message: 'Name for new department:',
  }).then((newDepart) =>{
    console.log(newDepart.name);
    const query = `INSERT INTO departments (department_name) VALUES ('${newDepart.name}')`;
    connection.query(query, (err, res) =>{
      if (err) throw err;
      console.log(`New department ${newDepart.name}added!`);
      prompt();
      // console.log(answer.name);
    })
  })
  // prompt new question: newDept
  // INSERT INTO departments
  // console.log(newDept)
  // run prompt()
}

function addRole() {
  // prompt new question: newRole
  // inputQ: roleTitle
  // inputQ2: roleSalary
  //inputq3: roleDepartment
  // INSERT INTO roles
  // console.log(res.newRole)
  // run prompt()
}

function addEmployee() {
  // prompt new questions: newEmp
  // inputQ1: empFirstName
  // inputQ2: empLastName
  // inputQ3: empRoleId (int)
  // inputQ4: managerId (int)
  // or list/choices choose current managers
  // console.log(res)
  // run prompt()
}

function updateEmpRole() {
  // prompt new questions: updateEmpRole
  // q1: list/choices choose from list of current employees
  // q2: list/choices choose from list of roles available
  // UPDATE employee list w/ employee roles
  // console.log(res)
  // run prompt()
}

process.on("Exit app", () => {
  connection.end();
});
