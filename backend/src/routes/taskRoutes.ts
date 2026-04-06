import { Router } from "express";
import {
  createTask,
  getTasksByCase,
  toggleTaskStatus,
  deleteTask,
  updateTask,
} from "../controllers/taskController";

const router = Router({ mergeParams: true });

router.post("/", createTask);
router.get("/", getTasksByCase);

export const taskRouter = Router();
taskRouter.patch("/:id/status", toggleTaskStatus);
taskRouter.delete("/:id", deleteTask);
taskRouter.put("/:id", updateTask);

export default router;
