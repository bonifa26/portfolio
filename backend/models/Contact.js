const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    suggestion: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);