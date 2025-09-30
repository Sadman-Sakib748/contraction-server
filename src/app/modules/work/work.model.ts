import { Schema, model } from "mongoose";
import { IWork } from "./work.interface";

const workSchema = new Schema<IWork>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    mainImage: { type: String },
    images: [{ type: String }],
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const workModel = model<IWork>("work", workSchema);
