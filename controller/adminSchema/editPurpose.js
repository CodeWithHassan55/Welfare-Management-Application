const AdminModel = require("../../model/adminSchema");

const editPurpose = (req, res) => {
  const { id } = req.params;
  AdminModel.findByIdAndUpdate(id, req.body, { new: true }, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
};

module.exports = editPurpose;
