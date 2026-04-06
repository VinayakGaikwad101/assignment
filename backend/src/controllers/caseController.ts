import { Request, Response } from "express";
import Case from "../models/Case";
import Task from "../models/Task";

export const createCase = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      caseTitle,
      clientName,
      courtName,
      caseType,
      nextHearingDate,
      stage,
    } = req.body;

    if (
      !caseTitle ||
      !clientName ||
      !courtName ||
      !caseType ||
      !nextHearingDate ||
      !stage
    ) {
      res.status(400).json({
        success: false,
        message: "Validation Failed",
        error:
          "All fields (caseTitle, clientName, courtName, caseType, nextHearingDate, stage) are required.",
      });
      return;
    }

    if (caseTitle.trim().length < 3) {
      res.status(400).json({
        success: false,
        message: "Validation Failed",
        error: "caseTitle must be at least 3 characters long.",
      });
      return;
    }

    const newCase = await Case.create(req.body);

    res.status(201).json({
      success: true,
      message: "Case created successfully",
      data: newCase,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to create case",
      error: error.message,
    });
  }
};

export const getCases = async (req: Request, res: Response): Promise<void> => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cases.length,
      data: cases,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error fetching cases",
      error: error.message,
    });
  }
};

export const getCaseById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const singleCase = await Case.findById(req.params.id);

    if (!singleCase) {
      res.status(404).json({
        success: false,
        message: "Case not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: singleCase,
    });
  } catch (error: any) {
    if (error.kind === "ObjectId") {
      res
        .status(400)
        .json({ success: false, message: "Invalid Case ID format" });
      return;
    }
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateCase = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (req.body.caseTitle && req.body.caseTitle.trim().length < 3) {
      res.status(400).json({
        success: false,
        message: "caseTitle must be at least 3 characters long",
      });
      return;
    }

    const updatedCase = await Case.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCase) {
      res.status(404).json({ success: false, message: "Case not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Case updated successfully",
      data: updatedCase,
    });
  } catch (error: any) {
    res
      .status(400)
      .json({ success: false, message: "Update failed", error: error.message });
  }
};

export const deleteCase = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const deletedCase = await Case.findByIdAndDelete(req.params.id);

    if (!deletedCase) {
      res.status(404).json({ success: false, message: "Case not found" });
      return;
    }

    await Task.deleteMany({ caseId: req.params.id });

    res.status(200).json({
      success: true,
      message: "Case and all associated tasks deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Deletion failed",
      error: error.message,
    });
  }
};
