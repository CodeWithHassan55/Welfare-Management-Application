const express = require("express");
const cors = require("cors");
const router = require("./routes/route");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const cloudinaryConfig = require("./utils/cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config(cloudinaryConfig);
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Allow body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect database
const DBURI = `mongodb+srv://admin:admin5575@cluster1.8akxatw.mongodb.net/KPSIAJ`;
mongoose.connect(DBURI);
mongoose.connection.on("connected", () => console.log("mongodb connected"));
mongoose.connection.on("error", (error) => console.log(error));

// all routes
app.use(router);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("./view/currentProject/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'view', 'currentProject', 'build', 'index.html'));
  })
}
// app.get("/**", (req, res) => {
//   res.redirect("/");
// });
// app.get("/**", (req, res) => {
//   res.render();
// });

app.listen(PORT, () => console.log(`Server Running on ${PORT}`));
