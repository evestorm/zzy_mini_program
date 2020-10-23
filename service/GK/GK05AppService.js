import app from '@/common/request.js';
// 获取门店优惠券

let GetViewPage = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GK05/GetViewPage',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

let CreateByDto = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GK05/CreateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

module.exports = {
  GetViewPage: GetViewPage,
  CreateByDto: CreateByDto
};