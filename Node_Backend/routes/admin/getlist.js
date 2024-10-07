const router = require("express").Router();
const ExcelJS = require("exceljs");

router.get("/admin/getlist/:id", async (req, res) => {
  try {
    const pool = require("../../DB/db");
    const { id } = req.params;

    // Fetch all required data in a single query using JOIN
    const query = `
      SELECT 
        fr.email_id, 
        fr.response,
        l.course_data, 
        s.percentage
      FROM form_responses fr
      JOIN list l ON fr.form_id = l.id
      JOIN students s ON fr.email_id = s.email_id
      WHERE fr.form_id = $1
      AND l.year = s.year
      ORDER BY s.percentage DESC
    `;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    // Extract course data and create a course availability object
    const courseData = rows[0].course_data;
    const courseDataObj = courseData.reduce((obj, course) => {
      obj[course.name] = course.seats;
      return obj;
    }, {});

    // Prepare allotment array
    const allotment = [];

    for (const row of rows) {
      const { email_id, response } = row;

      // Parse and sort courses by user's response order
      const sortedCourses = Object.keys(response).sort(
        (a, b) => response[a] - response[b]
      );

      // Find the first course with available seats and allot it
      const allottedCourse = sortedCourses.find(
        (course) => courseDataObj[course] > 0
      );

      if (allottedCourse) {
        courseDataObj[allottedCourse] -= 1;
        allotment.push({ email: email_id, allot: allottedCourse });
      }
    }

    // Generate Excel file using ExcelJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Allotment List");

    // Define columns
    worksheet.columns = [
      { header: "Email", key: "email", width: 30 },
      { header: "Allotted Course", key: "allot", width: 20 },
    ];

    // Add rows to the worksheet from allotment array
    allotment.forEach((item) => worksheet.addRow(item));

    // Set response headers to send the Excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=allotment-list.xlsx"
    );

    // Write the Excel file to the response stream
    await workbook.xlsx.write(res);

    // End the response
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
