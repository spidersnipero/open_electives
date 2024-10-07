const router = require("express").Router();

router.post("/admin/deletelist", async (req, res) => {
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

    const { name } = req.body;

    const deleted = await pool.query(
      "DELETE FROM list WHERE name = $1 AND admin_email = $2",
      [name, email.rows[0].email]
    );

    res.json("list deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
