import app from '@/common/request.js';


// 验证短信验证码
let CheckPhoneCode = async (data, success, isShowLoading = true) => {
  return await  app.Request({
    url: '/api/services/app/CY35/CheckPhoneCode',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

export default  {
  CheckPhoneCode
};