const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const User = require("./models/User");
const Account = require("./models/Account");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send({ message: "Access Denied" });

  jwt.verify(token, "secretKey", (err, user) => {
    if (err) return res.status(403).send({ message: "Invalid Token" });
    req.user = user;
    next();
  });
};

// Signup route
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user and save to the database
  const newUser = new User({
    username,
    password: hashedPassword,
  });

  await newUser.save();
  res.json({ message: "Signup successful" });
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).send({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, username: user.username },
    "secretKey",
    { expiresIn: "1h" }
  );
  res.json({ message: "Login successful", token });
});

// Get accounts route (requires authentication)
app.get("/accounts", authenticateToken, async (req, res) => {
  const accounts = await Account.find();
  res.json(accounts);
});

// Update account status route (requires authentication)
app.post("/accounts/:id/status", authenticateToken, async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const account = await Account.findById(id);
  if (!account) return res.status(404).send({ message: "Account not found" });

  account.targetStatus = status;
  await account.save();
  res.json({ message: "Status updated successfully", account });
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
