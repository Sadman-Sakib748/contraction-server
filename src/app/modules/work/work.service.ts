import mongoose from "mongoose";
import { paginateAndSort } from "../../utils/paginateAndSort";
import { formatResultImage } from "../../utils/formatResultImage";
import { IWork } from "./work.interface";
import { workModel } from "./work.model";
import { generateSlug } from "../../utils/generateSlug";
import config from "../../config";
import appError from "../../errors/appError";
import path from "path";
import fs from "fs";

//Create a work into database
const createWorkService = async (workData: IWork, filePath?: string) => {
  const slug = generateSlug(workData.name);
  const dataToSave = { ...workData, slug, filePath };
  const result = await workModel.create(dataToSave);
  return result;
};

// Get all works with optional pagination
const getAllWorkService = async (
  page?: number,
  limit?: number,
  searchText?: string,
  searchFields?: string[]
) => {
  let results;

  if (page && limit) {
    const query = workModel.find();
    const result = await paginateAndSort(
      query,
      page,
      limit,
      searchText,
      searchFields
    );

    result.results = formatResultImage(result.results, "mainImage") as IWork[];

    if (Array.isArray(result.results)) {
      result.results = result.results.map((work) => {
        if (Array.isArray(work.images)) {
          work.images = work.images.map((image: string) =>
            typeof image === "string"
              ? `${config.base_url}/${image.replace(/\\/g, "/")}`
              : image
          );
        }
        return work;
      });
    }

    return result;
  } else {
    results = await workModel.find().sort({ createdAt: -1 }).exec();
    results = formatResultImage(results, "mainImage") as IWork[];

    results = results.map((work) => {
      if (Array.isArray(work.images)) {
        work.images = work.images.map((image) =>
          typeof image === "string"
            ? `${config.base_url}/${image.replace(/\\/g, "/")}`
            : image
        );
      }
      return work;
    });

    return { results };
  }
};

// Get single work
const getSingleWorkService = async (workId: number | string) => {
  const queryId =
    typeof workId === "string" ? new mongoose.Types.ObjectId(workId) : workId;

  const result = await workModel.findById(queryId).exec();

  if (!result) {
    throw new appError(404, "Work not found");
  }

  if (typeof result.mainImage === "string") {
    result.mainImage = `${config.base_url}/${result.mainImage.replace(
      /\\/g,
      "/"
    )}`;
  }

  if (Array.isArray(result.images)) {
    result.images = result.images.map((image) =>
      typeof image === "string"
        ? `${config.base_url}/${image.replace(/\\/g, "/")}`
        : image
    );
  }

  return result;
};

const getSingleWorkBySlugService = async (workSlug: string) => {
  const result = await workModel.findOne({ slug: workSlug }).exec();

  if (!result) {
    throw new Error("Work not found");
  }

  if (typeof result.mainImage === "string") {
    result.mainImage = `${config.base_url}/${result.mainImage.replace(
      /\\/g,
      "/"
    )}`;
  }

  if (Array.isArray(result.images)) {
    result.images = result.images.map((image) =>
      typeof image === "string"
        ? `${config.base_url}/${image.replace(/\\/g, "/")}`
        : image
    );
  }

  return result;
};

//Update single work
const updateSingleWorkService = async (
  workId: string | number,
  workData: IWork
) => {
  const queryId =
    typeof workId === "string" ? new mongoose.Types.ObjectId(workId) : workId;

  const work = await workModel.findById(queryId).exec();

  if (!work) {
    throw new Error("Work not found");
  }

  if (workData.mainImage && work.mainImage !== workData.mainImage) {
    const prevFileName = path.basename(work.mainImage);
    const prevFilePath = path.join(process.cwd(), "uploads", prevFileName);

    if (fs.existsSync(prevFilePath)) {
      try {
        fs.unlinkSync(prevFilePath);
      } catch (err) {
        console.warn(
          `Failed to delete previous main image for work ${work._id}`
        );
      }
    } else {
      console.warn(`Previous main image not found for work ${work._id}`);
    }
  }

  if (
    workData.images &&
    work.images &&
    workData.images.length !== work.images.length
  ) {
    work.images.forEach((image) => {
      if (!workData.images.includes(image)) {
        const prevFileName = path.basename(image);
        const prevFilePath = path.join(process.cwd(), "uploads", prevFileName);

        if (fs.existsSync(prevFilePath)) {
          try {
            fs.unlinkSync(prevFilePath);
          } catch (err) {
            console.warn(
              `Failed to delete previous image for work ${work._id}`
            );
          }
        } else {
          console.warn(`Previous image not found for work ${work._id}`);
        }
      }
    });
  }

  const result = await workModel
    .findByIdAndUpdate(
      queryId,
      { $set: workData },
      { new: true, runValidators: true }
    )
    .exec();

  if (!result) {
    throw new Error("Work update failed");
  }

  return result;
};

