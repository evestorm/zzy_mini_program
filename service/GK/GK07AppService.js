import app from '@/common/request.js';

// 获取个人领取的优惠券
let GetMyProgramCardList = async (data, success, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GK07/GetMyProgramCardList',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
};

// 领取优惠券
let ReceiveCoupons = async (data, success, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GK07/ReceiveCoupons',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
};

// 购买优惠券
let PurchaseCoupons = async (data, success, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GK07/PurchaseCoupons',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
};

// 购买成功的回调
let PurchaseSuccess = async (data, success, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GK07/PurchaseSucceed',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
};

// 获取单个个人优惠券信息
let GetViewDto = async (data, success, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GK07/GetViewDto',
		data: data,
		isObj: false,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
};


// 获取优惠券信息
let GetCouponInformation = async (data, success, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GK07/GetCouponInformation',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
};

export default {
	ReceiveCoupons,
	PurchaseCoupons,
	PurchaseSuccess,
	GetCouponInformation,
	GetMyProgramCardList,
	GetViewDto
};
