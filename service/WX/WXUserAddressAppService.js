import app from '@/common/request.js'

// 获取收货地址列表
let GetUserAddressList = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/WXUserAddress/GetUserAddressList',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

// 新增收货地址
let CreateByDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/WXUserAddress/CreateByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}
// 更新收货地址
let UpdateByDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/WXUserAddress/UpdateByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

// 删除收货地址
let DeleteByDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/WXUserAddress/DeleteByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}
export default {
	GetUserAddressList,
	CreateByDto,
	UpdateByDto,
	DeleteByDto
};
