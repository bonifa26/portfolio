const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

app.get("/", (req, res) => {
  res.send("Portfolio Backend Running...");
});

const PORT = process.env.PORT || 5000;

const bcrypt = require("bcryptjs");
const User = require("./models/User");

app.get("/create-admin", async (req, res) => {
  try {
    const adminExists = await User.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (adminExists) {
      return res.send("Admin already exists");
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    await User.create({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
    });

    res.send("Admin created successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});