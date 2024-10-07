const router = require("express").Router();

router.post("/admin/createlist", async (req, res) => {
  // Purpose: To create a list of items.
  // Expected Input: An object with a list of items.
  // Expected Output: A list of items.
  // Dependencies: express, pool.
  // Note: This is a POST request.
  try {
    const pool = require("../../DB/db");
    const token = req.token;

    const email = await pool.query(
      "SELECT email FROM session_table WHERE token = $1",
      [token]
    );

    const { name, branch, year, list } = req.body;

    // insert all values into list including course name, branch, year, seats
    await pool.query(
      "INSERT INTO list (admin_email, name, branch, year, course_data) VALUES ($1, $2, $3, $4, $5)",
      [email.rows[0].email, name, branch, year, list]
    );

    res.json("list created");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
