import GK10AppService from '@/service/GK/GK10AppService.js'
import Api from '@/common/request.js';

export default {
	data() {
		return {
			urlOption: {},
			shareId: "", //分享营销id
			marketSetUrl: '', // 营销页地址
			marketSetID: '', // 营销页id
			marketSetName: '', // 营销页名称
			howTime: '', //推送消息的时间 
			paramValue: '',
			//扫码传过来的参数
			showModWeb: false,
			markerId: '', // 销售经理ID
		};
	},

	async onLoad(option) {
		await getApp().globalData.verifyAu(); // 验证权限获取用户信息

		this.urlOption = option; // url的options
		let url = option.q ? decodeURIComponent(option.q) : '';
		let scene = option.marketSetID ? option.marketSetID : this.$util.getQueryString(url, 'marketSetID');
		let paramValue = option.paramValue ? option.paramValue : this.$util.getQueryString(url, 'paramValue') ? this.$util.getQueryString(
			url, 'paramValue') : '';
		let marketerID = this.$util.getQueryString(url, 'MarketerID') ? this.$util.getQueryString(url, 'MarketerID') : '';
		this.markerId = marketerID;
		
		if (scene != 'undefined' && scene) {
			this.shareId=scene;
			this.paramValue= paramValue;
			
			//需要区别优惠券是否是营销页进入缓存营销页id
			getApp().globalData.couponsCom={
				origin:'isWeb',
				marketSetId:this.shareId,
				markerId:this.markerId
			};
			
			this.getMarketingPageInfo();
		}
		
	},

	// 分享
	onShareAppMessage() {
		return {
			title: this.marketSetName,
			path: `/pages/outUrl/outUrl?marketSetID=${this.shareId}&paramValue=${this.paramValue}&shareOpenid=${getApp().globalData.userInfo.spOpenId}`
		};
	},

	methods: {
		updateShareInfo(markerName) {
			getApp().globalData.getShareInfo({
				query: this.urlOption,
				curOpenid: getApp().globalData.userInfo.spOpenId,
				path: `/pages/outUrl/outUrl`,
				title: '营销页',
				description: `营销页-${markerName}`
			}, true);
		},
		// 根据扫码获取营销页信息
		async getMarketingPageInfo() {
			let self = this;
			let data = {
				marketSetID: this.shareId //营销页二维码参数id
			};
			let rdata = await GK10AppService.GetMarketingPageInfo(data, null, false);
			// 加入分享记录
			this.updateShareInfo(rdata.marketSetName);
			// 加入用户门店记录
			getApp().globalData.AddNGKUser(rdata.storeId);
			
			// 加入营销页名称
			this.marketSetName = rdata.marketSetName;
			let param = {
				marketSetID: this.shareId,
				openId: getApp().globalData.userInfo.spOpenId,
				paramValue: this.paramValue,
				rnd: new Date().getTime(),
				marketerID: this.markerId,
			};
			
			let isHavePush = rdata.isHavePush;
			let isWxVisit = rdata.isWxVisit;
			if (isWxVisit == 1) {
				param.isFromSmallProgram = 1;
				this.marketSetUrl=Api.api.addomain + `/mp?${this.$util.urlEncode(param).substr(1)}`;
			} else {
				this.marketSetUrl=Api.api.addomain + `/mp?${this.$util.urlEncode(param).substr(1)}`;
			}
			
			// if (isHavePush == 1 && this.howTime > 0) {
			// 	setTimeout(function() {
			// 		uni.showModWeb({
			// 			title: '提示',
			// 			content: '是否需要推送营销服务',
			// 			success: function(res) {
			// 				if (res.confirm) {
			// 					this.getPushTemplMsg();
			// 				} else if (res.cancel) {
			// 					console.log('用户点击取消');
			// 				}
			// 			}
			// 		});
			// 	}, 1000);
			// }
		},
		// 延迟推送模板消息
		async getPushTemplMsg() {
			let self = this;
			let data = {
				marketSetID: self.marketSetID,
				//营销页设置表主键id
				smallUserID: getApp().globalData.LoginUserId,
				//小程序用户ID(GK01001)
				scene: self.shareId
			};

			let rdata = await GK10AppService.GetPushTemplMsg(data, null, false);

			uni.showToast({
				title: '推送营销信息' + this.howTime + '分钟后可在服务通知中查看',
				icon: 'none',
				duration: 3000
			});
		}
	}
};
