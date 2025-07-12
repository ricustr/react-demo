import React from "react";
import TaskTracker from "./components/TaskTracker";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <TaskTracker />
    </div>
  );
};

export default App;
