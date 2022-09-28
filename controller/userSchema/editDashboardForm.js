const UserModel = require("../../model/userSchema");

const editDashboardForm = (req, res) => {
    const { id } = req.params;
    UserModel.findByIdAndUpdate(id, req.body, {new: true}, (error, data) => {
        if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    })
}

module.exports = editDashboardForm;