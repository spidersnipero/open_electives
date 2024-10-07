import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link className=" text-cyan-600 text-2xl underline" to="/">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
