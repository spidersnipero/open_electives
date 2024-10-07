import React, { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    document.title = "Home";
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/studentlogin";
    }
  }, []);
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl  mb-6 text-center text-gray-800">Home</h1>
      <p className="text-center text-gray-600">Welcome to Vignan forms</p>
    </div>
  );
};

export default Home;
