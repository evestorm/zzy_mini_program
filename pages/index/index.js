import GZH09AppService from '@/service/GZH/GZH09AppService.js';

export default {
	data() {
		return {
			swiperCurrent: 0, // banner当前小圆点所处idx
			currentUrl: '',
			scrollTop: 0,
			shopImg: [],
			historyStore: [],
			//历史商家
			shopInfo: [],
			//门店列表
			isShow: true,
			//是否显示的是首页
			pageIndex: 1,
			//热门推荐门店索引
			rowCount: 0,
			//热门推荐门店总数
			////////////搜索/////////////////
			inputShowed: false,
			//是否显示搜索框（不知道写这个的意义）
			inputVal: '',
			//搜索关键词
			isSearch: true,
			//是否显示的是历史搜索
			searcgStoreList: [],
			//查询的门店列表
			record: [],
			//搜索记录列表
			currentCity: '',
			//当前所在城市
			latitude: '',
			longitude: '',
			tabArr: {
				currentTab: 0,
				currentContent: 0
			},
			hasMore: true, //还有更多的热门推荐			
			srollHeight: '',
			currentTab: '',
			option: {}, // onload的option
			storeDatas: [], // 返回的门店数据
			isFirstInApp: true // 是否第一次进入APP 第一次进入需要跳转界面
		};
	},
	async onLoad(option) {
		await getApp().globalData.verifyAu(); // 验证权限获取用户信息
		getApp().globalData.couponsCom={
			origin:'zzy',
			marketSetId:'',
			markerId:'',// 进营销页客户经理ID
		};//更新优惠券来源 改变之前营销页进来
		if (this.isFirstInApp) {
			// 跳转最后一次界面
			getApp().globalData.lastInUrlObj.navLastInUrl();
			this.isFirstInApp = false;
		}
		
		this.getStoreInfo(true);
		this.option = option;
		this.initData(this.option);
		this.getBannerByJson();
	},
	onShow() {
		this.getStoreInfo(false);
	},
	// 分享
	onShareAppMessage(option) {
		return {
			title: '掌中宴',
			path: `/pages/index/index?shareOpenid=${getApp().globalData.userInfo.openId}`
		};
	},
	methods: {
		async initData(option) {
			this.updateShareInfo(option); //更新分享
			this.record = uni.getStorageSync('searchRecord'); // 读取搜索历史
			// 获取坐标
			let [error, res] = await uni.getLocation({
				type: 'wgs84',
				geocode: true
			});
			this.setData({
				latitude: res.latitude,
				longitude: res.longitude
			});
			getApp().globalData.addr = { //通过坐标获取城市
				latitude: res.latitude,
				longitude: res.longitude
			};
			this.loadCity(this.longitude, this.latitude);
		},
		// 获取门店信息
		async getStoreInfo(isShowLoading = true) {
			let data = {
				xcxUserID: getApp().globalData.LoginUserId,
				pageIndex: this.pageIndex
			};

			// 没有获取到用户id不去请求数据
			if (!data.xcxUserID) return;
			let rdata = await GZH09AppService.SearchAsync(data, null, isShowLoading);
			let returnData = rdata.dataList;
			let pageSize = rdata.pageSize;
			let rowCount = rdata.rowCount;
			let stores = [];
			for (let i = 0; i < returnData.length; i++) {
				stores.push({
					address: returnData[i].address ? returnData[i].address : '',
					storeID: returnData[i].storeID,
					storeName: returnData[i].storeName,
					storeLogo: returnData[i].storeLogo,
					score: returnData[i].score ? this.$util.toDecimal(returnData[i].score, 0) : 5,
					avgPrice: returnData[i].avgPrice ? '￥' + this.$util.toDecimal(returnData[i].avgPrice, 2) + '/人' : '',
					category: returnData[i].category ? returnData[i].category : '',
					prePoint: returnData[i].point,
					point: this.$util.distance(this.latitude, this.longitude, returnData[i].point.latitude, returnData[i].point.longitude) ?
						"" + this.$util.toDecimal(this.$util.distance(this.latitude, this.longitude, returnData[i].point.latitude,
							returnData[
								i].point.longitude), 2) + "km" : ""
				});
			}
			this.shopInfo = stores;
		},
		updateShareInfo(options) {
			getApp().globalData.getShareInfo({
				query: options,
				curOpenid: getApp().globalData.userInfo.openId,
				path: `/pages/index/index`,
				title: '首页',
				description: '首页'
			});
		},
		async getBannerByJson() { //获取历史商家Top3
			// 暂时写死了
			this.shopImg = [{
					"name": "首页banner",
					"src": "https://pic.cwyyt.cn/upload/yytBanner/banner.png",
					"adurl": "YdmAbpEntityAppConsts.ApiDomain"
				},
				{
					"name": "首页banner",
					"src": "https://pic.cwyyt.cn/upload/yytBanner/banner1.png",
					"adurl": "YdmAbpEntityAppConsts.ApiDomain"
				}
			]
		},
		async loadCity(longitude, latitude) {
			let page = this;
			let [error, res] = await uni.request({
				url: 'https://api.map.baidu.com/geocoder/v2/?ak=X9yRF42PVBE8OQpydEyp8z4qThUKQCII&location=' + latitude + ',' +
					longitude + '&output=json',
				header: {
					'Content-Type': 'application/json'
				}
			});

			// 获取到的城市
			this.currentCity = res.data.result.addressComponent.city;
			let localCity = {
				province: res.data.result.addressComponent.province,
				city: this.currentCity,
				district: res.data.result.addressComponent.district
			}
			uni.setStorageSync('localCity', localCity);
			getApp().globalData.formatted_address = res.data.result.formatted_address;
			this.shopInfo.forEach(item => {
				item.point = this.$util.distance(this.latitude, this.longitude, item.prePoint.latitude, item.prePoint.longitude) ?
					"" + this.$util.toDecimal(this.$util.distance(this.latitude, this.longitude, item.prePoint.latitude, item.prePoint
							.longitude),
						2) +
					"km" : ""
			});
		},
		// 刷新定位/重新获取定位
		refreshPosition() {
			this.initData(this.option);
		},
		// 显示搜索框
		showInput() {
			this.setData({
				inputShowed: true
			});
		},
		//从搜索页面返回时隐藏搜索
		hideInput() {
			this.setData({
				inputVal: '',
				inputShowed: false,
				isShow: true
			});
		},
		//显示搜索页面
		inputTyping(e) {
			this.setData({
				isShow: false
			});
		},
		//滑动切换
		swiperTab: function(e) {
			let that = this;
			that.setData({
				currentTab: e.detail.current
			});
		},
		//热门、推荐点击切换
		clickTab: function(e) {
			let dataId = e.currentTarget.dataset.current;
			let obj = {};
			obj.currentTab = dataId;
			obj.currentContent = dataId;
			this.setData({
				tabArr: obj
			});
		},
		///////////////////////////////////////////////门店搜索//////////////////////////////////////////////
		//清除搜索词
		clearInput() {
			this.clearSearchList();
		},
		//清除搜索记录
		clearRecord() {
			uni.setStorageSync('searchRecord', '');
			this.setData({
				record: []
			});
		},
		//输入搜索词
		inputSearch(e) {
			let self = this;
			// console.log(e);
			self.setData({
				inputVal: e.detail.value,
				isSearch: true
			});
		},
		//清除搜索项
		clearSearchList() {
			let self = this;
			let searchRecord = uni.getStorageSync('searchRecord');
			self.setData({
				record: searchRecord,
				isSearch: true,
				searcgStoreList: [],
				inputVal: ''
			});
		},
		//搜索门店
		async searchStore() {
			let self = this;
			let inputVal = this.inputVal;
			let tempData = []; //获取历史搜索

			let searchRecord = uni.getStorageSync('searchRecord');

			if (searchRecord == '') {
				searchRecord = [];
			}

			if (inputVal != '') {
				let HasRecordSite = 0; //历史搜索记录是否存在（存在则放在第一位）
				for (let i = 0; i < searchRecord.length; i++) {
					if (searchRecord[i] == this.$util.trim(inputVal)) {
						HasRecordSite = i + 1;
						break;
					}
				}

				let tempRecord = [];
				tempRecord[0] = inputVal;
				for (let i = 0, len = searchRecord.length >= 8 ? 8 : searchRecord.length; i < len; i++) {
					//如果搜索词已在搜索记录内，则将搜索词放在第一个，记录搜索词前面的的依次后移，后面的不变
					if (HasRecordSite != 0) {
						if (i >= HasRecordSite - 1) {
							if (searchRecord[i + 1] == undefined) {
								break;
							}

							tempRecord[i + 1] = searchRecord[i + 1];
						} else {
							tempRecord[i + 1] = searchRecord[i];
						}
					} else {
						tempRecord[i + 1] = searchRecord[i];
					}
				}

				self.setData({
					record: tempRecord
				});
				uni.setStorageSync('searchRecord', tempRecord);
			} else {
				//没有输入搜索词时，默认为搜索记录里面的第一个
				inputVal = searchRecord[0];
				self.setData({
					inputVal: inputVal
				});
			} //隐藏历史搜索
			self.setData({
				isSearch: false
			});
			let data = {
				keyword: inputVal,
				pageIndex: 1
			};
			let rdata = await GZH09AppService.SearchAsync(data);
			let returnData = rdata.dataList;

			if (returnData.length == 0) {
				uni.showToast({
					title: '无对应查找项',
					icon: 'none',
					duration: 1000
				});
			}
			let stores = [];
			for (let i = 0; i < returnData.length; i++) {
				stores.push({
					address: returnData[i].address ? returnData[i].address : '',
					storeID: returnData[i].storeID,
					storeName: returnData[i].storeName,
					storeLogo: returnData[i].storeLogo,
					score: returnData[i].score ? this.$util.toDecimal(returnData[i].score, 0) : 5,
					avgPrice: returnData[i].avgPrice ? this.$util.toDecimal(returnData[i].avgPrice, 2) + '￥/人' : '',
					category: returnData[i].category ? returnData[i].category : '',
					point: this.$util.distance(self.latitude, self.longitude, returnData[i].point.latitude, returnData[i].point.longitude) ?
						"" + this.$util.toDecimal(this.$util.distance(self.latitude, self.longitude, returnData[i].point.latitude,
							returnData[i]
							.point.longitude), 2) + "km" : ""
				});
			}
			self.setData({
				searcgStoreList: stores
			});
		},
		//点击历史记录查询
		recordSearch(e) {
			this.setData({
				inputVal: e.currentTarget.dataset.txt
			});
			this.searchStore();
		},
		setData(obj) {
			let that = this;
			let keys = [];
			let val, data;
			Object.keys(obj).forEach(key => {
				keys = key.split('.');
				val = obj[key];
				data = that.$data;
				keys.forEach((key2, index) => {
					if (index + 1 == keys.length) {
						that.$set(data, key2, val);
					} else {
						if (!data[key2]) {
							that.$set(data, key2, {});
						}
					}
					data = data[key2];
				});
			});
		}
	}
};
