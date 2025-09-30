import express from "express";
import { uploadService } from "../upload/upload";
import { serviceControllers } from "./service.controller";

const router = express.Router();

router.post(
  "/service/",
  uploadService.single("attachment"),
  serviceControllers.createServiceController
);

router.get("/service/", serviceControllers.getAllServiceController);

router.get(
  "/service/:serviceId/",
  serviceControllers.getSingleServiceController
);

router.patch(
  "/service/:serviceId/",
  uploadService.single("attachment"),
  serviceControllers.updateSingleServiceController
);

router.delete(
  "/service/:serviceId/",
  serviceControllers.deleteSingleServiceController
);

router.post(
  "/service/bulk-delete/",
  serviceControllers.deleteManyServicesController
);

export const serviceRoutes = router;
