const AdminModel = require("../../model/adminSchema");

const getPurpose = (req, res) => {
  AdminModel.findById({ _id: "62e51089754caa97f5310b67" }, (error, data) => {
    if (error) {
        res.send(error);
    } else {
        res.send(data);
    }
  });
};

module.exports = getPurpose;
