import express from "express";
import { uploadService } from "../upload/upload";
import { workControllers } from "./work.controller";

const router = express.Router();

router.post(
  "/work/",
  uploadService.any(),
  workControllers.createWorkController
);

router.get("/work/", workControllers.getAllWorkController);

router.get("/work/:workId/", workControllers.getSingleWorkController);

router.get(
  "/work/slug/:workSlug/",
  workControllers.getSingleWorkBySlugController
);

router.patch(
  "/work/:workId/",
  uploadService.any(),
  workControllers.updateSingleWorkController
);

router.delete("/work/:workId/", workControllers.deleteSingleWorkController);

router.post("/work/bulk-delete/", workControllers.deleteManyWorksController);

export const workRoutes = router;
