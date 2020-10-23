import GZH10 from '@/service/GZH/GZH10AppService.js';
import GK08 from '@/service/GK/GK08AppService.js';
import GK09 from '@/service/GK/GK09AppService.js';
import CY17 from '@/service/CY/CY17AppService.js';

let animationShowHeight = 10;
export default {
	data() {
		return {
			urlOption: {},
			telPhonePic: getApp().globalData.PicDomain + '/upload/yytBanner/telPhone.png',
			cardGenID: '',
			// 扫描二维码进入的二维码id
			userInfo: {},
			// 销售人员详细信息
			score: '5',
			// 默认星数
			salesID: '',
			// 销售人员id
			shopID: '',
			// 门店id
			shopInfo: {} // 当前门店信息

		};
	},
	//页面加载,一个页面只会调用一次
	async onLoad(option) {
		// 权限验证
		await getApp().globalData.verifyAu();
		// 扫描二维码进入
		this.urlOption = option;
		// this.setData({
		// 	urlOption: option
		// });

		if (option.scene && option.scene !== 'undefined') {
			// options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
			let scene = decodeURIComponent(option.scene);
			this.cardGenID = scene;
			// this.setData({
			// 	cardGenID: scene
			// }); 
			//通过分享进来的操作

			this.GetShareQRCode(this.initData);
		} else {
			if (option.salesID && option.salesID !== '') {
				this.salesID = option.salesID;
				// this.setData({
				// 	salesID: option.salesID
				// });
			} // 从预定页面进入传入的门店的id

			if (option.shopID && option.shopID !== '') {
				this.shopID = option.shopID;
				// this.setData({
				// 	shopID: option.shopID
				// });
			}
			this.initData();
		}
	},

	// 分享
	onShareAppMessage(option) {
		return {
			title: this.navTitle,
			path: `/pages/common/salesManagerInfo/salesManagerInfo?salesID=${this.salesID}&shopID=${this.shopID}&shareOpenid=${getApp().globalData.userInfo.spOpenId}`
		};
	},

	methods: {
		initData() {
			this.getSalesDetails();
		},
		updateShareInfo(title) {
			getApp().globalData.getShareInfo({
				query: this.urlOption,
				curOpenid: getApp().globalData.userInfo.spOpenId,
				path: `/pages/common/salesManagerInfo/salesManagerInfo`,
				title: '客服经理详情',
				description: `客服经理详情-${title}`
			});
		},
		//通过分享进来的操作
		async GetShareQRCode(successCallBack) {
			let self = this; //得到对应的二维码分享数据（通过分享传入的id）
			let data = {
				primaryKey: self.cardGenID
			};
			let rdata = await GK08.GetDto(data);
			this.salesID = rdata.marketerID;
			this.shopID = rdata.storeID;
			// self.setData({
			// 	salesID: rdata.marketerID,
			// 	shopID: rdata.storeID
			// });
			getApp().globalData.shaleSaleId = rdata.marketerID;
			data = {
				cardGenID: self.cardGenID,
				xcxUserID: getApp().globalData.LoginUserId
			};
			GK09.CreateByDto(data, success, false);
			successCallBack && successCallBack();
		},

		//从预定页面进入获取客服经理的详情数据
		async getSalesDetails() {
			let data = {
				id: this.salesID
			};
			let rdata = await CY17.GetViewDto(data);
			let returnData = rdata; // 如果销售人员头像存在则直接使用，如果销售人员头像不存在，则使用门店主图
			let userNInfo = {
				name: returnData.name ? returnData.name : '',
				phone: returnData.phone ? returnData.phone : '',
				score: returnData.score ? returnData.score : 5,
				desc: returnData.desc ? returnData.desc : '暂无简介',
				marketSetUrl: returnData.marketSetUrl ? returnData.marketSetUrl : '',
				imgUrl: returnData.imgUrl
			};
			this.userInfo = userNInfo;
			await this.getShopImg();
		},

		callPhone() {
			let phone = this.userInfo.phone;
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},

		// 获取门店主图
		async getShopImg() {
			let data = {
				pageIndex: 1,
				pageSize: 1,
				order: 'StorePicID desc',
				filter: {
					Type: 'and',
					Conditions: [{
						Attribute: 'StoreID',
						Datatype: 'nvarchar',
						Operatoer: 'eq',
						Value: this.shopID
					}, {
						Attribute: 'IsMain',
						Datatype: 'int',
						Operatoer: 'eq',
						Value: '1'
					}]
				}
			};

			let rdata = await GZH10.GetViewPage(data, null, false);
			let currentShopInfo = rdata.dataList[0];
			let shopInfo = currentShopInfo;
			shopInfo.storeName = currentShopInfo.branchName;
			shopInfo.imgUrl = getApp().globalData.PicDomain + currentShopInfo.imgUrl;
			this.shopInfo = shopInfo;
			// 销售经理没有图片 用门店图片
			if (!this.userInfo.imgUrl) this.userInfo.imgUrl = this.shopInfo.imgUrl;


			uni.setNavigationBarTitle({
				title: shopInfo.storeName + "-" + this.userInfo.name
			});

			this.updateShareInfo(this.userInfo.name);
		},
		// 预定按钮跳转
		goSubmit(e) {
			let shopInfo = JSON.stringify(this.shopInfo);
			uni.navigateTo({
				url: `/pages/indexSub/goBooking/goBooking?id=${this.shopID}&salesID=${this.salesID}&imgUrl=${this.imgUrl}&shopInfo=${shopInfo}`
			});
		},
		// goDetail() {
		// 	// 后面再调试，outUrl2还没写
		// 	uni.navigateTo({
		// 		url: '/pages/common/outUrl2/outUrl2?marketSetUrl=' + userInfo.marketSetUrl
		// 	})
		// },

		// setData: function(obj) {
		// 	let that = this;
		// 	let keys = [];
		// 	let val, data;
		// 	Object.keys(obj).forEach(function(key) {
		// 		keys = key.split('.');
		// 		val = obj[key];
		// 		data = that.$data;
		// 		keys.forEach(function(key2, index) {
		// 			if (index + 1 == keys.length) {
		// 				that.$set(data, key2, val);
		// 			} else {
		// 				if (!data[key2]) {
		// 					that.$set(data, key2, {});
		// 				}
		// 			}

		// 			data = data[key2];
		// 		});
		// 	});
		// }
	}
}
