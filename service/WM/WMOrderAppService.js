import app from '@/common/request.js'

// 提交订单的资料
let CreateByDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/WMOrder/CreateByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

//获取外卖订单列表
let GetWMOrderList = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/WMOrder/GetWMOrderList',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

//获取外卖订单详情
let GetViewDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/WMOrder/GetViewDto',
		data: data,
		isObj: false,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

//取消订单
let CancelOrder = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/WMOrder/CancelOrder',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}
//确认订单
let ConfirmOrder = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/WMOrder/ConfirmOrder',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

//修改订单状态
let UpdateByDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/WMOrder/UpdateByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}
//获取骑手位置
let GetsTheLocation = async (data, success, fail, isShowLoading = false) => {
	return await app.Request({
		url: '/api/services/app/WMOrder/GetsTheLocation',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}
export default {
	CreateByDto,
	GetWMOrderList,
	GetViewDto,
	CancelOrder,
	ConfirmOrder,
	UpdateByDto,
	GetsTheLocation
};
