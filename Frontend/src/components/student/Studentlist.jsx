import React, { useEffect, useState } from "react";
import { DBURL } from "../../constants/consts";
import { Link } from "react-router-dom";

const Studentlist = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch(`${DBURL}/student/getlists`, {
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl  mb-6 text-center text-gray-800">Forms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.length === 0 && (
          <p className="text-center text-gray-600">No list is created yet</p>
        )}
        {list.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {item.name}
            </h2>
            <p className="text-gray-600">{item.description}</p>
            <div className="flex justify-end mt-4">
              <Link
                to={`/fillform/${item.name}`}
                className="text-sm text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-lg"
              >
                Fill Form
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Studentlist;
