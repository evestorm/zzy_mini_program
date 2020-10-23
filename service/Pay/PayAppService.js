import app from '@/common/request.js';
// 购买


const order = async (data, success, fail, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/TenPay3/Order',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
    abpFail: fail
  });
}; // 购买失败


const orderFail = async (data, success, fail, isShowLoading = true) => {
return await  app.Request({
    url: '/api/services/app/TenPay3/OrderFail',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
    abpFail: fail
  });
}; // 支付状态查询


const orderStatus = async (data, success, fail, isShowLoading = false) => {
 return await app.Request({
    url: '/api/services/app/TenPay3/OrderQuery',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
    abpFail: fail
  });
};

export default {
  order: order,
  orderFail: orderFail,
  orderStatus: orderStatus
};