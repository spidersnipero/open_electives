const router = require("express").Router();

router.get("/student/getlists", async (req, res) => {
  try {
    const pool = require("../../DB/db");
    const token = req.token;

    const email = await pool.query(
      "SELECT email FROM session_table WHERE token = $1",
      [token]
    );

    const student = await pool.query(
      "SELECT * FROM students WHERE email_id = $1",
      [email.rows[0].email]
    );

    const { branch, year } = student.rows[0];

    const lists = await pool.query(
      "SELECT * FROM list WHERE branch = $1 AND year = $2",
      [branch, year]
    );

    res.json(lists.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
