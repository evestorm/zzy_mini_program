import app from '@/common/request.js';
// 存入formId


let getFormId = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GK18/CreateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

export default {
  getFormId
};