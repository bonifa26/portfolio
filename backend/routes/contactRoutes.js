const express = require("express");
const Contact = require("../models/Contact");
const { Parser } = require("json2csv");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const auth = require("../middleware/auth");
const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, suggestion } = req.body;

    const contact = await Contact.create({
      name,
      phone,
      email,
      suggestion,
    });

    res.json({
      success: true,
      message: "Contact saved successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// READ
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, phone, email, suggestion } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, suggestion },
      { new: true }
    );

    res.json({
      success: true,
      message: "Contact updated successfully",
      updatedContact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// EXPORT JSON
router.get("/export/json", auth, async (req, res) => {
  const contacts = await Contact.find().lean();

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", "attachment; filename=contacts.json");

  res.send(JSON.stringify(contacts, null, 2));
});

//export pdf
router.get("/export/pdf", auth, async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 }).lean();

  const doc = new PDFDocument({ margin: 30, size: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=contacts.pdf");

  doc.pipe(res);

  doc.fontSize(20).text("Portfolio Contact Details", { align: "center" });
  doc.moveDown();

  contacts.forEach((contact, index) => {
    doc.fontSize(13).text(`${index + 1}. ${contact.name || "N/A"}`, {
      underline: true,
    });
    doc.fontSize(10).text(`Phone: ${contact.phone || "N/A"}`);
    doc.text(`Email: ${contact.email || "N/A"}`);
    doc.text(`Suggestion: ${contact.suggestion || "N/A"}`);
    doc.text(`Date: ${contact.createdAt || "N/A"}`);
    doc.moveDown();

    if (doc.y > 720) doc.addPage();
  });

  doc.end();
});

// EXPORT CSV
router.get("/export/csv", auth, async (req, res) => {
  const contacts = await Contact.find().lean();

  const fields = ["name", "phone", "email", "suggestion", "createdAt"];
  const parser = new Parser({ fields });
  const csv = parser.parse(contacts);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=contacts.csv");

  res.send(csv);
});

// EXPORT EXCEL
router.get("/export/excel", auth, async (req, res) => {
  const contacts = await Contact.find().lean();

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Contacts");

  worksheet.columns = [
    { header: "Name", key: "name", width: 25 },
    { header: "Phone", key: "phone", width: 20 },
    { header: "Email", key: "email", width: 30 },
    { header: "Suggestion", key: "suggestion", width: 40 },
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

module.exports = router;