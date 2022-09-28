const AdminModel = require("../../model/adminSchema");

const getReceiving = (req, res) => {
  AdminModel.findById({ _id: "62c804970ce1bc6af4a59fbc" }, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.send(data.receiving);
    }
  });
};
module.exports = getReceiving;
