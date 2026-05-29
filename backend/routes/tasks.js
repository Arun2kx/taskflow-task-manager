const express = require("express");
const Task = require("../models/Task");
const protect = require("../middleware/auth");

const router = express.Router();

// All task routes require auth
router.use(protect);

// GET /api/tasks — get all tasks for logged in user
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// POST /api/tasks — create new task
router.post("/", async (req, res) => {
  const { title, description, stage, priority } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Task title is required" });
  }

  try {
    const task = await Task.create({
      title,
      description,
      stage: stage || "todo",
      priority: priority || "medium",
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to create task" });
  }
});

// PUT /api/tasks/:id — update a task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { title, description, stage, priority } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (stage !== undefined) task.stage = stage;
    if (priority !== undefined) task.priority = priority;

    const updated = await task.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update task" });
  }
});

// DELETE /api/tasks/:id — delete a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task" });
  }
});

module.exports = router;
