let animationShowHeight = 10;

import GK01 from '@/service/GK/GK01AppService.js';

export default {
	data() {
		return {
			userInfo: {},
			startDate: this.$util.getDateStr('', '', 1, -49),
			//格式化日期
			isShowInput: true
		};
	},
	//页面加载,一个页面只会调用一次
	onLoad() {
		let tempUserInfo = getApp().globalData.userInfo;
		if (tempUserInfo) {
			tempUserInfo.birthDay = tempUserInfo.birthDay ? tempUserInfo.birthDay.replace(/\s[\x00-\xff]*/g, '') : '';
			this.userInfo = tempUserInfo;
		}
	},
	methods: {
		// 点击修改日期
		bindDateChange(e) {
			let birthDay = e.detail.value;
			this.userInfo.birthDay = birthDay.replace(/\s[\x00-\xff]*/g, '');
			this.updateMyInfo();
		},
		//修改姓名
		editUserName(e) {
			let fullName = e.detail.value;
			this.userInfo.fullName = fullName;
			this.isShowInput = true;
		},
		//修改个人信息
		async updateMyInfo() {
			if (!this.userInfo.fullName) {
				uni.showToast({
					title: '修改的姓名不能为空',
					icon: 'none',
					duration: 1000
				});
				this.userInfo.fullName = getApp().globalData.userInfo.fullName;
				return;
			}
			let dataObj = {
				"id": getApp().globalData.LoginUserId,
				"fullName": this.userInfo.fullName,
				"birthDay": this.userInfo.birthDay ? this.userInfo.birthDay.replace(/\s[\x00-\xff]*/g, '') + " 00:00:00" : '1900-01-01 00:00:00',
				"phone": this.userInfo.phone
			};
			let data = dataObj;
			let rdata = await GK01.UpdateByDto(data, null, false);
			if (rdata) {
				let returnData = rdata;
				getApp().globalData.userInfo.fullName = returnData.fullName;
				getApp().globalData.userInfo.birthDay = returnData.birthDay && returnData.birthDay.indexOf("1900-01-01") < 0 ?
					returnData.birthDay.replace(/\s[\x00-\xff]*/g, '') : '';
				this.userInfo = getApp().globalData.userInfo;
			};
		}
	}
};
