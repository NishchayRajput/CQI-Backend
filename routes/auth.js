const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcryptjs = require("bcryptjs");

// Signup
router.post("/signup", async (req, res) => {
  // Normalize header keys to lowercase
  const username = req.headers["username"];
  const Name = req.headers["name"]; // Use lowercase 'name' to access the header
  const password = req.headers["password"];
  const role = req.headers["role"];
  const email = req.headers["email"];

  try {
    if (!Name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10); // Ensure password is hashed
    const user = new User({ username, Name, password: hashedPassword, role, email });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error registering user" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const username = req.headers["username"];
  const password = req.headers["password"];
  
  try {
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    if (!user.verify) {
      return res.status(403).json({ error: "User is not verified" });
    }

    // Save user info in session
    req.session.user = {
      id: user._id,
      role: user.role,
      name: user.Name,
      email: user.email,
      username: user.username,
    };
    res.status(200).json({ message: "Login successful", user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error logging in" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
        console.error(err);
      return res.status(500).json({ error: "Error logging out" });
    } else {
      res.status(200).json({ message: "Logout successful" });
    }
  });
});

// Check if logged in
router.get("/check", (req, res) => {
  // console.log(req);
  console.log(req.session);
  console.log(req.session.user);
  if (req.session && req.session.user) {
    res.status(200).json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

module.exports = router;
