import app from '@/common/request.js'

// 获取宴会筛选线索
let GetBanquetScreen = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetOrder/GetBanquetScreen',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}
//获取宴会信息列表/GetBanquetOrder
let GetBanquetOrder = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetOrder/GetBanquetOrder',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}
// 获取宴会单详情
let GetViewDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetOrder/GetViewDto',
		data: data,
		isObj: false,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
};

// 获取宴会执行详情
let GetBanquetExectorDetail = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetOrder/GetBanquetExectorDetail',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

// 创建宴会单
let CreateByDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetOrder/CreateByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

// 更新宴会单
let UpdateByDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetOrder/UpdateByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

// 获取套餐信息
let GetbanquetPackage = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetPackage/GetViewPageSelect',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
};


//创建宴会执行
let CreateBanquetExectue = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetOrder/CreateBanquetExectue',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

//判断当前登录人有没有权限查看宴会详情
let IsCanViewBanquetOrder = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetOrder/IsCanViewBanquetOrder',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

export default {
	GetBanquetScreen,
	GetBanquetOrder,
	GetViewDto,
	GetBanquetExectorDetail,
	CreateByDto,
	UpdateByDto,
	GetbanquetPackage,
	CreateBanquetExectue,
	IsCanViewBanquetOrder
};
