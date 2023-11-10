const inquirer = require("inquirer");

function viewBusiness(connection, startApp) {
  const query = `SELECT d.id AS departmentId, d.department_name AS department, r.title AS role, CONCAT(e.first_name, ' ', e.last_name) AS emp, r.salary AS Salary
    FROM departments d
    LEFT JOIN roles r ON r.department_id = d.id
    LEFT JOIN employee e ON e.role_id = r.id
    ORDER BY d.id;`;
  connection.query(query, (err, res) => {
    if (err) {
      console.error("Error executing query:", err);
    } else {
      console.table(res);
      console.log('Here are all of your business operations! ^^');
      startApp(connection);
    }
  });
}

function viewAllDepartments(connection, startApp) {
  const query = `SELECT d.id AS departmentID, d.department_name AS Department, r.title AS Role
  FROM departments d
  LEFT JOIN roles r ON r.department_id = d.id
  ORDER BY d.id;`;
  connection.query(query, (err, res) => {
    if (err) {
      console.error("Error executing query:", err);
    } else {
      console.table(res);
      console.log('Here are all of your departments! ^^');
      startApp(connection);
    }
  });
}

function viewAllRoles(connection, startApp) {
  const query = `SELECT r.id ID, r.title Title, r.salary Salary, d.department_name Department
  FROM roles r
  JOIN departments d ON r.department_id = d.id;`;
  connection.query(query, (err, res) => {
    if (err) {
      console.error("Error executing query:", err);
    } else {
      console.table(res);
      console.log('Here are all of your roles! ^^');
      startApp(connection);
    }
  });
}

function viewAllEmployees(connection, startApp) {
  const query = `SELECT
  e.id AS Employee_ID,
  CONCAT(e.first_name, ' ', e.last_name) AS Employees,
  r.title AS Job_Title,
  d.department_name AS Department,
  r.salary AS Salary,
  m.id AS Manager_ID,
  CONCAT(m.first_name, ' ', m.last_name) AS Manager_Name
FROM
  employee e
JOIN
  roles r ON e.role_id = r.id
JOIN
  departments d ON r.department_id = d.id
LEFT JOIN
  employee m ON e.manager_id = m.id;`;
  connection.query(query, (err, res) => {
    if (err) {
      console.error("Error executing query:", err);
    } else {
      console.table(res);
      console.log('Here are all of your employees! ^^');
      startApp(connection);
    }
  });
}

async function addDepartment(connection, startApp) {
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
      console.log(`\r\n${answer.newDept} added!\r\nSelect: 'View all departments' to view ${answer.newDept}.\r\nDon't forget to add a new role for the new ${answer.newDept} department!`);
      startApp(connection);
    });
  } catch (error) {
    console.error("Error adding department:", error);
  }
}
async function addRole(connection, startApp) {
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
        connection.query(
          insertQuery,
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
        `The new role ${answers.title}, with the salary ${answers.salary}, was added to the ${answers.department} department!`
      );
      startApp(connection);
    } catch (err) {
      console.error(err);
    }
  }
  
  async function addEmployee(connection, startApp) {
    try {
      const roles = await new Promise((resolve, reject) => {
        connection.query("SELECT id, title FROM roles", (error, results) => {
          if (error) reject(error);
          else
            resolve(
              results.map(({ id, title }) => ({ name: title, value: id }))
            );
        });
      });
      const managers = await new Promise((resolve, reject) => {
        connection.query(
          'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee',
          (error, results) => {
            if (error) reject(error);
            else
              resolve([
                { name: "None", value: null },
                ...results.map(({ id, name }) => ({ name, value: id })),
              ]);
          }
        );
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
      const sql =
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
      const values = [
        answers.firstName,
        answers.lastName,
        answers.roleId,
        answers.managerId,
      ];
  
      await new Promise((resolve, reject) => {
        connection.query(sql, values, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });
      console.log(`\r\n${answers.firstName} ${answers.lastName} successfully added as an employee!`);
      startApp(connection);
    } catch (error) {
      console.error(error);
    }
  }
  
  async function updateEmpRole(connection, startApp) {
    try {
      const queryEmployees =
        "SELECT employee.id, employee.first_name, employee.last_name, roles.title FROM employee LEFT JOIN roles ON employee.role_id = roles.id";
      const queryRoles = "SELECT * FROM roles";
      const [resEmployees, resRoles] = await Promise.all([
        new Promise((resolve, reject) => {
          connection.query(queryEmployees, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        }),
        new Promise((resolve, reject) => {
          connection.query(queryRoles, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        }),
      ]);
      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "employee",
          message: "Select the employee to update:",
          choices: resEmployees.map(
            (employee) => `${employee.first_name} ${employee.last_name}`
          ),
        },
        {
          type: "list",
          name: "role",
          message: "Select the new role:",
          choices: resRoles.map((role) => role.title),
        },
      ]);
      const employee = resEmployees.find(
        (employee) =>
          `${employee.first_name} ${employee.last_name}` === answers.employee
      );
      const role = resRoles.find((r) => r.title === answers.role);
      const updateQuery = "UPDATE employee SET role_id = ? WHERE id = ?";
      await new Promise((resolve, reject) => {
        connection.query(updateQuery, [role.id, employee.id], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      console.log(
        `${employee.first_name} ${employee.last_name}'s role was updated to ${role.title}!`
      );
      startApp(connection);
    } catch (err) {
      console.error(err);
    }
  }


module.exports = {
  viewAllDepartments,
  viewAllEmployees,
  viewAllRoles,
  addDepartment,
  addRole,
  addEmployee,
  viewBusiness,
  updateEmpRole,
};
