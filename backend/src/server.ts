import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import caseRoutes from "./routes/caseRoutes";
import taskRoutes, { taskRouter } from "./routes/taskRoutes";

dotenv.config();

connectDB();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "success", message: "API is running" });
});

app.use("/api/cases", caseRoutes);
app.use("/api/cases/:caseId/tasks", taskRoutes);
app.use("/api/tasks", taskRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[Error]: ${err.message}`);
  res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
