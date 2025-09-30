import { NextFunction, Request, Response } from "express";
import { dashboardService } from "./dashboard.service";

const getAdminDashboardController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await dashboardService.getAdminDashboardService();

    res.status(200).json({
      success: true,
      message: "Admin Dashboard Data Fetched Successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleUserDashboardController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const result = await dashboardService.getSingleUserDashboardService(userId);

    res.status(200).json({
      success: true,
      message: "User Dashboard Data Fetched Successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const dashboardControllers = {
  getAdminDashboardController,
  getSingleUserDashboardController,
};
