import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TaskTracker from "./components/TaskTracker";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow p-4 flex gap-4 justify-between">
      <div className="flex gap-4">
        <Link to="/" className="text-blue-500 hover:underline">
          Home
        </Link>
        <Link to="/tasks" className="text-blue-500 hover:underline">
          Tasks
        </Link>
        <Link to="/about" className="text-blue-500 hover:underline">
          About
        </Link>
      </div>
      {user ? (
        <button className="text-red-500" onClick={logout}>
          Logout
        </button>
      ) : (
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      )}
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="min-h-screen bg-gray-100 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<TaskTracker />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
