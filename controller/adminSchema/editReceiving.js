const AdminModel = require("../../model/adminSchema")

const editReceiving = async (req, res) => {
  const { id } = req.params;
  AdminModel.findByIdAndUpdate(
    id, 
    req.body,
    (error, _) => {
      if (error) {
        res.send(error);
      } else {
        res.json({ message: "Receiving" });
      }
    }
  );
};

module.exports = editReceiving;
