import app from '@/common/request.js';
// 获取门店优惠券


let GetViewPage = async (data, success, isShowLoading = true) => {
  return await  app.Request({
    url: '/api/services/app/CY20/GetViewPage',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; // 新增


let Create = async (data, success, isShowLoading = true) => {
  return await  app.Request({
    url: '/api/services/app/CY20/Create',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; //得到标签


let GetTagAsync = async (data, success, isShowLoading = true) => {
  return await  app.Request({
    url: '/api/services/app/CY20/GetTagAsync',
    data: data,
    // isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; //得到订单详情


let GetOrderDetail = async (data, success, isShowLoading = true) => {
  return await  app.Request({
    url: '/api/services/app/CY20/GetOrderDetail',
    data: data,
    // isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; //定金支付


let BookFrontmoney = async (data, success, isShowLoading = true) => {
  return await  app.Request({
    url: '/api/services/app/CY20/BookFrontmoney',
    data: data,
    // isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; //定金支付


let BookFee = async (data, success, isShowLoading = true) => {
  return await  app.Request({
    url: '/api/services/app/CY20/BookFee',
    data: data,
    // isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; //评价


let MarkSubmit = async (data, success, isShowLoading = true) => {
  return await  app.Request({
    url: '/api/services/app/CY20/MarkSubmit',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; //评价


let GetSaler = async (data, success, isShowLoading = true) => {
  return await  app.Request({
    url: '/api/services/app/CY20/GetSaler',
    data: data,
    // isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; //根据用户id(门店id、时间段)获取订单列表


let GetOrderList = async (data, success, isShowLoading = true) => {
  return await  app.Request({
    url: '/api/services/app/CY20/GetOrderList',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
}; //根据用户id(门店id、时间段)获取订单列表


let FoodSubmit = async (data, success, isShowLoading = true) => {
  return await  app.Request({
    url: '/api/services/app/CY20/FoodSubmit',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

export default {
  GetViewPage: GetViewPage,
  Create: Create,
  GetTagAsync: GetTagAsync,
  BookFrontmoney: BookFrontmoney,
  BookFee: BookFee,
  MarkSubmit: MarkSubmit,
  GetSaler: GetSaler,
  GetOrderList: GetOrderList,
  FoodSubmit: FoodSubmit,
  GetOrderDetail: GetOrderDetail
};