import { Request, Response } from "express";
import Task from "../models/Task";
import Case from "../models/Case";

export const createTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { caseId } = req.params;
    const { title, dueDate, ownerName, priority } = req.body;

    if (!title || !dueDate || !ownerName) {
      res.status(400).json({
        success: false,
        message: "title, dueDate, and ownerName are required",
      });
      return;
    }

    // 2. Ensure the case exists before adding a task
    const caseExists = await Case.findById(caseId);
    if (!caseExists) {
      res
        .status(404)
        .json({ success: false, message: "Parent case not found" });
      return;
    }

    const newTask = await Task.create({
      ...req.body,
      caseId,
    });

    res.status(201).json({ success: true, data: newTask });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getTasksByCase = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const tasks = await Task.find({ caseId: req.params.caseId });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const toggleTaskStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    task.status = task.status === "Pending" ? "Completed" : "Pending";
    await task.save();

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.status}`,
      data: task,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error: any) {
    res
      .status(400)
      .json({ success: false, message: "Update failed", error: error.message });
  }
};
