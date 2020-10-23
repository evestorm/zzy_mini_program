import app from '@/common/request.js';
// 获取FormId存储


let CreateByDto = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GK21/CreateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

module.exports = {
  CreateByDto
};