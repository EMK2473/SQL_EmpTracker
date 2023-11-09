INSERT INTO departments (department_name)
VALUES
('CFO')




SELECT d.department_name AS department, r.title AS role, d.id AS departmentId, CONCAT(e.first_name, ' ', e.last_name) AS emp
FROM departments d
LEFT JOIN roles r ON r.department_id = d.id
LEFT JOIN employee e ON e.role_id = r.id
ORDER BY d.id;


