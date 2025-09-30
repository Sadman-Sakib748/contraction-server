import { userRoleValue } from "./user.constants";

export type TPreviousPasswords = {
  password: string;
  createdAt: Date;
};

export type TUser = {
  number: string;
  email: string;
  password: string;
  name: string;
  profile_image: string;
  address: string;
  phone_number: string;
  role: string;
  previous_passwords: TPreviousPasswords[];
  status: boolean;
};

export type TUserRole = keyof typeof userRoleValue;
