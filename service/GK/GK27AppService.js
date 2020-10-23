import app from '@/common/request.js';



let GetViewDto = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GK27/GetViewDto',
    data: data,
    isObj: false,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; 




module.exports = {
     GetViewDto
};