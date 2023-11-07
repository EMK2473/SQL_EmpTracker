-- set base seed values for
-- departments
-- roles
-- employee


INSERT INTO departments (department_name)
values
('CEO', 1),
('Regional Operations'),
('District Operations'),
('Local Operations'),
('Sale Operations'),
('Grunt Level Operations');

INSERT INTO roles (title, salary, department_id)
values
('Chief Executive Officer', 1000000, 1),
('Regional Manager', 100000, 2),
('District Manager', 75000, 3),
('Local Manager', 50000, 4),
('Sales Rep', 35000, 5),
('Grunt', 25000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
('Mister', 'CEO', 1, 1),
('Miss', 'Regional', 2, 2),
('Mister', 'District', 3, 3),
('Mister', 'Local', 4, 4),
('Miss', 'Sales', 5, 5),
('Unlucky', 'Grunt', 6, 6);

