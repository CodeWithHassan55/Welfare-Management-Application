const UserModel = require("../../model/userSchema");

const getApprovedForms = (req, res) => {
    UserModel.find({status: "Approved"}, (error, data) => {
        if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    })
}

module.exports = getApprovedForms;