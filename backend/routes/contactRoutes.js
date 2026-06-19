const express = require("express");
const Contact = require("../models/Contact");
const { Parser } = require("json2csv");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

const router = express.Router();

// Save get in touch data
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, suggestion } = req.body;

    await Contact.create({
      name,
      phone,
      email,
      suggestion,
    });

    res.json({
      success: true,
      message: "Contact saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export JSON
router.get("/export/json", async (req, res) => {
  const contacts = await Contact.find().lean();

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", "attachment; filename=contacts.json");

  res.send(JSON.stringify(contacts, null, 2));
});

// Export CSV
router.get("/export/csv", async (req, res) => {
  const contacts = await Contact.find().lean();

  const fields = ["name", "phone", "email", "suggestion", "createdAt"];
  const parser = new Parser({ fields });
  const csv = parser.parse(contacts);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=contacts.csv");

  res.send(csv);
});

// Export Excel
router.get("/export/excel", async (req, res) => {
  const contacts = await Contact.find().lean();

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Get In Touch Entries");

  worksheet.columns = [
    { header: "Name", key: "name", width: 25 },
    { header: "Phone", key: "phone", width: 20 },
    { header: "Email", key: "email", width: 30 },
    { header: "Suggestion", key: "suggestion", width: 45 },
    { header: "Date", key: "createdAt", width: 25 },
  ];

  contacts.forEach((contact) => {
    worksheet.addRow({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      suggestion: contact.suggestion,
      createdAt: contact.createdAt,
    });
  });

  worksheet.getRow(1).font = { bold: true };

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=contacts.xlsx");

  await workbook.xlsx.write(res);
  res.end();
});

// Export PDF
router.get("/export/pdf", async (req, res) => {
  const contacts = await Contact.find().lean();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=contacts.pdf");

  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);

  doc.fontSize(20).text("Get In Touch Entries", { align: "center" });
  doc.moveDown();

  contacts.forEach((contact, index) => {
    doc.fontSize(12).text(`${index + 1}. ${contact.name}`);
    doc.text(`Phone: ${contact.phone}`);
    doc.text(`Email: ${contact.email}`);
    doc.text(`Suggestion: ${contact.suggestion}`);
    doc.text(`Date: ${contact.createdAt}`);
    doc.moveDown();
  });

  doc.end();
});

module.exports = router;