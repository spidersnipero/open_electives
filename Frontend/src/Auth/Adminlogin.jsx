import React, { useState } from "react";
import { DBURL } from "../constants/consts";

function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    await fetch(`${DBURL}/auth/signinadmin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (res.status === 401) {
          console.log("Invalid Credentials");
          throw new Error("Invalid Credentials");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.error) {
          alert(data.error);
        } else {
          localStorage.setItem("token", data);
          localStorage.setItem("user", "admin");
          window.location.href = "/";
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <h1 className="mb-6 text-2xl font-semibold text-center">
            Admin Sign-in
          </h1>

          <div className="mb-4">
            <input
              type="email"
              id="floatingInput"
              placeholder="Email address"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              id="floatingPassword"
              placeholder="Password"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentLogin;
