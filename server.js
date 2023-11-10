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
  startApp();
});

async function startApp() {
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
    case "Add role":
      addRole();
      break;
    case "Add employee":
      addEmployee();
      break;
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
      startApp();
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
      startApp();
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
      startApp();
    }
  });
}

async function addDepartment() {
  try {
    const answer = await inquirer.prompt({
      type: "input",
      name: "newDept",
      message: "Enter the name of the new department:",
    });
    console.log(answer.newDept);
    const query = `INSERT INTO departments (department_name) VALUES (?)`;
    connection.query(query, [answer.newDept], (err, res) => {
      if (err) {
        console.error("Error executing query:", err);
        return;
      }
      console.log(`Added department ${answer.newDept} to the database!`);
      startApp();
    });
  } catch (error) {
    console.error("Error adding department:", error);
  }
}

async function addRole() {
  const query = "SELECT * FROM departments";
  try {
    const res = await new Promise((resolve, reject) => {
      connection.query(query, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the title of the new role:",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the salary of the new role:",
      },
      {
        type: "list",
        name: "department",
        message: "Select the department for the new role:",
        choices: res.map((department) => department.department_name),
      },
    ]);
    const department = res.find(
      (department) => department.department_name === answers.department
    );
    const insertQuery = "INSERT INTO roles SET ?";
    await new Promise((resolve, reject) => {
      connection.query(insertQuery,
        {
          title: answers.title,
          salary: answers.salary,
          department_id: department.id,
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
    console.log(
      `A new role ${answers.title}, with the salary ${answers.salary}, was added to the ${answers.department} department!`
    );
    startApp();
  } catch (err) {
    console.error(err);
  }
}
  
async function addEmployee() {
  try {
    const roles = await new Promise((resolve, reject) => {
      connection.query("SELECT id, title FROM roles", (error, results) => {
        if (error) reject(error);
        else resolve(results.map(({ id, title }) => ({ name: title, value: id })));
      });
    });
    const managers = await new Promise((resolve, reject) => {
      connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (error, results) => {
        if (error) reject(error);
        else resolve([{ name: "None", value: null }, ...results.map(({ id, name }) => ({ name, value: id }))]);
      });
    });
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the employee's first name:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the employee's last name:",
      },
      {
        type: "list",
        name: "roleId",
        message: "Select the employee role:",
        choices: roles,
      },
      {
        type: "list",
        name: "managerId",
        message: "Select the employee manager:",
        choices: managers,
      },
    ]);
    const sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
    const values = [answers.firstName, answers.lastName, answers.roleId, answers.managerId];

    await new Promise((resolve, reject) => {
      connection.query(sql, values, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    console.log("Employee added successfully");
    startApp();
  } catch (error) {
    console.error(error);
  }
};

process.on("Exit app", () => {
  connection.end();
});
