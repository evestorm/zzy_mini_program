import HY02AppService from '@/service/HY/HY02AppService.js';
import HY07AppService from '@/service/HY/HY07AppService.js';
import GZH09AppService from '@/service/GZH/GZH09AppService.js';
import GK01AppService from '@/service/GK/GK01AppService.js';
import GK22 from '@/service/GK/GK22AppService.js';
export default {
	data() {
		return {
			memberCardInfo: {},
			// 会员卡信息
			shopInfo: {},
			// 门店信息
			userInfo: {},
			// 用户信息
			curSelected: 1,
			startDate: this.$util.getDateStr('', '', 1, -49),
			//格式化日期
			shareMarketID: '',
			// 分享人openid,
			shareOpenId: null,
			shopId: "",
			hyCardID: '',
			visterId: '', //用于购买后修改访问记录id
		};
	},

	components: {},
	props: {},
	onLoad(options) {
		this.visterId = options.visterId ? options.visterId : '';
		this.shareMarketID = options.shareMarketID ? options.shareMarketID : '';
		this.shareOpenId = options.shareOpenId ? options.shareOpenId : '';
		this.hyCardID = options.id;
		let id = options.id;
		let shopId = options.shopId;
		let tempUserInfo = getApp().globalData.userInfo;
		tempUserInfo.birthDay = tempUserInfo.birthDay ? tempUserInfo.birthDay.substring(0, 10) : '';
		this.shopId = shopId;
		this.userInfo = tempUserInfo;
		this.curSelected = tempUserInfo.sex;
		this.getMemberStatus(id);
		this.getStoreDetails(shopId);
	},
	methods: {
		//修改姓名
		editUserName(e) {
			let fullName = e.detail.value;
			this.userInfo.fullName = fullName;
			this.$set(this.userInfo, 'fullName', fullName);
		},
		// 修改性别
		selectSex(e) {
			let sex = e.currentTarget.dataset.type;
			this.userInfo.sex = sex;
			this.curSelected = sex
		},
		// 点击修改日期
		bindDateChange(e) {
			let birthDay = e.detail.value;
			this.userInfo.birthDay = birthDay;
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

			if (!this.userInfo.sex) {
				uni.showToast({
					title: '修改的性别不能为空',
					icon: 'none',
					duration: 1000
				});
				return;
			}

			if (!this.userInfo.birthDay) {
				uni.showToast({
					title: '修改的生日不能为空',
					icon: 'none',
					duration: 1000
				});
				return;
			}

			let dataObj = {
				"id": getApp().globalData.LoginUserId,
				"fullName": this.userInfo.fullName,
				"birthDay": this.userInfo.birthDay + " 00:00:00",
				"sex": this.userInfo.sex
			};
			let data = dataObj;
			let rdata = await GK01AppService.UpdateByDto(data, null, false)
			if (rdata) {
				let returnData = rdata;
				getApp().globalData.userInfo.fullName = returnData.fullName;
				getApp().globalData.userInfo.birthDay = returnData.birthDay;
				getApp().globalData.userInfo.sex = returnData.sex;
			};
		},
		// 获取门店的初始数据
		async getStoreDetails(id) {
			let data = {
				shopId: id,
				userId: getApp().globalData.LoginUserId
			};
			let rdata = await GZH09AppService.DetailAsync(data)
			if (rdata) {
				let shopInfo = rdata;
				this.shopInfo = shopInfo
			};
		},
		// 获取会员卡状态
		async getMemberStatus(id) {
			let data = {
				id: id
			};
			let res = await HY02AppService.memberCardStatus(data)
			if (res) {
				let memberCardInfo = res;
				this.memberCardInfo = memberCardInfo
			};
		},
		// 领取会员卡
		async getMemberCard(e) {
			let openId = this.userInfo.openId;
			if (!this.userInfo.fullName) {
				uni.showToast({
					title: '修改的姓名不能为空',
					icon: 'none',
					duration: 1000
				});
				let fullName = getApp().globalData.userInfo.fullName;
				this.$set(this.userInfo, 'fullName', fullName)
				return;
			}
			if (!this.userInfo.sex) {
				uni.showToast({
					title: '修改的性别不能为空',
					icon: 'none',
					duration: 1000
				});
				return;
			}
			if (!this.userInfo.birthDay) {
				uni.showToast({
					title: '修改的生日不能为空',
					icon: 'none',
					duration: 1000
				});
				return;
			}
			let data = {
				hyCardID: this.hyCardID,
				userCardStatus: "2",
				cardComeType: "2",
				getStoreID: this.shopId,
				zZYOpenid: this.userInfo.openId,
				hyUserName: this.userInfo.fullName,
				hyUserSex: this.userInfo.sex,
				hyUserBirthday: this.userInfo.birthDay + " 00:00:00",
				hyUserTel: this.userInfo.phone,
				cWCompanyID: this.memberCardInfo.cwCompanyID,
				isBuySuccess: '1',
				HyUserCity: this.userInfo.city,
				HyUserProvince: this.userInfo.province,
				HyUserCompanyID: this.userInfo.company,
				shareMarketID:getApp().globalData.couponsCom.origin == 'isWeb' ? getApp().globalData.couponsCom.markerId :  this.shareMarketID,
				shareOpenId: this.shareOpenId,
				couponReceiveFromType: getApp().globalData.couponsCom.origin=='isWeb' ? 30: 10,//(10:卡券详情；20:秒杀；30:营销页)除了营销页外 都算卡券详情
				cardReceiveFromId:getApp().globalData.couponsCom.origin=='isWeb' ? getApp().globalData.couponsCom.marketSetId : this.hyCardID,//卡券领取来源id
			};
			let res = await HY07AppService.getMemberCard(data)
			if (res) {
				getApp().globalData.userInfo.fullName = res.hyUserName;
				getApp().globalData.userInfo.sex = res.hyUserSex == 0 ? 2 : res.hyUserSex == 1 ? 1 : 2;
				getApp().globalData.userInfo.birthDay = res.hyUserBirthday.replace(/\s[\x00-\xff]*/g, '');
				//修改访问记录
				let viData = {
					id: this.visterId,
					appInIsBuy: 1
				}
				let result = await GK22.UpdateByDto(viData);
				uni.redirectTo({
					url: `/pages/common/paySuc/paySuc?id=${res.hyCardID}`
				})
			};
		},
		// 购买会员
		buyMemberCard(e) {
			if (!this.userInfo.fullName) {
				uni.showToast({
					title: '修改的姓名不能为空',
					icon: 'none',
					duration: 1000
				});
				let fullName = getApp().globalData.userInfo.fullName;
				this.$set(this.userInfo, 'fullName', fullName)
				return;
			}

			if (!this.userInfo.sex) {
				uni.showToast({
					title: '修改的性别不能为空',
					icon: 'none',
					duration: 1000
				});
				return;
			}

			if (!this.userInfo.birthDay) {
				uni.showToast({
					title: '修改的生日不能为空',
					icon: 'none',
					duration: 1000
				});
				return;
			}

			let param = {
				logo: this.memberCardInfo.cardLogoUrl ? this.memberCardInfo.cardLogoUrl : this.shopInfo.cwCompanyLogo,
				comName: this.shopInfo.businessName,
				storeName: this.shopInfo.branchName,
				storeId: this.shopId,
				productName: this.memberCardInfo.hyCardTitle,
				productId: this.memberCardInfo.hyCardID,
				payAmount: this.memberCardInfo.cardBuyAmount,
				relAmount: this.memberCardInfo.cardBuyAmount,
				buyType: "1",
				hyUserName: this.userInfo.fullName,
				hyUserSex: this.userInfo.sex,
				hyUserBirthday: this.userInfo.birthDay + " 00:00:00",
				hyUserTel: this.userInfo.phone,
				shareMarketID:getApp().globalData.couponsCom.origin == 'isWeb' ? getApp().globalData.couponsCom.markerId :  this.shareMarketID,
				shareOpenId: this.shareOpenId,
				visterId: this.visterId, //访问记录id
				couponReceiveFromType: getApp().globalData.couponsCom.origin=='isWeb' ? 30: 10,//(10:卡券详情；20:秒杀；30:营销页)除了营销页外 都算卡券详情
				cardReceiveFromId:getApp().globalData.couponsCom.origin=='isWeb' ? getApp().globalData.couponsCom.marketSetId : this.memberCardInfo.hyCardID,//卡券领取来源id
			};
			getApp().globalData.userInfo.fullName = this.userInfo.fullName;
			getApp().globalData.userInfo.sex = this.userInfo.sex == 0 ? 2 : this.userInfo.sex == 1 ? 1 : 2;
			getApp().globalData.userInfo.birthDay = this.userInfo.birthDay.replace(/\s[\x00-\xff]*/g, '');
			uni.navigateTo({
				url: `/pages/common/pay/pay?param=${JSON.stringify(param)}&type=1`
			});
		}
	}
};
