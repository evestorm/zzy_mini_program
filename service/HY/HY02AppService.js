import app from '@/common/request.js';


const unclaimed = async (data, success, isShowLoading = true) => {
   return await app.Request({
    url: '/api/services/app/HY02/GetStoreMemberCards',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; // 已领取


const collect = async (data, success, isShowLoading = true) => {
   return await app.Request({
    url: '/api/services/app/HY07/GetStoreReceivedMemberCards',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; // 获取会员卡状态


const memberCardStatus = async (data, success, isShowLoading = true) => {
   return await app.Request({
    url: '/api/services/app/HY02/GetViewDto',
    data: data,
    // isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; // 获取会员卡详情 


const getMemberCardDetails = async (data, success, isShowLoading = true) => {
   return await app.Request({
    url: '/api/services/app/HY02/GetMemberCardDetails',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

const GetPermissions = async (data, success, isShowLoading = true) => {
	 return await app.Request({
	  url: '/api/services/app/HY02/GetPermissions',
	  data: data,
	  isObj: true,
	  isShowLoading: isShowLoading,
	  abpSuccess: success
	});
}

const DownloadHyCardQrCode = async (data, success, isShowLoading = true) => {
  return await app.Request({
	  url: '/api/services/app/HY02/DownloadHyCardQrCode',
	  data: data,
	  isObj: true,
	  isShowLoading: isShowLoading,
	  abpSuccess: success
	});
}

export default {
  unclaimed: unclaimed,
  collect: collect,
  memberCardStatus: memberCardStatus,
  getMemberCardDetails: getMemberCardDetails,
	GetPermissions: GetPermissions,
	DownloadHyCardQrCode:DownloadHyCardQrCode
};