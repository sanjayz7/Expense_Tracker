const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const { User, Expense } = require('./model/User');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// -----------------------------------------------------
// CHECK ENV VALUES
// -----------------------------------------------------
if (!process.env.JWT_SECRET) {
  console.error("ERROR: JWT_SECRET not set in .env");
}
if (!process.env.uri) {
  console.error(" ERROR: MongoDB URI not set in .env");
}

// -----------------------------------------------------
// CONNECT MONGODB
// -----------------------------------------------------
mongoose
  .connect(process.env.uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(" MongoDB error:", err));


// -----------------------------------------------------
// REGISTER
// -----------------------------------------------------
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // Check if already registered
    console.log("Checking if user exists:", email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).json({ message: "Email already registered" });
    }

    console.log("Hashing password");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Creating user");
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    console.log("User saved");
    return res.json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


// -----------------------------------------------------
// LOGIN
// -----------------------------------------------------
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Login" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ token });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


// -----------------------------------------------------
// VERIFY TOKEN MIDDLEWARE
// -----------------------------------------------------
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(403).json({ message: "Token required for authentication" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "Invalid Token" });

    req.userId = decoded.userId;
    next();
  });
};


// -----------------------------------------------------
// ADD EXPENSE
// -----------------------------------------------------
app.post('/api/add-expense', verifyToken, async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const expense = new Expense({
      title,
      amount,
      category,
      date,
      user: req.userId,
    });

    await expense.save();

    return res.json(expense);

  } catch (err) {
    console.error("Add expense error:", err);
    return res.status(400).json({ error: err.message });
  }
});


// -----------------------------------------------------
// GET EXPENSES BY USER
// -----------------------------------------------------
app.get('/api/get-expenses', verifyToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId });
    return res.json(expenses);
  } catch (err) {
    console.error("Get expenses error:", err);
    return res.status(400).json({ error: err.message });
  }
});


// -----------------------------------------------------
// DELETE EXPENSE
// -----------------------------------------------------
app.delete('/api/delete-expense/:expenseId', verifyToken, async (req, res) => {
  try {
    const { expenseId } = req.params;

    await Expense.findOneAndDelete({
      _id: expenseId,
      user: req.userId, // Protect from deleting others' data
    });

    return res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error("Delete expense error:", err);
    return res.status(400).json({ error: err.message });
  }
});

// -----------------------------------------------------
// UPDATE EXPENSE
// -----------------------------------------------------
app.put('/api/update-expense/:expenseId', verifyToken, async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { title, amount, category, date } = req.body;

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: expenseId, user: req.userId }, // ensure only own expense
      { title, amount, category, date },
      { new: true } // return updated data
    );

    if (!updatedExpense)
      return res.status(404).json({ message: "Expense not found" });

    return res.json(updatedExpense);

  } catch (err) {
    console.error("Update expense error:", err);
    return res.status(400).json({ error: err.message });
  }
});



// -----------------------------------------------------
// START SERVER
// -----------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
