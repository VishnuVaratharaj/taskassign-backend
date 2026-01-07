const { checkUser, getTask, updateTask } = require("../models/sqlfile");
const bcrypt = require("bcrypt");

async function loginUser(req, res) {
    const datas = req.user;
    try {
        const [result] = await checkUser(datas);
        if (result.length > 0) {
            console.log(result);
            return res.status(200).send({ success: true, datas: result });
        }
        return res.status(402).send({ success: false, datas: "No User Founded!" });
    }
    catch (err) {
        return res.status(402).send({ success: false });
    }
}

async function taskView(req, res) {
    const datas = req.body;
    try {
        const [result] = await getTask(datas);
        if (result.length > 0) {
            return res.status(200).send({ success: true, datas: result });
        }
        return res.status(400).send({ success: false, datas: "No Task Found!" });
    }
    catch (err) {
        return res.status(400).send({ success: false });
    }
}

async function taskUpdate(req, res) {
    const datas = req.body;
    if (!datas.remarks) {
        return res.status(402).send({ success: false, datas: "Remarks Cannot be Empty!" });
    }
    try {
        const [result] = await updateTask(datas);
        if (result.affectedRows > 0) {
            return res.status(200).send({ success: true, datas: "Task Updated Successfully!" });
        }
        return res.status(400).send({ success: false, datas: "Error in Updating Task!" });
    }
    catch (err) {
        return res.status(400).send({ success: false });
    }
}


module.exports = { loginUser, taskView, taskUpdate };

