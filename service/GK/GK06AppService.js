import app from '@/common/request.js';
// 获取门店优惠券


let GetDataPage = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GK06/GetDataPage',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

let GetViewDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GK06/GetViewDto',
		data: data,
		isObj: false,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

let DownloadSmallProgramCard = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GK06/DownloadSmallProgramCard',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

export default {
	GetDataPage,
	GetViewDto,
	DownloadSmallProgramCard
};
