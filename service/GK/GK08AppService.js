import app from '@/common/request.js';
// 通过二维码ID获取对应数据


let GetViewPage = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GK08/GetViewPage',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; // 获取二维码访问记录

let GetViewDto = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GK08/GetViewDto',
    data: data,
    // isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}
let GetDto = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GK08/GetDto',
    data: data,
    isObj: false,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

export default {
  GetDto,
  GetViewPage,
  GetViewDto
};