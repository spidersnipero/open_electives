const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const authenticateToken = require("./middleware/authenticate");

// admin routes
const adminsignin = require("./auth/signinadmin");
const adminsignout = require("./auth/signout");

const createlist = require("./routes/admin/createlist");
const deletelist = require("./routes/admin/deletelist");
const mylist = require("./routes/admin/mylist");
const getlist = require("./routes/admin/getlist");

// student routes
const studentsignin = require("./auth/siginstudent");
const getlists = require("./routes/student/getlists");
const getcourse = require("./routes/student/getcourse");
const response = require("./routes/student/response");

const app = express();
const port = 3000;

// cors
app.use(cors());
// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/auth/signinadmin", adminsignin);
app.post("/auth/signout", adminsignout);
app.post("/auth/signinstudent", studentsignin);

// authenticated routes
// admin
app.post("/admin/createlist", authenticateToken, createlist);
app.post("/admin/deletelist", authenticateToken, deletelist);
app.get("/admin/mylist", authenticateToken, mylist);
app.get("/admin/getlist/:id", authenticateToken, getlist);

// student
app.get("/student/getlists", authenticateToken, getlists);
app.get("/student/getcourse/:coursename", authenticateToken, getcourse);
app.post("/student/response", authenticateToken, response);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
