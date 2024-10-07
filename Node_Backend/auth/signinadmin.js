const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/auth/signinadmin", async (req, res) => {
  // Purpose: To sign in an admin by verifying the admin's email and password and returning a JWT token.
  // Expected Input: An object with an email and password.
  // Expected Output: A JWT token.
  // Dependencies: jwt, express, bcrypt, pool.
  // Note: This is a POST request.
  try {
    const { email, password } = req.body;
    const pool = require("../DB/db");
    const admin = await pool.query("SELECT * FROM admin WHERE email = $1", [
      email,
    ]);

    if (admin.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }

    const validPassword = password === admin.rows[0].password;

    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }

    const token = jwt.sign(
      { id: admin.rows[0].admin_id },
      process.env.jwtSecret
    );

    // store email and token in session table
    const session = await pool.query(
      "INSERT INTO session_table (email, token) VALUES ($1, $2) RETURNING *",
      [email, token]
    );

    res.json(token);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
