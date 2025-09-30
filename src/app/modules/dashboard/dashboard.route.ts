import express from "express";
import { dashboardControllers } from "./dashboard.controller";

const router = express.Router();

router.get(
  "/dashboard/admin/",
  dashboardControllers.getAdminDashboardController
);

router.get(
  "/dashboard/user/:userId",
  dashboardControllers.getSingleUserDashboardController
);

export const dashboardRoutes = router;
