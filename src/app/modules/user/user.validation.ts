import { z } from "zod";
import { userRole } from "./user.constants";

const createUserValidationSchema = z.object({
  number: z.string({
    required_error: "Number is required",
  }),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(6, {
      message: "Password must be at least 6 characters long",
    }),
  role: z.enum(userRole as [string, ...string[]]).optional(),
});

const userLoginValidationSchema = z.object({
  emailNumber: z.string({
    required_error: "Email Or Number is required",
  }),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password mus be a string",
    })
    .min(6, {
      message: "Password must be at least 6 characters long",
    }),
});

const changePasswordValidationSchema = z.object({
  current_password: z
    .string({
      required_error: "Current password is required",
      invalid_type_error: "Current password must be a string",
    })
    .min(6, {
      message: "Current password must be at least 6 characters long",
    }),
  new_password: z
    .string({
      required_error: "New password is required",
      invalid_type_error: "New password must be a string",
    })
    .min(6, {
      message: "New password must be at least 6 characters long",
    }),
});

const forgetPasswordValidationSchema = z.object({
  email: z.string({
    required_error: "Email is required!",
  }),
});

const resetPasswordValidationSchema = z.object({
  email: z.string({
    required_error: "Email is required!",
  }),
  new_password: z.string({
    required_error: "User password is required!",
  }),
});

export const userValidationSchemas = {
  createUserValidationSchema,
  userLoginValidationSchema,
  changePasswordValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
