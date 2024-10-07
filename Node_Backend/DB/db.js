// Purpose: To connect to the database using the pg module and export the pool object to be used in other files.
const { Pool } = require("pg");

// import environment variables
require("dotenv").config();
const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE } = process.env;

const pool = new Pool({
  user: PGUSER,
  password: PGPASSWORD,
  host: PGHOST,
  port: PGPORT,
  database: PGDATABASE,
});

module.exports = pool;
