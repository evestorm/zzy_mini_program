import HY02AppService from '@/service/HY/HY02AppService.js';
export default {
	data() {
		return {
			memberCardInfo: {} // 会员卡信息

		};
	},

	components: {},
	props: {},
	onLoad(options) {
		let storeID = options.storeID;
		let hyCardID = options.hyCardID;
		let data = {
			storeID: options.storeID,
			hyCardID: options.hyCardID,
			hyUserTel: getApp().globalData.userInfo.phone,
		};
		this.getMemberCardInfo(data);
	},
	methods: {
		async getMemberCardInfo(data) { //获取会员卡信息
			let res=await HY02AppService.getMemberCardDetails(data);
				if (!res.cardRightRemark) {
					res.cardRightRemark = '';
				};
				this.memberCardInfo = res;
				// this.setData({
				// 	memberCardInfo: memberCardInfo
				// });
		},

		// goMarketPage() {
		// 	uni.navigateTo({
		// 		url: `/pages/outUrl/outUrl?marketSetID=${this.memberCardInfo.marketSetID}&paramValue=${this.memberCardInfo.hyCardParam}`
		// 	});
		// },

		callPhone(e) { //拨打电话
			if (!e.currentTarget.dataset.phone) return;
			uni.makePhoneCall({
				phoneNumber: e.currentTarget.dataset.phone
			});
		},

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
};
