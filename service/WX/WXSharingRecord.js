import app from '@/common/request.js'

// 获取宴会筛选线索
let GetUserShareMoneyInfo = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/WXSharingRecord/GetUserShareMoneyInfo',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}


export default {
	GetUserShareMoneyInfo
};
