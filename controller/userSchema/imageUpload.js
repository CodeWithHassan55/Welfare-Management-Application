const cloudinary = require("cloudinary").v2;

const imageUpload = (req, res) => {
  let arr = [];
  let len = Object.keys(req.files).length;
  let count = 0;
  req.files.map(async (ele, ind) => {
    await cloudinary.uploader.upload(ele.path, (error, data) => {
      if (error) {
        res.send(error);
      } else {
        arr.push({ public_id: data.public_id, url: data.secure_url });
        count = count + 1;
        if (count === len) {
          res.send(arr);
        }
      }
    });
  });
};

module.exports = imageUpload;
