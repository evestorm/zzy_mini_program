import GK22 from '@/service/GK/GK22AppService.js';
import HY02 from '@/service/HY/HY02AppService.js';
import HY07 from '@/service/HY/HY07AppService.js';
import HY15 from '@/service/HY/HY15AppService.js';
import GZH09 from '@/service/GZH/GZH09AppService.js';
import {
	formatNum
} from '@/common/util.js'
// 卡号：9008885019111300001（开发）
// 9008246419111400002（测试）
export default {
	data() {
		return {
			isGet: false,
			cardStatus: 0,
			isPhysicalCard: 0,
			points: '',
			surplus: '',
			cardInfo: {},
			shopId: '',
			// 门店id
			memberCenter: {
				cardBg: 'https://pic.cwyyt.cn/upload/img/20191106/1340584058_img3.png',
				jf: '96',
				hydj: '银牌会员',
				hym: 'https://pic.cwyyt.cn/upload/img/20191106/1621272127_img5.png'
			},
			shareMarketID: '', // 分享销售经理的MarketID
			shareOpenId: '', // 分享人openid
			hyCardID: '',
			option: {
				isNotLog: false // 是否需要记录日志 在领取成功或者购买成功后回跳 不需要记录日志
			}, // onload传入的option
			isCanDistribution: false, // 是否显示分销入口（分销卡独有）
			shareImgSrc: '', //分享朋友圈图片
			userInfo: getApp().globalData.userInfo,
			// memberCardInfo:{},//支付需要的信息
			showModal: false, //点击分享图片时显示分享码图片
			visterId: '', //访问记录id
		};
	},
	filters: {
		formatPrice(num) {
			return formatNum(num, 2);
		}
	},
	props: {},
	async onLoad(option) {
		this.option = option;
		await getApp().globalData.verifyAu(); // 校验权限
		// 添加用户门店信息;
		if (option.shopId && !option.isNotLog) getApp().globalData.AddNGKUser(option.shopId);
		if (option.shareOpenId) {
			this.shareOpenId = option.shareOpenId;
		}
	},
	onShow() {
		this.initData(this.option);
	},
	// 分享
	onShareAppMessage() {
		return {
			title: '会员中心',
			path: `/pages/personalSub/memberCenter/memberCenter?id=${this.cardInfo.hyCardID}&shareOpenId=${getApp().globalData.userInfo.spOpenId}&shopId=${this.shopId}`
		};
	},
	methods: {
		//点击分享朋友圈按钮
		async openPopup() {
			uni.showLoading({
				title: '图片生成中...'
			})
			let data = {
				storeId: this.shopId,
				HyCardID: this.cardInfo.hyCardID,
				redictUrlType: 1, // 0,会员卡详情;1,会员中心
				xcxUserId: getApp().globalData.userInfo.id
			};
			let res = await HY02.DownloadHyCardQrCode(data);
			this.shareImgSrc = res.completeCodePath;
			uni.hideLoading();
			this.showModal = true;
		},
		//保存图片
		async shareImg() {
			uni.showLoading({
				title: '图片保存中...'
			})
			let [error, res] = await uni.downloadFile({
				url: this.shareImgSrc
			});
			await uni.saveImageToPhotosAlbum({
				filePath: res.tempFilePath
			});
			uni.hideLoading();
			this.showModal = false;
			uni.showToast({
				title: '已成功为您保存图片到相册，请自行分享',
				duration: 5000
			})
		},
		async initData(option) { //初始化数据
			if (option.shopId) {
				this.shopId = option.shopId;
			} else {
				uni.removeStorageSync('storeName');
			}

			if (option.scene) {
				option.scene = decodeURIComponent(option.scene);
				if (~option.scene.indexOf('sceneType')) {
					option = {
						id: option.scene.split('&')[0]
					};
					this.checkSuccess(option);
				} else {

					let res = await HY15.getQRParam({
						id: option.scene
					});
					// res => {
					this.shareMarketID = res.sharePeople;
					// 为了适配用户分享,后续购买会给用户分销
					this.shareOpenId = res.sharePeople;
					option.id = res.shareContent;
					this.shopId = res.shareStore;
					getApp().globalData.AddNGKUser(res.shareStore, this.$util.getCurrentPageUrl() + this.$util.urlEncode(this.option,
						'?'));
					this.checkSuccess(option);
				}
			} else {
				this.checkSuccess(option);
			}
		},
		checkSuccess(option) {
			this.check(option.id, res => {
				this.hyCardID = option.id;
				this.cardStatus = res.userCardStatus;
				this.isPhysicalCard = res.isPhysicalCard;

				if (this.isGet) {
					this.getMemberCard(res.hyUserCardID);
				} else {
					this.unclaimedCard(option.id, data => {
						if (res.isPhysicalCard) {
							uni.redirectTo({
								url: `/pages/personalSub/openCard/openCard?logo=${data.cardLogoUrl}&storeId=${this.shopId}&storeName=${data.branchName}&hyCardID=${data.hyCardID}`
							});
						}
					});
				}
			});
		},
		async check(id, success) {
			let data = {
				phone: getApp().globalData.userInfo.phone,
				hyCardID: id
			};
			let res = await HY07.checkIsGetThisCard(data);
			this.isGet = Number(res.isGet),
				this.cardStatus = res.userCardStatus
			success && success(res);
		},

		// 记录分享进入的日志
		updateShareInfo(hycardName) {
			getApp().globalData.getShareInfo({
				query: this.option,
				curOpenid: getApp().globalData.userInfo.spOpenId,
				path: `/pages/personalSub/coupons/coupons`,
				title: '会员卡',
				description: `会员卡-${hycardName}`
			});
		},

		async recordDiaily(hycardName) { //记录会员卡访问记录
			if (this.visterId || this.option.isNotLog) {
				return;
			} //访问过后不会第二次请求
			let data = {
				appInTime: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), //进入时间
				appInOpenId: getApp().globalData.userInfo.spOpenId,
				appPageUrl: '/pages/personalSub/memberCenter/memberCenter',
				appPageName: '会员卡详情',
				appPageDesc: `会员卡-${hycardName}`,
				appInVisitID: this.option.id, //营销页ID或者会员卡ID或者优惠券ID
				appInVisitType: 2, //访问类型(1,营销页;2,会员卡;3,优惠券)
			}
			if (this.shareMarketID) data.marketerID = this.shareMarketID;
			let res = await GK22.CreateByDto(data);
			if (res) {
				this.visterId = res.id;
			}
		},
		// 修改会会员卡的访问记录
		async updateVister() {
			let data = {
				id: this.visterId,
				appInIsBuy: 1
			}
			let res = await GK22.UpdateByDto(data);
		},
		splitNum(res) {
			if (!res.memberOf.cardImgUrl) { //  /upload/img/20200319/120912912_card-bj.png
				res.memberOf.cardImgUrl = 'https://pic.cwyyt.cn/upload/img/20200319/120912912_card-bj.png';
			} else {
				res.memberOf.cardImgUrl = res.memberOf.cardImgUrl;
			}

			if (!res.memberOf.cardLogoUrl) { // https://pic.yunyutian.cn/upload/yytBanner/img1.png
				res.memberOf.cardLogoUrl = 'https://pic.cwyyt.cn/upload/img/20200319/121504154_card-logo.png';
			} else {
				res.memberOf.cardLogoUrl = res.memberOf.cardLogoUrl;
			}

			let splitRule = [4, 4, 6, 5];
			let array = [];

			if (res.memberOf.hyUserCode) {
				for (let i = 0; i < splitRule.length; i++) {
					let curStr = res.memberOf.hyUserCode.substring(0, splitRule[i]);
					res.memberOf.hyUserCode = res.memberOf.hyUserCode.substring(splitRule[i]);
					array.push(curStr);
				}
			}

			res.memberOf.hyUserCode = array;
			const obj = res.memberOf;
			obj.id = res.id;
			obj.hyInRuleList = res.hyInRuleList;

			if (!obj.isEnableStore) {
				obj.hyInRuleList = obj.hyInRuleList.filter(item => {
					return item.inRuleType != 2;
				});
			}

			this.cardInfo = obj;
		},

		async unclaimedCard(id, success) { //会员卡详情
			let data = {
				hyCardID: id
			};

			if (this.shopId) {
				data.storeId = this.shopId;
			}

			let res = await HY07.unclaimedCard(data);
			if (!this.shopId) {
				this.shopId = res.storeID;
			}

			if (res) {
				if (!res.cardImgUrl) {
					res.cardImgUrl = 'https://pic.cwyyt.cn/upload/img/20200319/120912912_card-bj.png';
				} else {
					res.cardImgUrl = res.cardImgUrl;
				}

				if (!res.cardLogoUrl) {
					res.cardLogoUrl = 'https://pic.cwyyt.cn/upload/img/20200319/121504154_card-logo.png';
				} else {
					res.cardLogoUrl = res.cardLogoUrl;
				}
				if (res.getMemberCardConfig) {
					res.getMemberCardConfig = JSON.parse(res.getMemberCardConfig)
				}
				res.hyInRuleList = res.hyInRuleList.filter(item => item.inRuleType != 2);
				this.cardInfo = res;
				this.updateShareInfo(res.hyCardTitle);
				this.recordDiaily(res.hyCardTitle);
				success && success(res);
			}
		},

		async getMemberCard(id) { //获取会员卡信息
			let data = {
				hyUserCardID: id
			};
			let res = await HY07.memberCardInfo(data);
			if (res) {
				this.shopId = res.memberOf.getStoreID;
				// 是不是分销卡
				if (res.memberOf.isCanDistribution == 1) {
					this.isCanDistribution = true;
				}
				this.updateShareInfo(res.memberOf.hyCardTitle);
				this.recordDiaily(res.memberOf.hyCardTitle);
				this.splitNum(res);
			}
		},

		goCode(event) {
			let id = event.currentTarget.dataset.id;
			let code = this.cardInfo.hyUserCode.join('');
			uni.navigateTo({
				url: `/pages/personalSub/qrCode/qrCode?id=${id}&code=${code}&isDynamicCode=${this.cardInfo.isDynamicCode}`
			});
		},

		async collectCard(event) { //领取会员卡
			let self = this;
			if (this.cardInfo.isPutaway != 1) {
				return;
			}
			if (this.cardInfo.surplusCount <= 0) {
				uni.showToast({
					title: '此卡已被领完，无法领取',
					icon: 'none',
					duration: 3000
				});
				return;
			}
			if (this.cardStatus == 3) {
				uni.showToast({
					title: '此卡已被禁用，无法领取',
					icon: 'none',
					duration: 3000
				});
				return;
			}
			let id = event.currentTarget.dataset.id;
			//判断必填项
			if (this.cardInfo.getMemberCardConfig.isRequiredUserName == 0 && this.cardInfo.getMemberCardConfig
				.isRequiredSex == 0 && this.cardInfo.getMemberCardConfig.isRequiredBirthday == 0 && this.cardInfo.getMemberCardConfig
				.isRequiredTel == 0 && this.cardInfo.getMemberCardConfig.isRequiredIdentity == 0 && this.cardInfo.getMemberCardConfig
				.isRequiredCompany == 0 && this.cardInfo.getMemberCardConfig.isRequiredProvince == 0 && this.cardInfo.getMemberCardConfig
				.isRequiredAddress == 0) {
				if (this.cardInfo.isNeedBuy == 0) { //是否需要购买
					let data = {
						hyCardID: this.hyCardID,
						userCardStatus: "2",
						cardComeType: "2",
						getStoreID: this.shopId,
						zZYOpenid: this.userInfo.openId,
						hyUserName: this.userInfo.fullName,
						hyUserSex: this.userInfo.sex,
						hyUserBirthday: this.userInfo.birthDay,
						hyUserTel: this.userInfo.phone,
						cWCompanyID: this.cardInfo.cwCompanyID,
						isBuySuccess: '1',
						HyUserCity: this.userInfo.city,
						HyUserProvince: this.userInfo.province,
						HyUserCompanyID: this.userInfo.company,
						shareMarketID: getApp().globalData.couponsCom.origin == 'isWeb' ? getApp().globalData.couponsCom.markerId : this.shareMarketID,
						shareOpenId: this.shareOpenId,
						cardReceiveFromType: getApp().globalData.couponsCom.origin == 'isWeb' ? 30 :
							10, //(10:卡券详情；20:秒杀；30:营销页)除了营销页外 都算卡券详情
						cardReceiveFromId: getApp().globalData.couponsCom.origin == 'isWeb' ? getApp()
							.globalData.couponsCom.marketSetId : this.hyCardID, //卡券领取来源id
					};
					let res = await HY07.CreateByDto(data);
					if (!res.error) {
						this.updateVister(); //修改
						uni.redirectTo({
							url: `/pages/common/paySuc/paySuc?id=${res.hyCardID}`
						})
					}
				} else {
					let data = {
						shopId: this.shopId,
						userId: getApp().globalData.LoginUserId
					};
					// 获取会员卡状态用于获取支付信息
					let res = await GZH09.DetailAsync(data);
					let param = {
						logo: this.cardInfo.cardLogoUrl ? this.cardInfo.cardLogoUrl : 'https://pic.cwyyt.cn/upload/img/20200319/121504154_card-logo.png',
						comName: res.businessName,
						storeName: res.branchName,
						storeId: this.shopId,
						productId: this.hyCardID,
						productName: this.cardInfo.hyCardTitle,
						payAmount: this.cardInfo.cardBuyAmount,
						relAmount: this.cardInfo.cardBuyAmount,
						buyType: "1",
						hyUserName: this.userInfo.fullName,
						hyUserSex: this.userInfo.sex,
						hyUserBirthday: this.userInfo.birthDay,
						hyUserTel: this.userInfo.phone,
						shareMarketID:getApp().globalData.couponsCom.origin == 'isWeb' ? getApp().globalData.couponsCom.markerId :  this.shareMarketID,
						shareOpenId: this.shareOpenId,
						visterId: this.visterId,
						cardReceiveFromType: getApp().globalData.couponsCom.origin == 'isWeb' ? 30 :
							10, //(10:卡券详情；20:秒杀；30:营销页)除了营销页外 都算卡券详情
						cardReceiveFromId: getApp().globalData.couponsCom.origin == 'isWeb' ? getApp()
							.globalData.couponsCom.marketSetId : this.hyCardID, //卡券领取来源id
					};
					uni.navigateTo({
						url: `/pages/common/pay/pay?param=${JSON.stringify(param)}&type=1`
					});
				}
			} else {
				uni.navigateTo({
					url: `/pages/personalSub/buyMemberCard/buyMemberCard?id=${id}&shopId=${this.shopId}&shareMarketID=${this.shareMarketID}&shareOpenId=${this.shareOpenId}&visterId=${this.visterId}`
				});
			}
		},
		goInrule(event) {
			let type = event.currentTarget.dataset.type;
			let id = event.currentTarget.dataset.id;
			let param = event.currentTarget.dataset.marketsetparam;

			switch (type) {
				case 1:
					uni.navigateTo({
						url: `/pages/outUrl/outUrl?marketSetID=${id ? id : ''}&paramValue=${param ? param : ''}`
					});
					break;

				case 2:
					uni.navigateTo({
						url: `/pages/personalSub/prePay/prePay?id=${this.cardInfo.hyUserCardID}`
					});
					break;

				case 3:
					uni.navigateTo({
						url: `/pages/indexSub/shopInfo/shopInfo?id=${id ? id : ''}`
					});
					break;

				case 4:
					uni.navigateTo({
						url: `/pages/personalSub/coupons/coupons?smallProgramCardID=${id ? id : ''}&shopId=${this.shopId}`
					});
					break;

				case 5:
					uni.navigateTo({
						url: `/pages/personalSub/myCoupon/myCoupon?cwCompanyID=${this.cardInfo.cwCompanyID}`
					});
					break;
			}
		}
	}
};
