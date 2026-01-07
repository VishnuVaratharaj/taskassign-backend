const { assignTask, employeeDetails, completedTask, createEmployee, empidCreation, dupilcateEntry, excelsheet, createUserTable, createTaskTable, employeeCount, admin } = require("../models/sqlfile");
const bcrypt = require("bcrypt");

async function taskAssign(req, res) {
    const task = req.body;
    if (!task.assigned_to) {
        return res.status(400).send({ success: false, datas: "Assigned To is required! Cannot be Empty!" });
    }
    try {
        const [rows] = await assignTask(task);
        console.log(rows.affectedRows);
        if (rows.affectedRows > 0) {
            console.log(rows);
            return res.status(200).send({ success: true, datas: "Task Created Successfully!" });
        }
        return res.status(400).send({ success: "false" });
    }
    catch (err) {
        return res.status(400).send({ success: false });
    }
}

async function empDetails(req, res) {
    const names = req.body;
    console.log(names);
    if (!names.dept) {
            return res.status(400).send({ success: false, datas: "Department is required" });
        }
        try {
            const [fields] = await employeeDetails(names);
            console.log(fields);
                if (fields.length > 0) {
                    return res.status(200).send({ success: true, datas: fields });
                }
            return res.status(400).send({ success: false, datas: "No Users/Departments are Found" });
        }
        catch (err) {
            return res.status(400).send({ success: false });
        }
}

async function taskTable(req, res) {
    const names = req.body;
    try {
        const [result] = await completedTask(names);
        if (result.length > 0) {
            return res.status(200).send({ success: true, datas: result });
        }
        return res.status(400).send({ success: false, datas: "No Task Founded on Provided Date!" });
    }
    catch (err) {
        return res.status(400).send({ success: false });
    }
}

async function registerUser(req, res) {
    const names = req.body;
    try {
        const [result] = await createEmployee(names);
        await empidCreation(result);
        if (result.affectedRows > 0) {
            return res.status(201).send({ success: true, datas: "User Created Successfully!" });
        }
        return res.status(400).send({ success: false });
    }
    catch (err) {
        return res.status(400).send({ success: false, datas: "Email or Phone Number Already Exists" });
    }
}

async function dupilcateUser(req, res) {
    const data = req.body;
    if (!data.email || !data.phonenumber) {
        return res.status(500).send({ success: false, message: "Email/Phone Number is Empty!" });
    }
    try {
        const [result] = await dupilcateEntry(data);
        if (result.length === 0) {
            return res.status(200).send({ success: true, datas: "No Data Found" });
        }
        return res.status(400).send({ success: false, datas: "Email or Phone Number Already Exists" });
    }
    catch (err) {
        return res.status(500).send({ success: false });
    }
}

async function excelDetails(req, res) {
    const dept = req.body;
    if (!dept) {
        return res.status(402).send({ success: false, datas: "Department Cannot be Empty!" });
    }
    try {
        const [result] = await excelsheet(dept);
        if (result.length > 0) {
            return res.status(200).send({ success: true, datas: result });
        }
        return res.status(400).send({ success: false, datas: "No data Found on that Department" });
    }
    catch (err) {
        return res.status(400).send({ success: false });
    }
}

function tableUserCreation(req, res) {
    try {
        createUserTable();
        return res.status(200).send({ success: true });
    }
    catch (err) {
        return res.status(400).send({ status: false });
    }
}

function tableTaskCreation(req, res) {
    try {
        createTaskTable();
        return res.status(200).send({ success: true });
    }
    catch (err) {
        return res.status(400).send({ status: false });
    }
}

async function count(req, res) {
     try {
        const [result] = await employeeCount();
        if (result.length > 0) {
            return res.status(200).send({ success: true, datas: result });
        }
        return res.status(400).send({ success: false });
    }
    catch (err) {
        return res.status(400).send({ success: false });
    }
}

async function addAdmin(req, res) {
    const data = req.query;
    console.log(data);
    if (!data.emp_id) {
        return res.status(400).send({ success: false, datas: "Employee ID cannot be Empty" });
    }
    console.log(!data.role === 'ADMIN' ||!data.role === 'EMPLOYEE');
    try {
        const [result] = await admin(data);
        if (result.affectedRows > 0) {
            return res.status(200).send({ success: true, datas: "Admin Added Successfully!" });
        }
        return res.status(400).send({ success: "false" });
    }
    catch (err) {
        return res.status(400).send({ success: false, datas: "Role must be ADMIN/EMPLOYEE" });
    }
}

module.exports = { taskAssign, empDetails, taskTable, registerUser, excelDetails, tableUserCreation, tableTaskCreation, count, dupilcateUser, addAdmin };











