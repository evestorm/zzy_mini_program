let animationShowHeight = 10;

export default {
	data() {
		return {
			addressIcon: getApp().globalData.PicDomain + '/upload/yytBanner/addressIcon.png',
			invoiceIcon: getApp().globalData.PicDomain + '/upload/yytBanner/invoiceIcon.png',
			messageIcon: 'https://pic.cwyyt.cn/upload/img/20191106/1623252325_messageIcon.png',
			contactIcon: 'https://pic.cwyyt.cn/upload/img/20191106/161402142_contactIcon.png',
			collectIcon: 'https://pic.cwyyt.cn/upload/img/20191106/1528592859_collectIcon.png',
			couponsIcon: 'https://pic.cwyyt.cn/upload/img/20191106/1614221422_couponsIcon.png',
			shoppingcarIcon: getApp().globalData.PicDomain + '/upload/yytBanner/shoppingcarIcon.png',
			myInfo: [{
				url: '/assets/image/tx.png',
				name: '王大川'
			}],
			userInfo: {}
		};
	},

	components: {},
	props: {},
	//页面加载,一个页面只会调用一次
	async onLoad(options) {
		getApp().globalData.curUrl = {
			path: this.$util.getCurrentPageUrl(),
			query: options
		};
		await getApp().globalData.verifyAu();
		this.userInfo = getApp().globalData.userInfo;
	},

	onShow(options) {
		this.userInfo = getApp().globalData.userInfo
	},

	methods: {
		// editMyInfo() {
		// 	uni.navigateTo({
		// 		url: '/pages/personalSub/myInfo/myInfo'
		// 	});
		// },
	}
};
