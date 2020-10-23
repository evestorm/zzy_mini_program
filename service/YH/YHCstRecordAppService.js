import app from '@/common/request.js'

//获取档案名称
let GetRecordDto = async (data, success, fail,isShowLoading = true) => {
	return await app.Request({
        url:`/api/services/app/YHCstRecord/GetViewDto`,
        data: data,
        isObj: false,
        isShowLoading: isShowLoading,
        abpSuccess: success,
        abpFail: fail
    })
};


//修改档案列表
let UpdateByDto = async (data, success, fail,isShowLoading = true) => {
	return await app.Request({
	    url:`/api/services/app/YHCstRecord/UpdateByDto`,
	    data: data,
	    isObj: true,
	    isShowLoading: isShowLoading,
	    abpSuccess: success,
	    abpFail: fail
	})
};

//添加档案列表
let CreateByDto = async (data, success, fail,isShowLoading = true) => {
	return await app.Request({
	    url:`/api/services/app/YHCstRecord/CreateByDto`,
	    data: data,
	    isObj: true,
	    isShowLoading: isShowLoading,
	    abpSuccess: success,
	    abpFail: fail
	})
};




let Delete = async (data, success, fail, isShowLoading = true) => {
   return await  app.Request({
        url: '/api/services/app/YHCstRecord/DeleteByDto',
        data: data,
        isObj: true,
        isShowLoading: isShowLoading,
        abpSuccess: success,
        abpFail: fail
    })
}


export default {
	UpdateByDto,
	CreateByDto,
	GetRecordDto,
    Delete
};