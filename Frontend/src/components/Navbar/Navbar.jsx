import React from "react";
import logo from "../../assets/vignan_logo.svg";
import { DBURL } from "../../constants/consts";
import { Link } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const handleLogout = async () => {
    localStorage.removeItem("token");
    await fetch(`${DBURL}/auth/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));

    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo/Image on the left */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-24 sm:h-15 sm:w-32 mr-3 cursor-pointer" // Adjust the size of the image for different screen sizes
            onClick={() => (window.location.href = "/")}
          />
          <span className="text-lg sm:text-xl font-semibold">Vignan Forms</span>
        </div>

        {/* Hamburger menu for mobile screens */}
        <div className="block lg:hidden">
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
            onClick={() => {
              const menu = document.getElementById("mobile-menu");
              menu.classList.toggle("hidden");
            }}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Links for larger screens */}
        <div className="hidden lg:flex items-center space-x-4">
          {token && localStorage.getItem("user") === "admin" && (
            <Link
              to="/createlist"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create List
            </Link>
          )}
          {token && (
            <button
              onClick={handleLogout}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <div className="hidden lg:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {token && localStorage.getItem("user") === "admin" && (
            <Link
              to="/createlist"
              className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create List
            </Link>
          )}
          {token && (
            <button
              onClick={handleLogout}
              className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full text-left"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
