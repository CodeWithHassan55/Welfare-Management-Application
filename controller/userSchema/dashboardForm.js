const UserModel = require("../../model/userSchema");

const dashboardForm = (req, res) => {
  UserModel.create(req.body, (error, _) => {
      if (error) {
          res.send(error);
      } else {
          res.json({ message: "success" });
      }
  });
};

module.exports = dashboardForm;
