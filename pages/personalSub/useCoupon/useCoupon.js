export default {
	data() {
		return {
			couponListBg: 'https://pic.cwyyt.cn/upload/yytBanner/coupon_myI.png',
			erweiPic: 'https://pic.cwyyt.cn/upload/img/20191106/1616501650_ddxq_Qrcode.png',
			picDomain: getApp().globalData.PicDomain,
			cardInfo: {} // 优惠券信息
		};
	},
	filters: {
	},
	onLoad(options) {
		this.cardInfo=getApp().globalData.selectMyCouponCarDinfo;
	},
	methods: {
	}
};
