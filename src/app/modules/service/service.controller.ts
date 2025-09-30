import { NextFunction, Request, Response } from "express";
import { serviceServices } from "./service.service";

const createServiceController = async (
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

    const result = await serviceServices.createServiceService(formData);

    res.status(200).json({
      success: true,
      message: "Service Created Successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAllServiceController = async (
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

    const result = await serviceServices.getAllServiceService(
      pageNumber,
      pageSize,
      searchText,
      searchFields
    );

    res.status(200).json({
      success: true,
      message: "Services Fetched Successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//Get single Service data
const getSingleServiceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { serviceId } = req.params;
    const result = await serviceServices.getSingleServiceService(serviceId);
    res.status(200).json({
      success: true,
      message: "Service Fetched Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//Update single Service controller
const updateSingleServiceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { serviceId } = req.params;
    const data = req.body;
    const filePath = req.file ? req.file.path : undefined;

    const serviceData = {
      ...data,
      attachment: filePath,
    };

    const result = await serviceServices.updateSingleServiceService(
      serviceId,
      serviceData
    );

    res.status(200).json({
      success: true,
      message: "Service Updated Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//Delete single Service controller
const deleteSingleServiceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { serviceId } = req.params;
    await serviceServices.deleteSingleServiceService(serviceId);
    res.status(200).json({
      success: true,
      message: "Service Deleted Successfully!",
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

//Delete many Service controller
const deleteManyServicesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const serviceIds = req.body;

    if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty Service IDs array provided",
        data: null,
      });
    }

    const result = await serviceServices.deleteManyServicesService(serviceIds);

    res.status(200).json({
      success: true,
      message: `Bulk Service Delete Successful! Deleted ${result.deletedCount} Services.`,
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

export const serviceControllers = {
  createServiceController,
  getAllServiceController,
  getSingleServiceController,
  updateSingleServiceController,
  deleteSingleServiceController,
  deleteManyServicesController,
};
