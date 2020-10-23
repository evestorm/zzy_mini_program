import uStorage from './storage.js'

const prefix = 'ZZY.';

const storage = {
	// 设置token缓存
	setToken(token,timeout) {
		 uStorage.set(prefix + 'Token',token,timeout);
	},
	// 获取token
	getToken() {
		return uStorage.get(prefix + 'Token');
	},
	// 移除token
	removeToken() {
		uStorage.remove(prefix + 'Token');
	},
	// 存储当前tabBar传参
	setTabBarPayload(value) {
		return uStorage.set(prefix + 'TabBarPayload', value);
	},
	getTabBarPayload() {
		return uStorage.get(prefix + 'TabBarPayload');
	},
	removeTabBarPayload() {
		return uStorage.remove(prefix + 'TabBarPayload');
	},

	// 设置用户信息
	setUserInfo(userInfo) {
		// 设置全局用户信息
		getApp().globalData.userInfo=userInfo;
		getApp().globalData.LoginUserId=userInfo.id;
		return uStorage.set(prefix + 'UserInfo', userInfo);
	},
	// 获取用户信息
	getUserInfo() {
		return uStorage.get(prefix + 'UserInfo');
	},
	//设置菜单缓存
	setShoppingCartList(value) {
		return uStorage.set(prefix + 'ShoppingCartList', value);
	},
	//获取菜单缓存
	getShoppingCartList() {
		return uStorage.get(prefix + 'ShoppingCartList');
	},
	//移除菜单缓存
	removeShoppingCartList() {
		return uStorage.remove(prefix + 'ShoppingCartList');
	},
	// 设置购买缓存信息
	setShoppinglineInfo(storeInfo) {
		return uStorage.set(prefix + 'ShoppinglineInfo', storeInfo);
	},
	// 获取购买缓存信息
	getShoppinglineInfo() {
		return uStorage.get(prefix + 'ShoppinglineInfo');
	},
	// 设置地址信息
	setOrderAddress(value) {
		return uStorage.set(prefix + 'OrderAddress', value);
	},
	// 获取地址信息
	getOrderAddress() {
		return uStorage.get(prefix + 'OrderAddress');
	},
	// 删除地址信息
	removeOrderAddress() {
		return uStorage.remove(prefix + 'OrderAddress');
	},
	// 设置线上商城使用优惠券信息
	setOrderUseCoupon(value) {
		return uStorage.set(prefix + 'OrderUseCoupon', value);
	},
	// 获取线上商城使用优惠券信息
	getOrderUseCoupon() {
		return uStorage.get(prefix + 'OrderUseCoupon');
	},
	// 删除线上商城使用优惠券信息
	removeOrderUseCoupon() {
		return uStorage.remove(prefix + 'OrderUseCoupon');
	},

	// 设置线上商城自提用户信息
	setOrderSelfUserInfo(value) {
		return uStorage.set(prefix + 'orderSelfUserInfo', value);
	},
	// 获取线上商城自提用户信息
	getOrderSelfUserInfo() {
		return uStorage.get(prefix + 'orderSelfUserInfo');
	},
	// 删除线上商城自提用户信息
	removeOrderSelfUserInfo() {
		return uStorage.remove(prefix + 'orderSelfUserInfo');
	},
	
	// 用户最后进入的商城或者是门店详情的页面
	setLastInUrl(value) {
		return uStorage.set(prefix + 'LastInUrl',value);
	},
	// 用户最后进入的商城或者是门店详情的页面
	getLastInUrl() {
		return uStorage.get(prefix + 'LastInUrl');
	},
	// 用户最后进入的商城或者是门店详情的页面
	removeLastInUrl() {
		return uStorage.remove(prefix + 'LastInUrl');
	},
	
	//缓存选择的地图地址信息
	setMapAddress(value) {
		return uStorage.set(prefix + 'MapAddress',value);
	},
	// 获取选择地图地址信息
	getMapAddress() {
		return uStorage.get(prefix + 'MapAddress');
	},
	// 移除选择地图地址信息
	removeMapAddress() {
		return uStorage.remove(prefix + 'MapAddress');
	},
}

export default storage
