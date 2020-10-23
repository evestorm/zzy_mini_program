import app from '@/common/request.js';
//会员卡支付
const PaymentByMembershipCard = async (data, success, isShowLoading = true) => {
 return await app.Request({
    url: '/api/services/app/HY09/PaymentByMembershipCard',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; 

module.exports = {
  PaymentByMembershipCard,
};