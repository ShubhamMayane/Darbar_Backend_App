const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  Serial_Id: { type: String, required: true, unique: true },
  Full_Name: String,
  Purpose: String,
  Date: String, // Can be changed to `Date` if needed
  Total_Amount: Number,
  T_Amount: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('Record', RecordSchema);