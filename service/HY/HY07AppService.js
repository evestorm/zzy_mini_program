import app from '@/common/request.js';

// 获取我的会员卡
const myMemberCard = async (data, success, isShowLoading = true) => {
   return await app.Request({
    url: '/api/services/app/HY07/GetMyCard',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; 

// 获取我的会员卡
const unclaimedCard = async (data, success, isShowLoading = true) => {
   return await app.Request({
    url: '/api/services/app/HY02/GetStoreMemberCenterDetail',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; 

// 获取我的会员卡详情
const memberCardInfo = async (data, success, isShowLoading = true) => {
   return await app.Request({
    url: '/api/services/app/HY07/GetMemberOf',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; 

// 获取会员卡二维码
const getQrImg = async (data, success, isShowLoading = true) => {
   return await app.Request({
    url: '/api/services/app/HY07/GetHyCodeUrl',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; 

// 获取充值金额
const getAmount = async (data, success, isShowLoading = true) => {
   return await app.Request({
    url: '/api/services/app/HY05/GetViewPage',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; 

// 领取会员卡
const CreateByDto = async (data, success, isShowLoading = true) => {
 return await app.Request({
    url: '/api/services/app/HY07/CreateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; 

// 获取会员卡信息
const getMemberCardInfo = async (data, success, isShowLoading = true) => {
 return await app.Request({
    url: '/api/services/app/HY07/GetViewDto',
    data: data,
    // isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; 

// 更新会员卡信息
const updateMemberCardInfo = async (data, success, isShowLoading = true) => {
   return await app.Request({
    url: '/api/services/app/HY07/UpdateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; 

// 检测此卡是否领取过 
const checkIsGetThisCard = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/HY07/CheckIsGetThisCard',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

// 实体卡电子卡绑定
const BindElecCard = async (data, success, fail, isShowLoading = true) => {
   return await app.Request({
    url: '/api/services/app/HY07/BindElecCard',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
    abpFail: fail
  });
};

// 获取会员卡信息
const GetCardInfo = async (data, success, fail, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/HY07/GetCardInfo',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
    abpFail: fail
  });
};

module.exports = {
  myMemberCard,
  unclaimedCard,
  memberCardInfo,
  getQrImg,
  getAmount,
  CreateByDto,
  getMemberCardInfo,
  updateMemberCardInfo,
  checkIsGetThisCard,
  BindElecCard
};