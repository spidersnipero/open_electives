import React from "react";
import { DBURL } from "../constants/consts";

const LogoutButton = () => {
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

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
