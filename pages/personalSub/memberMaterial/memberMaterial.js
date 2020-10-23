import HY07 from '@/service/HY/HY07AppService.js';

export default {
	data() {
		return {
			userInfo: {},
			// 用户信息
			curSelected: 0,
			startDate: this.$util.getDateStr('', '', 1, -49),
			//格式化日期
			materialType: '',
			region: ['湖北省', '武汉市', '江夏区'],
			customItem: '全部',
			isEdit: false // 默认不 编辑

		};
	},

	components: {},
	props: {},
	onLoad(options) {
		let materialType = options.materialType;
		let tempUserInfo = getApp().globalData.userInfo;
		this.materialType = materialType;

		if (materialType == 1) {
			uni.setNavigationBarTitle({
				title: '完善资料'
			});
			tempUserInfo.birthDay = tempUserInfo.birthDay ? tempUserInfo.birthDay.replace(/\s[\x00-\xff]*/g, '') : '';
			let userInfo = {
				headImg: tempUserInfo.headImg,
				hyUserName: tempUserInfo.fullName,
				hyUserSex: tempUserInfo.sex,
				hyUserBirthday: tempUserInfo.birthDay.replace(/\s[\x00-\xff]*/g, ''),
				hyUserTel: tempUserInfo.phone,
				nickName: tempUserInfo.nickName
			};
			this.userInfo = userInfo;
			this.curSelected = tempUserInfo.sex;
		} else {
			let hyUserCardID = options.hyUserCardID;
			this.getMemberCardInfo(hyUserCardID);
			this.userInfo = tempUserInfo;
		}
	},
	methods: {
		// 获取会员卡的信息
		async getMemberCardInfo(hyUserCardID) {
			let data = {
				id: hyUserCardID
			};
			let rdata = await HY07.getMemberCardInfo(data)
			if (rdata) {
				let userInfo = rdata;
				this.region[0] = userInfo.hyUserProvince;
				this.region[1] = userInfo.hyUserCity;
				this.region[2] = userInfo.hyUserArea;
				userInfo.id = userInfo.hyUserCardID, userInfo.headImg = getApp().globalData.userInfo.headImg, userInfo.hyUserName =
					userInfo.hyUserName;
				userInfo.nickName = getApp().globalData.userInfo.nickName;
				userInfo.hyUserSex = userInfo.hyUserSex == 0 ? 2 : userInfo.hyUserSex == 1 ? 1 : 2;
				userInfo.hyUserBirthday = userInfo.hyUserBirthday ? userInfo.hyUserBirthday.replace(/\s[\x00-\xff]*/g, '') : '';
					userInfo.hyUserCompany = userInfo.companyName;
				this.userInfo = userInfo;
				this.curSelected = userInfo.hyUserSex;
			};
		},
		editMaterial() {
			uni.redirectTo({
				url: `/pages/personalSub/memberMaterialInfo/memberMaterialInfo?materialType=${this.materialType}&hyUserCardID=${this.userInfo.hyUserCardID}`
			});
		},

	}
};
