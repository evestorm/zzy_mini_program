import app from '@/common/request.js'

// 获取秒杀活动详情
let GetSpikeActivityDetail = async (data, success, fail, isShowLoading=true) => {
	return await app.Request({
		url: '/api/services/app/MSActiveConfig/GetSpikeActivityDetail',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

// 获取个人权益列表
let GetPersonalInterests = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/MSActiveConfig/GetPersonalInterests',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

// 获取优惠信息--下单页面使用
let GetCardDiscountInfo = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/MSActiveConfig/GetCardDiscountInfo',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}
// 获取优惠信息--下单页面使用
let GetSpikeActivityList = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/MSActiveConfig/GetSpikeActivityList',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

// 获取秒杀信息--商城页面使用
let GetShopMSActiveList = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/MSActiveConfig/GetShopMSActiveList',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}
export default {
	GetSpikeActivityDetail,
	GetPersonalInterests,
	GetCardDiscountInfo,
	GetSpikeActivityList,
	GetShopMSActiveList
};
