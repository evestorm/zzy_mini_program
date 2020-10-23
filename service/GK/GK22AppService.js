import app from '@/common/request.js';
// 获取FormId存储

//添加会员卡和优惠券的访问记录
let CreateByDto = async (data, success, isShowLoading = false) => {
  return await app.Request({
    url: '/api/services/app/GK22/CreateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

//修改会员卡和优惠券的访问记录
let UpdateByDto = async (data, success, isShowLoading = false) => {
  return await app.Request({
    url: '/api/services/app/GK22/UpdateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

module.exports = {
  CreateByDto,
  UpdateByDto
};