const editPurpose = require("./adminSchema/editPurpose");
const editReceiving = require("./adminSchema/editReceiving");
const getPurpose = require("./adminSchema/getPurpose");
const getReceiving = require("./adminSchema/getReceiving");
const login = require("./adminSchema/login");
const dashboardForm = require("./userSchema/dashboardForm");
const deleteAllImages = require("./userSchema/deleteAllImages");
const deleteForms = require("./userSchema/deleteForms");
const editDashboardForm = require("./userSchema/editDashboardForm");
const getAllForms = require("./userSchema/getAllForms");
const getApprovedForms = require("./userSchema/getApprovedForms");
const getSpecificForm = require("./userSchema/getSpecificForm");
const imageDelete = require("./userSchema/imageDelete");
const imageUpload = require("./userSchema/imageUpload");

module.exports = {
    login,
    dashboardForm,
    editDashboardForm,
    getAllForms,
    deleteForms,
    getApprovedForms,
    getPurpose,
    editPurpose,
    getReceiving,
    editReceiving,    
    imageUpload,
    imageDelete,
    getSpecificForm,
    deleteAllImages,
}