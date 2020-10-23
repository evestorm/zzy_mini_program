import app from '@/common/request.js'

// 获取这个门店的所有产品类型及产品
let GetAllProductTypeAndProInfo = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/WMProduct/GetAllProductTypeAndProInfo',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}
// 查询线上商城可用优惠券详情/菜品券/折扣券
let GetViewDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/WMProduct/GetViewDto',
		data: data,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

export default {
	GetAllProductTypeAndProInfo,
	GetViewDto
};
