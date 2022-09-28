const AdminModel = require("../../model/adminSchema");
const bcryptjs = require("bcryptjs");

const login = (req, res) => {
  const { email, password } = req.body;
  AdminModel.findOne({ email }, async (error, user) => {
    if (error) {
      res.send(error);
    } else if (user) {
      await bcryptjs
        .compare(password, user.password)
        .then((password) => {
          if (password) {
            res.json({ message: "Login Successfull", id: user._id });
          } else {
            res.json({ message: "Invalid Credentials" });
          }
        })
        .catch((err) => {
          res.send(err);
        });
    } else {
      res.json({ message: "Invalid Credentials" });
    }
  });
};

module.exports = login;
