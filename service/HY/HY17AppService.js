import app from '@/common/request.js';

// 获取分销信息
const GetDisRecordInfo = async (data, success, fail, isShowLoading = true) => {
	 return await app.Request({
		url: '/api/services/app/HY17/GetDisRecordInfo',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};

// 生成分销码
const CreateDistributionCode = async (data, success, fail, isShowLoading = true) => {
	 return await app.Request({
		url: '/api/services/app/HY17/CreateDistributionCode',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

const GetDisRecordRecordInfo = async (data, success, fail, isShowLoading = true) => {
	 return await app.Request({
		url: '/api/services/app/HY17/GetDisRecordRecordInfo',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

const GetVerificationInfo = async (data, success, fail, isShowLoading = true) => {
	 return await app.Request({
		url: '/api/services/app/HY17/GetVerificationInfo',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

// 生成二维码处的添加分销记录接口
const AddDistribution = async (data, success, fail, isShowLoading = true) => {
	 return await app.Request({
		url: '/api/services/app/HY17/AddDistribution',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

module.exports = {
	GetDisRecordInfo,
	CreateDistributionCode,
	GetDisRecordRecordInfo: GetDisRecordRecordInfo,
	GetVerificationInfo: GetVerificationInfo,
	AddDistribution
};
