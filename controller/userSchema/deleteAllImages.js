const cloudinary = require("cloudinary").v2;

const deleteAllImages = (req, res) => {
    const { image } = req.body;
    image.map(async (ele) => {
        await cloudinary.uploader.destroy(ele.public_id, (error, data) => {
            if (error) {
                res.send(error);
            } else {
                res.send(data);
            }
        })
    })
}

module.exports = deleteAllImages;