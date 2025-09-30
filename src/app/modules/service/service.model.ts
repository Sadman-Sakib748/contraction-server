import { Schema, model } from "mongoose";
import { IService } from "./service.interface";

const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    list: [{ type: String, required: true, trim: true }],
    attachment: { type: String },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const serviceModel = model<IService>("service", serviceSchema);
