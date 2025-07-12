import React, { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, query, where, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

type Subtask = {
  text: string;
  done: boolean;
};

type Task = {
  id: string;
  text: string;
  done: boolean;
  subtasks: Subtask[];
  category?: string;
  time?: string;
};

const TaskTracker: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [collapsedTasks, setCollapsedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "tasks"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          done: data.done,
          subtasks: data.subtasks || [],
          category: data.category,
          time: data.time
        } as Task;
      });
      setTasks(taskList);
    });
    return () => unsubscribe();
  }, [user]);

  const addTask = async () => {
    if (!input.trim() || !user) return;
    await addDoc(collection(db, "tasks"), {
      uid: user.uid,
      text: input,
      done: false,
      subtasks: [],
      category: "General",
      time: ""
    });
    setInput("");
  };

  const toggleTask = async (task: Task) => {
    await updateDoc(doc(db, "tasks", task.id), {
      done: !task.done
    });
  };

  const toggleSubtask = async (task: Task, index: number) => {
    const updated = [...task.subtasks];
    updated[index].done = !updated[index].done;
    await updateDoc(doc(db, "tasks", task.id), {
      subtasks: updated
    });
  };

  const addSubtask = async (task: Task, text: string) => {
    const updated = [...task.subtasks, { text, done: false }];
    await updateDoc(doc(db, "tasks", task.id), {
      subtasks: updated
    });
  };

  const deleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, "tasks", taskId));
  };

  const toggleCollapse = (taskId: string) => {
    setCollapsedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Projects</h1>
        
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="group">
              <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-4 flex-grow">
                  {task.subtasks.length > 0 && (
                    <button
                      onClick={() => toggleCollapse(task.id)}
                      className="text-gray-400 hover:text-gray-600 transition-transform duration-200 mr-1"
                      style={{
                        transform: collapsedTasks.has(task.id) ? 'rotate(-90deg)' : 'rotate(0deg)'
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                  
                  <button
                    onClick={() => toggleTask(task)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.done 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {task.done && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                  
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <span className={`text-gray-900 ${task.done ? 'line-through text-gray-500' : ''}`}>
                        {task.text}
                      </span>
                    </div>
                    {task.time && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                            <path d="M7 1a6 6 0 100 12A6 6 0 007 1zM7 3.5v3.5l2.5 1.5"/>
                          </svg>
                          {task.time}
                        </span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="text-gray-400">
                          <path d="M7 1a6 6 0 100 12A6 6 0 007 1zM5.5 4.5h3v5h-3v-5z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                
                {task.category && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{task.category}</span>
                    <span className="text-orange-400">#</span>
                  </div>
                )}
                
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500 ml-3"
                  title="Delete task"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 2V1a1 1 0 011-1h2a1 1 0 011 1v1h4v2H2V2h4zM3 4h10l-.5 9a1 1 0 01-1 1H4.5a1 1 0 01-1-1L3 4z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              
              {task.subtasks.length > 0 && !collapsedTasks.has(task.id) && (
                <div className="ml-10 mt-2 space-y-2">
                  {task.subtasks.map((sub, i) => (
                    <div key={i} className="flex items-center gap-3 py-1">
                      <button
                        onClick={() => toggleSubtask(task, i)}
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                          sub.done 
                            ? 'border-green-500 bg-green-500' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {sub.done && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                      <span className={`text-sm ${sub.done ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                        {sub.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {!collapsedTasks.has(task.id) && (
                <SubtaskForm onAdd={(text) => addSubtask(task, text)} />
              )}
            </div>
          ))}
        </div>
        
        <button
          onClick={() => {
            const input = document.getElementById('new-task-input') as HTMLInputElement;
            input?.focus();
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mt-6 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Add task</span>
        </button>
        
        <div className="mt-4 flex gap-2">
          <input
            id="new-task-input"
            className="flex-grow p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to be done?"
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            onClick={addTask}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const SubtaskForm: React.FC<{ onAdd: (text: string) => void }> = ({ onAdd }) => {
  const [text, setText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="ml-10 mt-2">
      {!isVisible ? (
        <button
          onClick={() => setIsVisible(true)}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          + Add subtask
        </button>
      ) : (
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return;
            onAdd(text);
            setText("");
            setIsVisible(false);
          }}
        >
          <input
            className="flex-grow p-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add subtask"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
            onBlur={() => {
              if (!text.trim()) setIsVisible(false);
            }}
          />
          <button 
            type="submit"
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors"
          >
            Add
          </button>
        </form>
      )}
    </div>
  );
};

export default TaskTracker;
