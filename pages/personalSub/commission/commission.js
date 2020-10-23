import WXSharingRecord from '@/service/WX/WXSharingRecord.js';

export default {
	data() {
		return {
			openId: '', //小程序的用户的opneId
			userInfo: {}, //用户信息
			allShareMoney: '', //总佣金
			userShareMoneyInfos: [], //佣金列表信息
		}
	},
	onLoad(options) {
		this.openId = options.openId;
		this.getUserInfo();
		//初始化页面数据
		this.getUserShareMoneyInfo();
	},
	methods: {
		getUserInfo() { //获取用户信息
			this.userInfo = this.$util.null2str(getApp().globalData.userInfo);
		},
		//获取页面佣金数据
		async getUserShareMoneyInfo() {
			let data = {
				openId: this.openId //小程序的用户的opneId
			}
			let res=await WXSharingRecord.GetUserShareMoneyInfo(data)
			if(res){
				this.allShareMoney = res.allShareMoney;
				this.userShareMoneyInfos = res.userShareMoneyInfos;
			}
		},

	},

}
