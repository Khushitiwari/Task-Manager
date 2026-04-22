
import { useState, useEffect } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/taskApi";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addTask = async (data) => {
    await createTask(data);
    fetchTasks();
  };

  const editTask = async (id, data) => {
    await updateTask(id, data);
    fetchTasks();
  };

  const removeTask = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  useEffect(() => {
  const loadTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  loadTasks();
}, []);

  return { tasks, addTask, editTask, removeTask };
};