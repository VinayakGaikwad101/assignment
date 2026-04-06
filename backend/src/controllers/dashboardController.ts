import { Request, Response } from "express";
import Case from "../models/Case";
import Task from "../models/Task";

export const getDashboardSummary = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const totalCases = await Case.countDocuments();

    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    const upcomingHearings = await Case.countDocuments({
      nextHearingDate: {
        $gte: today,
        $lte: sevenDaysFromNow,
      },
    });

    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const completedTasks = await Task.countDocuments({ status: "Completed" });

    res.status(200).json({
      success: true,
      data: {
        totalCases,
        upcomingHearings,
        tasks: {
          pending: pendingTasks,
          completed: completedTasks,
          total: pendingTasks + completedTasks,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard metrics",
      error: error.message,
    });
  }
};
