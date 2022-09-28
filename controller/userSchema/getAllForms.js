const UserModel = require("../../model/userSchema");

const getAllForms = (req, res) => {
    UserModel.find({}, (error, data) => {
        if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    })
}

module.exports = getAllForms;