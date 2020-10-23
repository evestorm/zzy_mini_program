import app from '@/common/request.js';
// 获取二维码访问记录

let GetViewPage = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GK09/GetViewPage',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; // 添加二维码访问记录

let CreateByDto = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GK09/CreateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

export default {
  GetViewPage,
  CreateByDto
};