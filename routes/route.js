const express = require("express");
const { login, dashboardForm, editDashboardForm, getAllForms, getApprovedForms, deleteForms, getPurpose, editPurpose, editStatus, getStatus, getReceiving, editReceiving, imageUpload, imageDelete, getSpecificForm, deleteAllImages } = require("../controller");
const upload = require("../utils/multer");

const router = express.Router();

router.get("/api/getAllForms", getAllForms);
router.get("/api/getApprovedForms", getApprovedForms);
router.get("/api/getPurpose", getPurpose);
router.get("/api/getReceiving", getReceiving);
router.post("/api/deleteAllImages", deleteAllImages);
router.post("/api/getSpecificForm", getSpecificForm);
router.post("/api/login", login);
router.post("/api/dashboardForm", dashboardForm);
router.post("/api/imageUpload", upload.any("image"), imageUpload);
router.put("/api/imageDelete/:id", imageDelete);
router.put("/api/editDashboardForm/:id", editDashboardForm);
router.put("/api/editPurpose/:id", editPurpose);
router.put("/api/editReceiving/:id", editReceiving);
router.delete("/api/deleteForms/:id", deleteForms);

module.exports = router;