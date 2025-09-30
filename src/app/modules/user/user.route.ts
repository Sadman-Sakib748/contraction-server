import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { userValidationSchemas } from "./user.validation";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../interface/global/global.interface";
import { uploadService } from "../upload/upload";

const router = express.Router();

router.post(
  "/auth/register/",
  uploadService.none(),
  validateRequest(userValidationSchemas.createUserValidationSchema),
  userControllers.createUserController
);

router.post(
  "/auth/login/",
  validateRequest(userValidationSchemas.userLoginValidationSchema),
  userControllers.loginUserController
);

router.post(
  "/auth/change-password/",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(userValidationSchemas.changePasswordValidationSchema),
  userControllers.changeUserPasswordController
);

router.post(
  "/auth/forgot-password/",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(userValidationSchemas.forgetPasswordValidationSchema),
  userControllers.forgetPasswordController
);

router.post(
  "/auth/reset-password/",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(userValidationSchemas.resetPasswordValidationSchema),
  userControllers.resetPasswordController
);

router.get(
  "/auth/user/",
  auth(UserRole.ADMIN),
  userControllers.getAllUserController
);

router.get("/auth/user/:userId/", userControllers.getSingleUserController);

router.patch(
  "/auth/user/status/:userId/",
  auth(UserRole.ADMIN),
  userControllers.updateUserStatusController
);

router.patch("/auth/user/:userId/", userControllers.updateSingleUserController);

export const userRoutes = router;
