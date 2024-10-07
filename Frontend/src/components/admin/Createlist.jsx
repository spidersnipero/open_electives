import React, { useState } from "react";
import { DBURL } from "../../constants/consts";

const CreateList = () => {
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    year: "",
    list: [], // Updated to store courses as objects {name: "", seats: ""}
    course: "",
    seats: "", // New state to store seats input
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCourse = () => {
    if (
      formData.course.trim() &&
      !formData.list.some((c) => c.name === formData.course) && // Ensure unique courses
      formData.seats.trim() &&
      !isNaN(formData.seats)
    ) {
      // Add the course only if it's not already in the list and seats are valid
      setFormData({
        ...formData,
        list: [
          ...formData.list,
          { name: formData.course, seats: parseInt(formData.seats) }, // Store course with seats
        ],
        course: "", // Clear the course input after adding
        seats: "", // Clear the seats input after adding
      });
    }
  };

  const handleRemoveCourse = (indexToRemove) => {
    // Remove the course by filtering out the clicked course
    const updatedList = formData.list.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData({
      ...formData,
      list: updatedList,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const { name, branch, year, list } = formData;

    if (list.length === 0) {
      alert("Please add at least one course to the list");
      return;
    }

    await fetch(`${DBURL}/admin/createlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, branch, year, list }),
    })
      .then((res) => {
        if (res.status === 401) {
          console.log("Invalid Credentials");
          throw new Error("Invalid Credentials");
        }
        if (res.status === 500) {
          console.log("Server Error");
          throw new Error("Server Error");
        }
        if (res.status === 403) {
          console.log("Forbidden");
          throw new Error("Forbidden");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        alert("List created successfully");
        setFormData({
          name: "",
          branch: "",
          year: "",
          list: [],
          course: "",
          seats: "",
        });
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Create A List</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            List Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter List Name"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="branch"
          >
            Branch Name
          </label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Branch Name"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="year"
          >
            Year
          </label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="" disabled>
              Select Year
            </option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>

        {/* Display the list of courses with borders, seats, and remove feature */}
        {formData.list.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Added Courses:</h3>
            <ul className="list-none">
              {formData.list.map((course, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border border-gray-300 p-2 rounded mb-2"
                >
                  <span className="text-gray-700">
                    {course.name} - {course.seats} seats
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCourse(index)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="course"
          >
            Course Name
          </label>
          <div className="flex mb-2">
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
              placeholder="Enter Course Name"
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex">
            <input
              type="number"
              name="seats"
              value={formData.seats}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
              placeholder="Enter Number of Seats"
            />
            <button
              type="button"
              onClick={handleAddCourse}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
      <div>
        <p className="text-gray-500">* Course name should be unique </p>
        <p className="text-gray-500">* Branch name examples : CSE,ECE</p>
      </div>
    </div>
  );
};

export default CreateList;
