const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//this is the code for defining the document structure
const RecordSchema = new mongoose.Schema(
  {
    Serial_Id: { type: String, required: true, unique: true },
    Full_Name: String,
    Purpose: String,
    Date: String, // Can be changed to `Date` if needed
    Total_Amount: Number,
    T_Amount: Number,
  },
  {
    timestamps: true,
  }
);

/*
  following is the statement to specify that document structure is 
  for the Record collection.it means ya pudhil line ne kay hote ki
  Record navacha collection create hote  jar ka created nasel tar 
  aani tya collection madhil each document che structure he "RecordSchema" asel.
  */
const Record = mongoose.model("Record", RecordSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

//logic Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


app.get("/getTest",(req,res)=>{
  res.send("<h1>Jay ganesh</h1><br><h2>Shri swami samartha</h2><br><h2>Jay shankar baba</h2>");
});


// GET all records
app.get("/api/data", async (req, res) => {
  try {
    const records = await Record.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET record by Serial_Id
app.get("/api/data/search", async (req, res) => {
  try {
    const record = await Record.findOne({ Serial_Id: req.query.Serial_Id });
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add new record
app.post("/api/data", async (req, res) => {
  try {
    const input = req.body.data;
    const exists = await Record.findOne({ Serial_Id: input.Serial_Id });
    if (exists)
      return res.status(409).json({ message: "Serial_Id already exists" });

    const record = new Record(input);
    await record.save();
    res.status(201).json({ message: "Record added", data: record });
  } catch (err) 
  {
    res.status(400).json({ message: err.message });
  }
});

// PUT update by Serial_Id
app.put("/api/data/Serial_Id/:id", async (req, res) => {
  try {
    const updated = await Record.findOneAndUpdate(
      { Serial_Id: req.params.id },
      req.body.inputObject,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Record not found" });

    res.json({ message: "Record updated", data: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE by Serial_Id
app.delete("/api/data/Serial_Id/:id", async (req, res) => {
  try {
    const deleted = await Record.findOneAndDelete({ Serial_Id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Record deleted", data: deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
