export default {
	data() {
		return {
			imgInfo: getApp().globalData.PicDomain + '/upload/yytBanner/kefu.png',
			servicePer: getApp().globalData.PicDomain + '/upload/img/20200323/103607367_service-per.png',
			servicePhone: getApp().globalData.PicDomain + '/upload/img/20200323/1039493949_service-phone.png',
		};
	},
	methods: {
		callPhone() {
			let phone = '027-87607295';
			uni.makePhoneCall({
				phoneNumber: phone
			});
		}
	}
};
