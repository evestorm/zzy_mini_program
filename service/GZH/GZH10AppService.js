import app from '@/common/request.js';
// 获取门店图片列表


let UpdateByDto = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GZH10/UpdateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

let GetViewPage = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GZH10/GetViewPage',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};


let GetStorePictures = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GZH10/GetStorePictures',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};
export default {
  GetViewPage: GetViewPage,
  GetStorePictures,
  UpdateByDto
};