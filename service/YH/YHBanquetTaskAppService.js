import app from '@/common/request.js'

// 更新任务详情
const UpdateByDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetTask/UpdateByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};

// 任务完成检验提示
const GetTaskCompleteTip = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetTask/GetTaskCompleteTip',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};

//  添加宴会任务
const BatchAddBanquetTasks = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetTask/BatchAddBanquetTasks',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};
// 获取任务详情
let GetViewDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetTask/GetViewDto',
		data: data,
		isObj: false,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
};
export default {
	BatchAddBanquetTasks,
	GetTaskCompleteTip,
	GetViewDto,
	UpdateByDto
};
