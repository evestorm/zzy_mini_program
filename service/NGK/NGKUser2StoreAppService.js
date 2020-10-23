import app from '@/common/request.js';


const CreateByDto = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/NGKUser2Store/CreateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; // 已领取




export default {
  CreateByDto,
};