import app from '@/common/request.js';
// 登陆


let login = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GK01/Login',
    data: data,
    isObj: false,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; // 获取用户信息


let GetDto = async (data, success, fail, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GK01/GetDto',
    data: data,
    isObj: false,
    isShowLoading: isShowLoading,
    abpSuccess: success,
    abpFail: fail
  });
}; // 查询小程序用户登录这块的信息


let GetViewPage = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GK01/GetViewPage',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

let UpdateByDto = async (data, success, isShowLoading = true) => {
  return await  app.Request({
    url: '/api/services/app/GK01/UpdateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; //发送验证码


let SendCode = async (data, success, fail, isShowLoading = true) => {
 return await app.Request({
    url: '/api/services/app/GK01/SendCode',
    data: data,
    // isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
    abpFail: fail
  });
}; // 获取电话号码


let GetTelNum = async (data, success, isShowLoading = true) => {
return await  app.Request({
    url: '/api/services/app/GK01/GetPhoneNumber',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

export default {
  login: login,
  GetDto: GetDto,
  GetViewPage: GetViewPage,
  UpdateByDto: UpdateByDto,
  SendCode: SendCode,
  GetTelNum: GetTelNum
};