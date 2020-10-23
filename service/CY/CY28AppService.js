import app from '@/common/request.js';
// 获取门店优惠券


let GetViewPage = async (data, success, isShowLoading = true) => {
  return await  app.Request({
    url: '/api/services/app/CY28/GetViewPage',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; // 修改


let UpdateByDto = async (data, success, isShowLoading = true) => {
  return await  app.Request({
    url: '/api/services/app/CY28/UpdateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

module.exports = {
  GetViewPage: GetViewPage,
  UpdateByDto: UpdateByDto
};