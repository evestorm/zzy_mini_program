import app from '@/common/request.js';
// 获取门店图片列表


let GetDto = async (data, success, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GZH09/GetDto',
		data: data,
		isObj: false,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
}; //获取热门推荐（目前只是查询，没有推荐功能）


let GetViewPage = async (data, success, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GZH09/GetViewPage',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
}; //获取热门推荐（目前只是查询，没有推荐功能）


let SearchAsync = async (data, success, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GZH09/searchAsync',
		data: data,
		// isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
}; //获取历史门店


let HistoryStoreAsync = async (data, success, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GZH09/HistoryStoreAsync',
		data: data,
		// isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
}; //获取标签


let GetTagAsync = async (data, success, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GZH09/GetTagAsync',
		data: data,
		// isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
}; //获得门店初始数据


let DetailAsync = async (data, success, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GZH09/DetailAsync',
		data: data,
		// isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
}; //获得菜品详情


let GetDishesDetail = async (data, success, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GZH09/GetDishesDetail',
		data: data,
		// isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
}; //获得菜品评论数据


let CommentAsync = async (data, success, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GZH09/CommentAsync',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
}; //根据门店id获取基本类型数据


let GetBasicsStoreDataAsync = async (data, success, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GZH09/GetBasicsStoreDataAsync',
		data: data,
		// isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
}; //获取我的收藏门店列表


let MyCollectAsync = async (data, success, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GZH09/MyCollectAsync',
		data: data,
		// isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
}; //根据用户id(门店id、时间段)获取订单列表


let FoodMenuAsync = async (data, success, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GZH09/FoodMenuAsync',
		data: data,
		// isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
};

let GetStoreInfoList = async (data, success, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GZH09/GetStoreInfoList',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
};


export default {
	GetViewPage: GetViewPage,
	HistoryStoreAsync: HistoryStoreAsync,
	GetTagAsync: GetTagAsync,
	DetailAsync: DetailAsync,
	GetDishesDetail: GetDishesDetail,
	CommentAsync: CommentAsync,
	GetBasicsStoreDataAsync: GetBasicsStoreDataAsync,
	FoodMenuAsync: FoodMenuAsync,
	MyCollectAsync: MyCollectAsync,
	SearchAsync: SearchAsync,
	GetStoreInfoList:GetStoreInfoList,
	GetDto
};
