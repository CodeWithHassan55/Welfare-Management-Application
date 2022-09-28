const { default: mongoose } = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  receiving: {type: JSON},
  school: { type: Array },
  hospital: { type: Array },
  academy: { type: Array },
  university: { type: Array },
  general_store: { type: Array },
  rent: { type: Array },
  grocery: { type: Array },
  repairing: { type: Array },
  purchasing: { type: Array },
  other: { type: Array },
});

const AdminModel = mongoose.model("admin", adminSchema);

module.exports = AdminModel;
