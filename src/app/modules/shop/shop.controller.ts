import { NextFunction, Request, Response } from "express";
import { shopServices } from "./shop.service";

const createShopController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const filePath = req.file ? req.file.path : undefined;

    const formData = {
      ...data,
      attachment: filePath,
    };

    const result = await shopServices.createShopService(formData);

    res.status(200).json({
      success: true,
      message: "Shop Created Successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAllShopController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = req.query;

    const pageNumber = page ? parseInt(page as string, 10) : undefined;
    const pageSize = limit ? parseInt(limit as string, 10) : undefined;

    const searchText = req.query.searchText as string | undefined;

    const searchFields = ["name", "description"];

    const result = await shopServices.getAllShopService(
      pageNumber,
      pageSize,
      searchText,
      searchFields
    );

    res.status(200).json({
      success: true,
      message: "Shops Fetched Successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//Get single shop data
const getSingleShopController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shopId } = req.params;
    const result = await shopServices.getSingleShopService(shopId);
    res.status(200).json({
      success: true,
      message: "Shop Fetched Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//Update single shop controller
const updateSingleShopController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shopId } = req.params;
    const data = req.body;
    const filePath = req.file ? req.file.path : undefined;

    const shopData = {
      ...data,
      attachment: filePath,
    };

    const result = await shopServices.updateSingleShopService(shopId, shopData);

    res.status(200).json({
      success: true,
      message: "Shop Updated Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//Delete single shop controller
const deleteSingleShopController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shopId } = req.params;
    await shopServices.deleteSingleShopService(shopId);
    res.status(200).json({
      success: true,
      message: "Shop Deleted Successfully!",
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

//Delete many shop controller
const deleteManyShopsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const shopIds = req.body;

    if (!Array.isArray(shopIds) || shopIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty shop IDs array provided",
        data: null,
      });
    }

    const result = await shopServices.deleteManyShopsService(shopIds);

    res.status(200).json({
      success: true,
      message: `Bulk shop Delete Successful! Deleted ${result.deletedCount} shops.`,
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

export const shopControllers = {
  createShopController,
  getAllShopController,
  getSingleShopController,
  updateSingleShopController,
  deleteSingleShopController,
  deleteManyShopsController,
};
