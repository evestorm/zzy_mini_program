import app from '@/common/request.js';
// 获取门店优惠券


let GetViewPage = async (data, success, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/CY17/GetViewPage',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
}
let GetViewDto = async (data, success, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/CY17/GetViewDto',
		data: data,
		isObj: false,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
};

export default {
	GetViewPage,
	GetViewDto
};
