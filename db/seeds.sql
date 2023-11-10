INSERT INTO departments (department_name)
VALUES
('CEO'),
('Regional Operations'),
('District Operations'),
('Local Operations'),
('Sale Operations'),
('Grunt Level Operations');

INSERT INTO roles (title, salary, department_id)
VALUES
('Chief Executive Officer', 1000000, 1),
('Regional Manager', 100000, 2),
('District Manager', 75000, 3),
('Local Manager', 50000, 4),
('Sales Rep', 35000, 5),
('Grunt', 25000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Mister', 'CEO', 1, NULL),
('Miss', 'Regional', 2, 1),
('Mister', 'District', 3, 2),
('Mister', 'Local', 4, 3),
('Miss', 'Sales', 5, 4),
('Unlucky', 'Grunty', 6, 5);