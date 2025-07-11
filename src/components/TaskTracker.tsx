import React, { useState } from "react";

type Task = {
  text: string;
  done: boolean;
};

const TaskTracker: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState<string>("");

  const addTask = () => {
    if (input.trim() === "") return;
    setTasks([...tasks, { text: input, done: false }]);
    setInput("");
  };

  const toggleTask = (index: number) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  const removeTask = (index: number) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded-2xl shadow-xl">
      <h1 className="text-2xl font-bold mb-4">📝 Task Tracker</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="flex-grow p-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={addTask}
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {tasks.map((task, index) => (
          <li
            key={index}
            className={`flex justify-between items-center p-2 border rounded ${
              task.done ? "bg-green-100 line-through text-gray-500" : ""
            }`}
          >
            <span onClick={() => toggleTask(index)} className="cursor-pointer">
              {task.text}
            </span>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => removeTask(index)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskTracker;
