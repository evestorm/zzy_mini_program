import app from '@/common/request.js'

// 更新宴会项目(评价，回复)
const UpdateByDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetProject/UpdateByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};
// 添加宴会项目
const BatchAddBanquetProjects = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetProject/BatchAddBanquetProjects',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};
// 删除任务
const DeleteByDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetProject/DeleteByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};

let GetYHBanquetDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: `/api/services/app/YHBanquetProject/GetViewDto?id=${data.id}`,
		data: data,
		isObj: false,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};

let CreateByDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: `/api/services/app/YHBanquetProject/CreateByDto`,
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};


let Delete = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetProject/DeleteByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

export default {
	GetYHBanquetDto,
	CreateByDto,
	UpdateByDto,
	BatchAddBanquetProjects,
	DeleteByDto,
	Delete
}
