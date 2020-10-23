import app from '@/common/request.js';

// 获取提现余额
const GetaccountBalance = async (data, success, fail, isShowLoading = true) => {
   return await app.Request({
    url: '/api/services/app/HY18/GetaccountBalance',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
		abpFail: fail
  });
};

// 提现
const Withdrawal = async (data, success, fail, isShowLoading = true) => {
   return await app.Request({
    url: '/api/services/app/HY18/Withdrawal',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
		abpFail: fail
  });
};

export default {
  GetaccountBalance,
	Withdrawal
};