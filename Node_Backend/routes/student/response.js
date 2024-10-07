const router = require("express").Router();

router.post("/student/response", async (req, res) => {
  try {
    const pool = require("../../DB/db");
    const token = req.token;

    const email = await pool.query(
      "SELECT email FROM session_table WHERE token = $1",
      [token]
    );

    const priorities = req.body.priorities;
    const formid = req.body.formid;
    const emailid = email.rows[0].email;

    if (!priorities || !formid || !emailid) {
      throw new Error("Invalid request");
    }
    const doesResponseExist = await pool.query(
      "SELECT * FROM form_responses WHERE email_id = $1 AND form_id = $2",
      [emailid, formid]
    );
    if (doesResponseExist.rows.length) {
      // update the response
      await pool.query(
        "UPDATE form_responses SET response = $1 WHERE email_id = $2 AND form_id = $3",
        [priorities, emailid, formid]
      );
    } else {
      await pool.query(
        "INSERT INTO form_responses (email_id, form_id, response) VALUES ($1, $2, $3)",
        [emailid, formid, priorities]
      );
    }

    res.json({ message: "Response submitted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
