import app from '@/common/request.js';



let GetViewDto = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GK11/GetViewDto',
    data: data,
    isObj: false,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; 




module.exports = {
     GetViewDto
};