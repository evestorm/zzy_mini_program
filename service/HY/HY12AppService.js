import app from '@/common/request.js';

// 获取积分余额变动
const acBalance = async (data, success, isShowLoading = true) => {
   return await app.Request({
    url: '/api/services/app/HY12/GetViewPage',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

// 获取余额信息
const GetBalanceInfo = async (data, success, fail, isShowLoading = true) => {
	 return await app.Request({
		url: '/api/services/app/HY12/GetBalanceInfo',
		data,
		isObj: true,
		isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	})
}

module.exports = {
  acBalance,
  GetBalanceInfo,
};