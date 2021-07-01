USE employee_trackerDB;

INSERT INTO department(name)
VALUES ("engineering"), ("Finance"),("Sales");

INSERT INTO role(title,salary,department_id)
VALUES("lead software engineer",55000,1),("software engineer",45000,2),("accountant engineer",65000,3);

INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES("james","collins",12,null),("hidirt","collins",2,1),("sammmy","jack",12,null);