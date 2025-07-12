import React from "react";
import TaskTracker from "./components/TaskTracker";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";

const App: React.FC = () => {
  return (
    <Router>
      <nav className="bg-white shadow p-4 flex gap-4">
        <Link to="/" className="text-blue-500 hover:underline">Home</Link>
        <Link to="/tasks" className="text-blue-500 hover:underline">Tasks</Link>
        <Link to="/about" className="text-blue-500 hover:underline">About</Link>
      </nav>
      <div className="min-h-screen bg-gray-100 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<TaskTracker />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
