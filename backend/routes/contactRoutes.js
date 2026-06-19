const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// Save Contact Form Data
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, suggestion } = req.body;

    const contact = new Contact({
      name,
      phone,
      email,
      suggestion,
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: "Message Sent Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get All Contacts (Admin Dashboard)
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;