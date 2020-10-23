import app from '@/common/request.js';
// 获取积分余额变动


let getQRParam = async (data, success, isShowLoading = true) => {
 return await app.Request({
    url: '/api/services/app/HY15/GetViewDto',
    data: data,
    isObj: false,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

module.exports = {
  getQRParam: getQRParam
};