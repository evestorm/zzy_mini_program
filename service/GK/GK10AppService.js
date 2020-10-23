import app from '@/common/request.js';
// 获取营销页信息


let GetMarketingPageInfo = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GK10/GetMarketingPageInfo',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; // 获取延迟推送模板消息


let GetPushTemplMsg = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GK10/PushTemplMsg',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

module.exports = {
  GetMarketingPageInfo,
  GetPushTemplMsg
};