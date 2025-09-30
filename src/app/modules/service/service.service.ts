import mongoose from "mongoose";
import { paginateAndSort } from "../../utils/paginateAndSort";
import { formatResultImage } from "../../utils/formatResultImage";
import { IService } from "./service.interface";
import { serviceModel } from "./service.model";
import path from "path";
import fs from "fs";

//Create a service into database
const createServiceService = async (
  serviceData: IService,
  filePath?: string
) => {
  const dataToSave = { ...serviceData, filePath };
  const result = await serviceModel.create(dataToSave);
  return result;
};

// Get all services with optional pagination
const getAllServiceService = async (
  page?: number,
  limit?: number,
  searchText?: string,
  searchFields?: string[]
) => {
  let results;

  if (page && limit) {
    const query = serviceModel.find();
    const result = await paginateAndSort(
      query,
      page,
      limit,
      searchText,
      searchFields
    );

    result.results = formatResultImage<IService>(
      result.results,
      "attachment"
    ) as IService[];

    return result;
  } else {
    results = await serviceModel.find().sort({ createdAt: -1 }).exec();

    results = formatResultImage(results, "attachment");

    return {
      results,
    };
  }
};

// Get single service
const getSingleServiceService = async (serviceId: number | string) => {
  const queryId =
    typeof serviceId === "string"
      ? new mongoose.Types.ObjectId(serviceId)
      : serviceId;

  const result = await serviceModel.findById(queryId).exec();
  if (!result) {
    throw new Error("Service not found");
  }

  if (typeof result.attachment === "string") {
    const formattedAttachment = formatResultImage<IService>(result.attachment);
    if (typeof formattedAttachment === "string") {
      result.attachment = formattedAttachment;
    }
  }

  return result;
};

//Update single service
const updateSingleServiceService = async (
  serviceId: string | number,
  serviceData: IService
) => {
  const queryId =
    typeof serviceId === "string"
      ? new mongoose.Types.ObjectId(serviceId)
      : serviceId;

  const service = await serviceModel.findById(queryId).exec();

  if (!service) {
    throw new Error("Service not found");
  }

  if (serviceData.attachment && service.attachment !== serviceData.attachment) {
    const prevFileName = path.basename(service.attachment);
    const prevFilePath = path.join(process.cwd(), "uploads", prevFileName);

    if (fs.existsSync(prevFilePath)) {
      try {
        fs.unlinkSync(prevFilePath);
      } catch (err) {
        console.warn(
          `Failed to delete previous attachment for service ${service._id}`
        );
      }
    } else {
      console.warn(`Previous attachment not found for service ${service._id}`);
    }
  }

  const result = await serviceModel
    .findByIdAndUpdate(
      queryId,
      { $set: serviceData },
      { new: true, runValidators: true }
    )
    .exec();

  if (!result) {
    throw new Error("Service not found");
  }

  return result;
};

//Delete single service
const deleteSingleServiceService = async (serviceId: string | number) => {
  const queryId =
    typeof serviceId === "string"
      ? new mongoose.Types.ObjectId(serviceId)
      : serviceId;

  const service = await serviceModel.findById(queryId).exec();

  if (!service) {
    throw new Error("Service not found");
  }

  if (service.attachment) {
    const fileName = path.basename(service.attachment);
    const attachmentPath = path.join(process.cwd(), "uploads", fileName);

    if (fs.existsSync(attachmentPath)) {
      try {
        fs.unlinkSync(attachmentPath);
      } catch (err) {
        throw new Error("Failed to delete attachment file");
      }
    } else {
      throw new Error("Attachment file not found on server");
    }
  }

  const result = await serviceModel.findByIdAndDelete(queryId).exec();

  if (!result) {
    throw new Error("Service delete failed");
  }

  return result;
};

//Delete many service
const deleteManyServicesService = async (serviceIds: (string | number)[]) => {
  const queryIds = serviceIds.map((id) => {
    if (typeof id === "string" && mongoose.Types.ObjectId.isValid(id)) {
      return new mongoose.Types.ObjectId(id);
    } else if (typeof id === "number") {
      return id;
    } else {
      throw new Error(`Invalid ID format: ${id}`);
    }
  });

  const services = await serviceModel.find({ _id: { $in: queryIds } });

  for (const service of services) {
    if (service.attachment) {
      const fileName = path.basename(service.attachment);
      const filePath = path.join(process.cwd(), "uploads", fileName);

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.warn(
            `Failed to delete attachment for service ${service._id}`
          );
        }
      } else {
        console.warn(`Attachment not found for service ${service._id}`);
      }
    }
  }

  const result = await serviceModel
    .deleteMany({ _id: { $in: queryIds } })
    .exec();

  return result;
};

export const serviceServices = {
  createServiceService,
  getAllServiceService,
  getSingleServiceService,
  updateSingleServiceService,
  deleteSingleServiceService,
  deleteManyServicesService,
};
