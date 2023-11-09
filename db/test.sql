-- view all dept
select department_name from departments; 
-- view all roles
select title, salary from roles;
-- view all employees 
select CONCAT(first_name, ' ', last_name) AS empInfo from employee;

-- view all depts, roles, sorted by dept ID
SELECT d.department_name AS department, r.title AS role, d.id AS departmentId
FROM departments d
LEFT JOIN roles r ON r.department_id = d.id
ORDER BY d.id;


--  views all depts, roles, and employess, by deptId
SELECT d.department_name AS department, r.title AS role, d.id AS departmentId, CONCAT(e.first_name, ' ', e.last_name) AS emp
FROM departments d
LEFT JOIN roles r ON r.department_id = d.id
LEFT JOIN employee e ON e.role_id = r.id
ORDER BY d.id;

-- add dept name
-- INSERT INTO departments (department_name)
-- VALUES
-- ('CFO')

-- add role
-- INSERT INTO roles (title, salary, department_id)
-- VALUES
-- ('Chief Financial Officer', 2000000, 7);
-- SELECT * FROM roles;


-- add employee
-- INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- VALUES
-- ('Miss', 'CFO', 7, 1);
-- SELECT * from employee;


--update employee
UPDATE employee
SET role_id = 1
WHERE CONCAT(first_name, ' ', last_name) = 'Unlucky Grunty';
SELECT * FROM employee;

-- SELECT * from employee
-- ORDER BY role_id;


-- next to do:
-- WHEN I choose to add a department
-- THEN I am prompted to enter the name of the department and that department is added to the database

-- WHEN I choose to add a role
-- THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

-- WHEN I choose to add an employee
-- THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

-- WHEN I choose to update an employee role