//Delete single work
const deleteSingleWorkService = async (workId: string | number) => {
  const queryId =
    typeof workId === "string" ? new mongoose.Types.ObjectId(workId) : workId;

  const work = await workModel.findById(queryId).exec();

  if (!work) {
    throw new Error("Work not found");
  }

  if (work.mainImage) {
    const prevFileName = path.basename(work.mainImage);
    const prevFilePath = path.join(process.cwd(), "uploads", prevFileName);

    if (fs.existsSync(prevFilePath)) {
      try {
        fs.unlinkSync(prevFilePath);
      } catch (err) {
        console.warn(`Failed to delete main image for work ${work._id}`);
      }
    } else {
      console.warn(`Main image not found for work ${work._id}`);
    }
  }

  if (work.images && Array.isArray(work.images)) {
    work.images.forEach((image) => {
      const prevFileName = path.basename(image);
      const prevFilePath = path.join(process.cwd(), "uploads", prevFileName);

      if (fs.existsSync(prevFilePath)) {
        try {
          fs.unlinkSync(prevFilePath);
        } catch (err) {
          console.warn(`Failed to delete image for work ${work._id}`);
        }
      } else {
        console.warn(`Image not found for work ${work._id}`);
      }
    });
  }

  const result = await workModel.findByIdAndDelete(queryId).exec();

  if (!result) {
    throw new Error("Failed to delete work");
  }

  return result;
};

//Delete many work
const deleteManyWorksService = async (workIds: (string | number)[]) => {
  const queryIds = workIds.map((id) => {
    if (typeof id === "string" && mongoose.Types.ObjectId.isValid(id)) {
      return new mongoose.Types.ObjectId(id);
    } else if (typeof id === "number") {
      return id;
    } else {
      throw new Error(`Invalid ID format: ${id}`);
    }
  });

  const works = await workModel.find({ _id: { $in: queryIds } }).exec();

  if (!works || works.length === 0) {
    throw new Error("No works found");
  }

  works.forEach((work) => {
    if (work.mainImage) {
      const prevFileName = path.basename(work.mainImage);
      const prevFilePath = path.join(process.cwd(), "uploads", prevFileName);

      if (fs.existsSync(prevFilePath)) {
        try {
          fs.unlinkSync(prevFilePath);
        } catch (err) {
          console.warn(`Failed to delete main image for work ${work._id}`);
        }
      } else {
        console.warn(`Main image not found for work ${work._id}`);
      }
    }

    if (work.images && Array.isArray(work.images)) {
      work.images.forEach((image) => {
        const prevFileName = path.basename(image);
        const prevFilePath = path.join(process.cwd(), "uploads", prevFileName);

        if (fs.existsSync(prevFilePath)) {
          try {
            fs.unlinkSync(prevFilePath);
          } catch (err) {
            console.warn(`Failed to delete image for work ${work._id}`);
          }
        } else {
          console.warn(`Image not found for work ${work._id}`);
        }
      });
    }
  });

  const result = await workModel.deleteMany({ _id: { $in: queryIds } }).exec();

  return result;
};

export const workServices = {
  createWorkService,
  getAllWorkService,
  getSingleWorkService,
  getSingleWorkBySlugService,
  updateSingleWorkService,
  deleteSingleWorkService,
  deleteManyWorksService,
};
