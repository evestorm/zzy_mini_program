import HY17 from '@/service/HY/HY17AppService.js';
export default {
	data() {
		return {
			fenxiaoInfo: {
				// 分销信息
				alreadyDisRecord: 0, // 已经核销.
				notDisRecord: 0, // 未核销.
				rebate: '', // 返利.
				imgUrl: '' // 海报图片
			},
			userInfo: {}, // 用户信息
			storeID: '', // 商户ID
			hyCardID: '',
			hyUserCardID: '', // 会员卡ID
			hyCardTitle: '', // 会员卡名称
			payload: {} // onload的payload
		};
	},
	computed: {
		// 已分销
		alreadyFenxiao() {
			return parseInt(this.fenxiaoInfo.notDisRecord + this.fenxiaoInfo.alreadyDisRecord);
		}
	},
	onLoad(payload) {
		uni.setNavigationBarTitle({
			title: '会员分销'
		});
		this.payload = payload;
	},
	onShow() {
		this.initData(this.payload);
	},
	methods: {
		initData(payload) {
			const {
				hyUserCardID,
				storeID,
				hyCardTitle
			} = payload;
			this.hyUserCardID = hyUserCardID;
			this.storeID = storeID;
			this.hyCardTitle = hyCardTitle;
			this.hyCardID = payload.hyCardID;
			this.getUserInfo();
			this.getFenxiaoInfo();
		},
		getUserInfo() {
			const tempUserInfo = getApp().globalData.userInfo;
			this.userInfo = {
				nickName: tempUserInfo.nickName,
				phone: tempUserInfo.phone,
				headImg: tempUserInfo.headImg
			};
		},
		// 获取分销信息
		async getFenxiaoInfo() {
			const data = {
				hyUserCardID: this.hyUserCardID
			};
			let result = await HY17.GetDisRecordInfo(data);
			if (result) {
				this.fenxiaoInfo = result;
				this.fenxiaoInfo.rebate = result.rebate || this.$util.formatNum(result.rebate, 2);
			};
		},
	}
};
