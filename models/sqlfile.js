const { query } = require("express");
const db = require("mysql2")
require("dotenv").config();

const crt = db.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQLPORT,
    timezone: 'local'
});

crt.connect(
    (err) => {
        if (err) { throw err; } console.log("connected to MySQL DataBase");
    }
);

function createUserTable() {
    const que = `CREATE TABLE users (
    user_id INT AUTO_INCREMENT not null unique,
	emp_id varchar(255) primary key,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phonenumber varchar(30) unique,
    department varchar(255) not null,

    UID VARCHAR(255) NOT NULL,
    email_verified TINYINT DEFAULT 0,

    role ENUM('ADMIN', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP
);`

    crt.query(que);

}

function createTaskTable() {
    const queue = `CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    department VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,

    assigned_to varchar(255) NOT NULL,
    emp_id varchar(255) not null,

    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') 
           DEFAULT 'PENDING',

    priority ENUM('LOW', 'MEDIUM', 'HIGH') 
             DEFAULT 'MEDIUM',

    due_date DATE NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP,
    remarks varchar(255),

    CONSTRAINT fk_assigned_employee
        FOREIGN KEY (emp_id) REFERENCES users(emp_id)
        ON DELETE CASCADE
    );`

    crt.query(queue);
}

function createEmployee(data) {
    console.log(data);
    return crt.promise().query(
        "INSERT INTO users (emp_id, name, email, department, phonenumber, UID) VALUES (?,?,?,?,?,?)",
        [data.emp_id, data.name, data.email, data.department, data.phonenumber, data.password]);
}

function empidCreation(data) {
    const empId = `EMP${String(data.insertId).padStart(3, '0')}`;
    return crt.promise().query("UPDATE users SET emp_id=? WHERE user_id=?", [empId, data.insertId]);
}

function dupilcateEntry(data) {
    return crt.promise().query("select * from users where email=? or phonenumber=?", [data.email, data.phonenumber]);
}

function checkUser(data) {
    return crt.promise().query("select email, emp_id, name, role from users where email=?", [data.email]);
}


function getTask(data) {
    return crt.promise().query("select *,DATE_FORMAT(due_date, '%Y-%m-%d') AS task_date from tasks where emp_id=?",
        [data.emp_id
		 // ,data.due_date
		]);
}

function updateTask(data) {
    return crt.promise().query("update tasks set status=?,remarks=? where task_id=?", [data.status, data.remarks, data.task_id]);
}

function assignTask(data) {
    // const { title, category, description, assigned_to, emp_id, priority, due_date } = data;
    return crt.promise().query("INSERT INTO tasks (title, department, description, assigned_to, emp_id, priority, due_date) VALUES (?,?,?,?,?,?,?)",
        [data.title, data.category, data.description, data.assigned_to, data.emp_id, data.priority, data.due_date]);
}

function employeeDetails(data) {
    return crt.promise().query("select emp_id,name from users where department=? and role!='ADMIN'", [data.dept]);
}

function completedTask(data) {
    const query = "SELECT users.name AS employee_name,users.department as Department, COUNT(CASE WHEN tasks.status = 'PENDING' THEN 1 END) AS pending_tasks, COUNT(CASE WHEN tasks.status = 'COMPLETED' THEN 1 END) AS completed_tasks FROM users LEFT JOIN tasks ON users.emp_id = tasks.emp_id where due_date = ? and role != 'ADMIN' GROUP BY users.emp_id, users.name";
    return crt.promise().query(query, [data.date]);
}

function excelsheet(data) {
	const dept = data.dept || NULL;
    return crt.promise().query("select * from tasks where (department = ? OR ? IS NULL)", [dept, dept]);
}

function employeeCount() {
    return crt.promise().query("select count(case when is_active = 1 then 1 end) as active_employee, count(case when is_active = 0 then 1 end) as inactive_employee from users where role!='ADMIN'");
}

function admin(data) {
    return crt.promise().query("update users set role =? where emp_id=?;", [data.role, data.emp_id]);
}

module.exports = { crt, createUserTable, createTaskTable, checkUser, getTask, updateTask, assignTask, employeeDetails, completedTask, createEmployee, empidCreation, dupilcateEntry, excelsheet, employeeCount, admin };
















