const UserModel = require("../../model/userSchema");

const cloudinary = require("cloudinary").v2;

const imageDelete = async (req, res) => {
  const { public_id, userObj } = req.body;
  const { id } = req.params;
  await cloudinary.uploader.destroy(public_id, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      if (data.result === "ok") {
        UserModel.findByIdAndUpdate(id, userObj, { new: true }, (error, user) => {
          if (error) {
            res.send(error);
          } else {
            res.json({ image: data.result, user: user });
          }
        });
      }
    }
  });
};

module.exports = imageDelete;
