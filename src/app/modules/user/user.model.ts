import { Model, Schema, model } from "mongoose";
import { userRole } from "./user.constants";
import { TPreviousPasswords, TUser } from "./user.interface";
import { hashPassword } from "../../utils/passwordUtils";

const previousPasswordsSchema = new Schema<TPreviousPasswords>({
  password: {
    type: "string",
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const userSchema = new Schema<TUser>(
  {
    number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: userRole,
      default: "user",
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    profile_image: {
      type: String,
      required: false,
      trim: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    previous_passwords: {
      type: [previousPasswordsSchema],
      select: 0,
      trim: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  this.password = await hashPassword(this.password);
  next();
});

// Define a static method for the model
userSchema.statics.isUserExists = async function (
  userId: number | string
): Promise<boolean> {
  const existingUser = await this.findOne({ _id: userId });
  return !!existingUser;
};

// Create an interface that includes the static methods
interface UserModel extends Model<TUser> {
  isUserExists(userId: number | string): Promise<boolean>;
}

export const userModel = model<TUser, UserModel>("user", userSchema);
