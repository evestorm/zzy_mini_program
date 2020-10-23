import app from '@/common/request.js'

// 获取企业logo图片、企业名称、门店名称、配送人相关信息
let GetSendCompanyUserInfo = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/WMSendPeople/GetSendCompanyUserInfo',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

// 查询配送员所在的门店
let GetSendPeopleViewDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/WMSendPeople/GetSendPeopleViewDto',
		data: data,
		isObj: false,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

// 查询当前区域的其他团长
let GetOtherLeadersInTheArea = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/WMSendPeople/GetOtherLeadersInTheArea',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}
export default {
	GetSendCompanyUserInfo,
	GetSendPeopleViewDto,
	GetOtherLeadersInTheArea
};
