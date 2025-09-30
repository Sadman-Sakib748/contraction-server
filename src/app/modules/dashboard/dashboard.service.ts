import { blogModel } from "../blog/blog.model";
import { galleryModel } from "../gallery/gallery.model";
import { serviceModel } from "../service/service.model";
import { shopModel } from "../shop/shop.model";
import { sliderModel } from "../slider/slider.model";
import { userModel } from "../user/user.model";
import { workModel } from "../work/work.model";

const getAdminDashboardService = async () => {
  const sliderCount = await sliderModel.countDocuments().exec();
  const serviceCount = await serviceModel.countDocuments().exec();
  const workCount = await workModel.countDocuments().exec();
  const userCount = await userModel.countDocuments().exec();
  const galleryCount = await galleryModel.countDocuments().exec();
  const shopCount = await shopModel.countDocuments().exec();
  const blogCount = await blogModel.countDocuments().exec();

  const result = {
    sliders: sliderCount,
    services: serviceCount,
    works: workCount,
    users: userCount,
    galleries: galleryCount,
    shops: shopCount,
    blogs: blogCount,
  };

  return result;
};

const getSingleUserDashboardService = async (userId: string) => {
  const sliderCount = await sliderModel.countDocuments().exec();

  const result = {
    sliders: sliderCount,
  };

  return result;
};

export const dashboardService = {
  getAdminDashboardService,
  getSingleUserDashboardService,
};
