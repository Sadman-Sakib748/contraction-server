import { Schema, model } from "mongoose";
import { IShop } from "./shop.interface";

const shopSchema = new Schema<IShop>(
  {
    name: { type: String, required: true },
    description: { type: String },
    attachment: { type: String, required: true },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const shopModel = model<IShop>("shop", shopSchema);
