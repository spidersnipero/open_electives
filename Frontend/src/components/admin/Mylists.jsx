import React, { useEffect, useState } from "react";
import { DBURL } from "../../constants/consts";

const Mylists = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch(`${DBURL}/admin/mylist`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setList(data);
        console.log(data);
      });
  }, []);

  // Function to handle the deletion of a list
  const handleDeleteCourse = (listid, listname) => {
    console.log(listid, listname);

    fetch(`${DBURL}/admin/deletelist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name: listname }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.location.reload();
      });

    window.location.reload();
  };

  const downloadResponses = (listid) => {
    fetch(`${DBURL}/admin/getlist/${listid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to download file");
        }
        return response.blob(); // Process response as a blob
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob); // Create an object URL from the blob
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `reponse_of_list_${listid}.xlsx`); // Set the download attribute
        document.body.appendChild(link);
        link.click(); // Programmatically click the link to trigger download
        link.parentNode.removeChild(link); // Remove link from the DOM
        window.URL.revokeObjectURL(url); // Clean up URL object
      })
      .catch((error) => {
        if (error.message === "Failed to download file") {
          alert("No reponses found for this list");
        }
        console.error("Error downloading the file:", error);
      });
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        My Lists
      </h1>
      <div className="space-y-6">
        {list.length === 0 && <p>No list is created yet</p>}
        {list.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-700">
                {item.name}
              </h2>
              <div className="flex flex-col  gap-2">
                <button
                  onClick={() => handleDeleteCourse(item.id, item.name)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline ml-auto"
                >
                  Delete
                </button>
                <button
                  onClick={() => downloadResponses(item.id)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline ml-auto"
                >
                  Reponses
                </button>
              </div>
            </div>
            <div className="flex">
              <p className="text-gray-600 mr-4">Branch: {item.branch}</p>
              <p className="text-gray-600">Year: {item.year}</p>
            </div>
            <div>
              {item.course_data.map((course) => (
                <div
                  key={course.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex">
                    <p className="text-gray-600 mr-4">{course.name}</p>
                    <p className="text-gray-600">{course.seats} seats</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mylists;
