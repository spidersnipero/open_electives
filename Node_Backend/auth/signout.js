const express = require("express");
const router = express.Router();

router.post("/auth/signout", async (req, res) => {
  // Purpose: To sign out a user by removing the session from the session_table.
  // Expected Input: An object with an email.
  // Expected Output: None.
  // Dependencies: pool.
  // Note: This is a POST request.
  try {
    const { token } = req.body;
    const pool = require("../DB/db");
    await pool.query("DELETE FROM session_table WHERE token = $1", [token]);
    res.json("Signout successful");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
