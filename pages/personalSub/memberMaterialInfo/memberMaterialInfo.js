import HY07 from '@/service/HY/HY07AppService.js';
import GK01 from '@/service/GK/GK01AppService.js';

export default {
	data() {
		return {
			changeBirth: false, //!是否可以修改生日
			userInfo: {},
			// 用户信息
			curSelected: 0,
			startDate: '',
			//格式化日期
			materialType: '',
			region: ['湖北省', '武汉市', '江夏区'],
			customItem: '全部'
		};
	},
	onLoad(options) {
		this.startDate = this.$util.getDateStr('', '', 1, -49);
		//wxui组件声明（app.js里面要先引用，注册时失败的时候弹出）
		let materialType = options.materialType;
		let tempUserInfo = getApp().globalData.userInfo;
		this.materialType = materialType;
		if (materialType == 1) {
			uni.setNavigationBarTitle({
				title: '完善资料'
			});
			tempUserInfo.birthDay = tempUserInfo.birthDay ? tempUserInfo.birthDay.replace(/\s[\x00-\xff]*/g, '') : '';
			this.changeBirth = tempUserInfo.birthDay == '' ? false : true;
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
			let rdata = await HY07.getMemberCardInfo(data);
			if (rdata) {
				let userInfo = rdata;
				if (uni.getStorageSync('localCity')) { //有位置授权缓存
					let localCity = uni.getStorageSync('localCity');
					this.region[0] = userInfo.hyUserProvince ? userInfo.hyUserProvince : localCity.province;
					this.region[1] = userInfo.hyUserCity ? userInfo.hyUserCity : this.region[0] == localCity.province ? localCity.city :
						''; //省相同 无市取市值
					this.region[2] = userInfo.hyUserArea ? userInfo.hyUserArea : this.region[1] == localCity.city ? localCity.district :
						''; //
				} else {
					this.region[0] = userInfo.hyUserProvince ? userInfo.hyUserProvince : '';
					this.region[1] = userInfo.hyUserCity ? userInfo.hyUserCity : ''; //省相同 无市取市值
					this.region[2] = userInfo.hyUserArea ? userInfo.hyUserArea : ''; //
				}
				userInfo.id = userInfo.hyUserCardID, userInfo.headImg = getApp().globalData.userInfo.headImg, userInfo.hyUserName =
					userInfo.hyUserName, userInfo.nickName = getApp().globalData.userInfo.nickName, userInfo.hyUserSex = userInfo.hyUserSex ==
					0 ? 2 : userInfo.hyUserSex == 1 ? 1 : 2, userInfo.hyUserBirthday = userInfo.hyUserBirthday ? userInfo.hyUserBirthday
					.replace(/\s[\x00-\xff]*/g, '') : '', userInfo.hyUserCompany = userInfo.companyName;
				this.changeBirth = userInfo.hyUserBirthday == '' ? false : true;
				this.userInfo = userInfo;
				this.region = this.region;
				this.curSelected = userInfo.hyUserSex;
			};
		},
		//修改姓名
		editUserName(e) {
			let fullName = e.detail.value;
			this.userInfo.hyUserName = fullName;
			// this.$set(this.userInfo,'hyUserName',fullName)
		},
		// 修改性别
		selectSex(e) {
			let sex = e.currentTarget.dataset.type;
			this.userInfo.hyUserSex = sex;
			this.curSelected = sex;
		},
		// 点击修改日期
		bindDateChange(e) {
			let birthDay = e.detail.value;
			this.userInfo.hyUserBirthday = birthDay.replace(/\s[\x00-\xff]*/g, '');
		},
		// 修改身份证信息
		editUserIdentity(e) {
			let hyUserIdentity = e.detail.value;
			this.userInfo.hyUserIdentity = hyUserIdentity;
		},
		// 修改单位信息
		editUserCompany(e) {
			let companyName = e.detail.value;
			this.userInfo.hyUserCompany = companyName;
		},
		//点击修改省份信息
		bindRegionChange(e) {
			let region = e.detail.value;
			this.userInfo.hyUserProvince = region[0];
			this.userInfo.hyUserCity = region[1];
			this.userInfo.hyUserArea = region[2];
			this.region = e.detail.value;
		},
		//修改地址
		editUserAddress(e) {
			let hyUserAddress = e.detail.value;
			this.userInfo.hyUserAddress = hyUserAddress;
		},
		//修改个人信息
		async updateMyInfo() {
			if (!this.userInfo.hyUserName) {
				uni.showToast({
					title: '修改的姓名不能为空',
					icon: 'none',
					duration: 1000
				});
				return;
			}
			if (!this.userInfo.hyUserSex) {
				uni.showToast({
					title: '修改的性别不能为空',
					icon: 'none',
					duration: 1000
				});
				return;
			}
			if (!this.userInfo.hyUserBirthday) {
				uni.showToast({
					title: '修改的生日不能为空',
					icon: 'none',
					duration: 1000
				});
				return;
			}
			let data = {
				"id": getApp().globalData.LoginUserId,
				"fullName": this.userInfo.hyUserName,
				"birthDay": this.userInfo.hyUserBirthday.replace(/\s[\x00-\xff]*/g, '') + " 00:00:00",
				"sex": this.userInfo.hyUserSex
			};
			let rdata = await GK01.UpdateByDto(data, null, false);
			if (rdata) {
				let returnData = rdata;
				getApp().globalData.userInfo.fullName = returnData.fullName;
				getApp().globalData.userInfo.birthDay = returnData.birthDay.replace(/\s[\x00-\xff]*/g, '');
				getApp().globalData.userInfo.sex = returnData.sex;
				uni.showToast({
					title: '保存成功',
					icon: 'none',
					duration: 1500
				});
				uni.redirectTo({
					url: `/pages/personalSub/memberMaterial/memberMaterial?materialType=1`
				})
			};
		},
		// 更新会员卡信息
		async updateMemberCardInfo(e) {
			if (this.materialType == 1) {
				this.updateMyInfo();
			} else {
				let userInfo = this.userInfo;

				if (!userInfo.hyUserName) {
					uni.showToast({
						title: '修改的姓名不能为空',
						icon: 'none',
						duration: 1000
					});
					return;
				}

				if (!userInfo.hyUserSex) {
					uni.showToast({
						title: '修改的性别不能为空',
						icon: 'none',
						duration: 1000
					});
					return;
				}

				if (!userInfo.hyUserBirthday) {
					uni.showToast({
						title: '修改的生日不能为空',
						icon: 'none',
						duration: 1000
					});
					return;
				}

				userInfo.userName = userInfo.hyUserName;
				userInfo.hyUserBirthday = userInfo.hyUserBirthday.replace(/\s[\x00-\xff]*/g, '') + ' 00:00:00';
				let myreg =
					/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

				if (userInfo.hyUserIdentity && !myreg.test(userInfo.hyUserIdentity)) {
					this.showToastCancel('cancel', '身份证不正确');
					return;
				}

				let data = userInfo;
				let rdata = await HY07.updateMemberCardInfo(data);
				if (rdata) {
					uni.showToast({
						title: '保存成功',
						icon: 'none',
						duration: 2000
					});
					uni.redirectTo({
						url: `/pages/personalSub/memberMaterial/memberMaterial?materialType=${this.materialType}&hyUserCardID=${this.userInfo.hyUserCardID}`
					});
				};
			}
		},
		showToastCancel(types, text, suc) {
			types = types || 'cancel';
			text = text || '验证码错误!';
			let image;
			if (types == 'cancel') {
				image = '/static/toast/cancel.png';
			} else if (types == 'success') {
				image = '/static/toast/success.png';
			}
			uni.showToast({
				image: image,
				icon: 'none',
				duration: 2000,
				color: '#fff',
				title: text,
				mask: true,
				success: () => {
					suc && suc();
				}
			});
		}
	}
};
