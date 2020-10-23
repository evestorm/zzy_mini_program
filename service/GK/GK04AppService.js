import app from '@/common/request.js';


let GetViewPage = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GK04/GetViewPage',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

let BatchDelete = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GK04/BatchDelete',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

let CreateByDto = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GK04/CreateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

let Delete = async (data, success, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/GK04/Delete',
    data: data,
    // isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

export default {
  GetViewPage: GetViewPage,
  BatchDelete: BatchDelete,
  CreateByDto: CreateByDto,
  Delete: Delete
};