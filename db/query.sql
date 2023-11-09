SELECT departments.department_name AS department, roles.title AS role
FROM departments
LEFT JOIN roles ON roles.department_id = departments.id
ORDER BY departments.department_name;