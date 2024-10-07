import { Routes, Route, Link } from "react-router-dom";

import Home from "./components/Home";
import Navbar from "./components/Navbar/Navbar";
import NotFound from "./components/Notfound";

// login components
import StudentLogin from "./Auth/Studentlogin";
import AdminLogin from "./Auth/Adminlogin";
import LogoutButton from "./Auth/Logoutbutton";

// admin components
import CreateList from "./components/admin/Createlist";
import Mylists from "./components/admin/Mylists";

// student components
import Studentlist from "./components/student/Studentlist";
import StudentForm from "./components/student/StudentForm";

function App() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  console.log(user);

  return (
    <>
      <Navbar />
      {token && user ? (
        <Routes>
          {user === "student" ? (
            <>
              <Route path="/" element={<Studentlist />} />
              <Route path="/fillform/:formname" element={<StudentForm />} />
            </>
          ) : (
            <>
              <Route path="/createlist" element={<CreateList />} />
              <Route path="/" element={<Mylists />} />
            </>
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/studentlogin" element={<StudentLogin />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </>
  );
}

export default App;
