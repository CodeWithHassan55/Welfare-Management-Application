const UserModel = require("../../model/userSchema");

const getSpecificForm = (req, res) => {
    UserModel.findOne(req.body, (error, data) => {
        if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    })
}

module.exports = getSpecificForm;