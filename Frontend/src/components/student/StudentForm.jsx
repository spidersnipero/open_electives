import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DBURL } from "../../constants/consts";

const StudentForm = () => {
  const { formname } = useParams(); // Destructured the parameter
  const [courseData, setCourseData] = useState({});
  const [priority, setPriority] = useState({});

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`${DBURL}/student/getcourse/${formname}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();
        console.log(data[0]); // Log before setting the state
        setCourseData(data[0]); // Setting the state
        console.log(data[0]["course_data"].length); // Log length directly from data
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourseData();
  }, [formname]);

  // Handle input change for priority
  const handlePriorityChange = (e, courseName) => {
    setPriority({
      ...priority,
      [courseName]: e.target.value,
    });
  };

  const checkPriorityFormat = () => {
    // Check if all priorities are set
    const priorities = Object.values(priority);

    if (new Set(priorities).size !== courseData?.course_data?.length) {
      alert("Please set all priorities with unique values");
      return false;
    }

    // Check if all priorities are unique
    if (new Set(priorities).size !== priorities.length) {
      alert("Please set unique priorities");
      return false;
    }

    return true;
  };

  // Submit form with course choices and priorities
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkPriorityFormat()) {
      return;
    }
    await fetch(`${DBURL}/student/response`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },

      body: JSON.stringify({
        formid: courseData?.id,
        priorities: priority,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Form submitted successfully:", data);
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        alert("Error submitting form Do note only single resonse is allowed");
      });
    // clear the form  and alert the user that the form has been submitted
    setPriority({});
    alert("Form submitted successfully");
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
        {formname}
      </h1>
      <div className="mb-4 md:mb-6 flex flex-col md:flex-row md:space-x-8 text-center md:text-left">
        <h3 className="text-lg md:text-xl font-medium text-gray-700">
          Year : {courseData?.year}
        </h3>
        <h3 className="text-lg md:text-xl font-medium text-gray-700">
          Branch : {courseData?.branch}
        </h3>
        <h3 className=" font-medium text-gray-700">
          * You can update resonse by submitting the form again
        </h3>
      </div>

      {/* Conditional rendering based on the existence of `course_data` */}
      {courseData?.course_data?.length > 0 ? (
        <form onSubmit={handleSubmit}>
          {courseData.course_data.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 md:p-6 border border-gray-200 mb-4"
            >
              <div className="flex flex-col md:flex-row justify-between items-center">
                {/* Course name and seats */}
                <div className="mb-4 md:mb-0">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                    {item.name}
                  </h2>
                  <p className="text-gray-600">Available seats: {item.seats}</p>
                </div>
                {/* Priority input */}
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                  <label className="block text-gray-700">Set Priority:</label>
                  <input
                    type="number"
                    min="1"
                    max={courseData.course_data.length}
                    value={priority[item.name] || ""}
                    onChange={(e) => handlePriorityChange(e, item.name)}
                    className="block w-full md:w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder={`Priority`}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-center md:justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg"
            >
              Submit Choices
            </button>
          </div>
        </form>
      ) : (
        <p className="text-center text-gray-600">Loading courses...</p>
      )}
    </div>
  );
};

export default StudentForm;
