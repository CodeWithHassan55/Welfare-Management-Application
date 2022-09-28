const UserModel = require("../../model/userSchema");

const deleteForms = (req, res) => {
    const { id } = req.params;
    UserModel.findByIdAndDelete(id, (error, data) => {
        if (error) {
            res.send(error);
        } else {
            res.json({ message: "Form Delete Successfully" });
        }
    })
}

module.exports = deleteForms;