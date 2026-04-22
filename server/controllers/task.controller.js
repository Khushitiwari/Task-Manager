
import Task from "../models/task.model.js";

// Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      user: req.user, // from auth middleware
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ msg: "Failed to create task" });
  }
};

//  Get All Tasks (for logged-in user)
export const getTasks = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = { user: req.user };

    // apply status filter if provided
    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch tasks" });
  }
};

// Get Single Task
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching task" });
  }
};

// Update Task
export const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ msg: "Failed to update task" });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!deletedTask) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.status(200).json({ msg: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Failed to delete task" });
  }
};