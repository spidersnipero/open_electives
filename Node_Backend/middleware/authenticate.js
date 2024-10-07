const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.jwtSecret, async (err, user) => {
    if (err) {
      console.error("Token verification failed:", err.message);
      return res.sendStatus(403);
    }
    req.user = user;
    try {
      const pool = require("../DB/db");
      const session = await pool.query(
        "SELECT * FROM session_table WHERE token = $1",
        [token]
      );
      if (session.rows.length === 0) {
        return res.sendStatus(403);
      }
    } catch (err) {
      console.error("Session table query failed:", err.message);
      return res.sendStatus(500);
    }
    req.token = token;
    next();
  });
}

module.exports = authenticateToken;
