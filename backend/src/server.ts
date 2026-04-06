import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { connectDB } from "./config/db";
import { typeDefs, resolvers } from "./graphql/schema";
import caseRoutes from "./routes/caseRoutes";
import taskRoutes, { taskRouter } from "./routes/taskRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import { errorHandler } from "./middleware/errorMiddleware";

dotenv.config();
connectDB();

const app: Application = express();

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(cors());
  app.use(express.json());

  app.use("/graphql", expressMiddleware(server) as any);

  app.get("/api/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "success", message: "API is running" });
  });

  app.use("/api/cases", caseRoutes);
  app.use("/api/cases/:caseId/tasks", taskRoutes);
  app.use("/api/tasks", taskRouter);
  app.use("/api/dashboard", dashboardRoutes);

  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
