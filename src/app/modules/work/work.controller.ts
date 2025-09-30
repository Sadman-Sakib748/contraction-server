import { NextFunction, Request, Response } from "express";
import { workServices } from "./work.service";
import { deleteFileFromStorage } from "../../utils/deleteFilesFromStorage";
import appError from "../../errors/appError";

const createWorkController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const files = req.files as Express.Multer.File[];

    const mainImage = files.find(
      (file) => file.fieldname === "mainImage"
    )?.path;

    const images = files
      .filter((file) => file.fieldname.startsWith("images"))
      .map((file) => file.path);

    const formData = {
      ...data,
      ...(mainImage && { mainImage }),
      ...(images.length && { images }),
    };

    const result = await workServices.createWorkService(formData);

    res.status(200).json({
      success: true,
      message: "Work Created Successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAllWorkController = async (
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

    const result = await workServices.getAllWorkService(
      pageNumber,
      pageSize,
      searchText,
      searchFields
    );

    res.status(200).json({
      success: true,
      message: "Works Fetched Successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//Get single Work data
const getSingleWorkController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workId } = req.params;
    const result = await workServices.getSingleWorkService(workId);
    res.status(200).json({
      success: true,
      message: "Work Fetched Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getSingleWorkBySlugController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workSlug } = req.params;
    const result = await workServices.getSingleWorkBySlugService(workSlug);
    res.status(200).json({
      success: true,
      message: "Work Fetched Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//Update single Work controller
const updateSingleWorkController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workId } = req.params;

    const data = req.body;
    const files = req.files as Express.Multer.File[];

    const mainImage = files.find(
      (file) => file.fieldname === "mainImage"
    )?.path;
    const uploadedImages = files
      .filter((file) => file.fieldname.startsWith("images"))
      .map((file) => file.path);

    const existingProduct = await workServices.getSingleWorkService(workId);

    if (!existingProduct) {
      throw new appError(404, "Work not found");
    }

    const existingImages = Array.isArray(existingProduct.images)
      ? existingProduct.images
      : [];

    const stringImages = Array.isArray(data.images)
      ? data.images
      : data.images
      ? [data.images]
      : [];

    const imagesToKeep = [...stringImages, ...uploadedImages];
    const imagesToDelete = existingImages.filter(
      (image) => !imagesToKeep.includes(image)
    );

    for (const image of imagesToDelete) {
      try {
        await deleteFileFromStorage(image);
      } catch (err) {
        console.error(`Failed to delete image: ${image}`, err);
      }
    }

    const workData = {
      ...data,
      ...(mainImage && { mainImage }),
      images: imagesToKeep,
    };

    const result = await workServices.updateSingleWorkService(workId, workData);

    res.status(200).json({
      success: true,
      message: "Work Updated Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//Delete single Work controller
const deleteSingleWorkController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workId } = req.params;
    await workServices.deleteSingleWorkService(workId);
    res.status(200).json({
      success: true,
      message: "Work Deleted Successfully!",
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

//Delete many Work controller
const deleteManyWorksController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workIds = req.body;

    if (!Array.isArray(workIds) || workIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty Work IDs array provided",
        data: null,
      });
    }

    const result = await workServices.deleteManyWorksService(workIds);

    res.status(200).json({
      success: true,
      message: `Bulk Work Delete Successful! Deleted ${result.deletedCount} Works.`,
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

export const workControllers = {
  createWorkController,
  getAllWorkController,
  getSingleWorkController,
  getSingleWorkBySlugController,
  updateSingleWorkController,
  deleteSingleWorkController,
  deleteManyWorksController,
};
