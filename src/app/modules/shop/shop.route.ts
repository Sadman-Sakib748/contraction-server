import express from "express";
import { uploadService } from "../upload/upload";
import { shopControllers } from "./shop.controller";

const router = express.Router();

router.post(
  "/shop/",
  uploadService.single("attachment"),
  shopControllers.createShopController
);

router.get("/shop/", shopControllers.getAllShopController);

router.get("/shop/:shopId/", shopControllers.getSingleShopController);

router.patch(
  "/shop/:shopId/",
  uploadService.single("attachment"),
  shopControllers.updateSingleShopController
);

router.delete("/shop/:shopId/", shopControllers.deleteSingleShopController);

router.post("/shop/bulk-delete/", shopControllers.deleteManyShopsController);

export const shopRoutes = router;
