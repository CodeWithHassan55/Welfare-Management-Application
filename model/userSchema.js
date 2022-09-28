const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  father_name: { type: String },
  husband_name: { type: String },
  jcic_number: { type: String },
  cnic_number: { type: String },
  cell_number: { type: String },
  occupation: { type: String },
  residential_address: { type: String },
  office: { type: String },
  office_address: { type: String },
  salary: { type: String },
  residential_status: { type: String },
  rental_amount: { type: String },
  total_dependents: { type: String },
  above_dependents: { type: String },
  below_dependents: { type: String },
  purpose: [{ type: String }],
  purpose_name: { type: JSON },
  description: { type: String },
  status: {
    type: String,
    default: "UnApprove",
  },
  date: {type: String},
  account: {type: String},
  cast: {type: String},
  serial_no: {type: String},
  amount: {type: String},
  image: {type: Array},
  trust_name: {type: String},
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
