export default {
	data() {
		return {
			cardInfos: [],
			userInfo: {},
			num: 1,
			minusStatus: 'disable',
			shareMarketID: '',
			shareOpenId: "",
			visterId: '', //需要修改的访问记录id
		};
	},

	computed: {
		totalPrice() { //计算总金额
			if (this.num && this.cardInfos[0]) {
				return this.num * this.cardInfos[0].buyAmount
			}
		}
	},
	async onLoad(option) {
		getApp().globalData.curUrl = {
			// path: '/pages/personalSub/buyCoupon/buyCoupon',
			path: this.$util.getCurrentPageUrl(),
			query: option
		};
		await getApp().globalData.verifyAu(); // 验证权限获取用户信息
		this.visterId = option.visterId;
		this.shareMarketID = option.shareMarketID ? option.shareMarketID : '';
		this.shareOpenId = option.shareOpenId ? option.shareOpenId : ''; //获取用户信息
		this.userInfo = getApp().globalData.userInfo;
		let cardInfos = [];
		cardInfos[0] = uni.getStorageSync('couponInfoCarDinfo');
		this.cardInfos = cardInfos;
	},
	methods: {
		/*点击减号*/
		bindMinus() {
			let num = this.num;
			if (num > 1) {
				num--;
			}
			let minusStatus = num > 1 ? 'normal' : 'disable';
			this.num = num;
			this.minusStatus = minusStatus;
		},

		/*点击加号*/
		bindPlus() {
			let num = this.num;
			let limitNum = this.cardInfos[0].isCanGetNum || this.cardInfos[0].restrictionPerPerson;
			num++;
			let minusStatus = num > 1 ? 'normal' : 'disable';
			if (num > limitNum) {
				uni.showToast({
					title: '领取的次数达到上限',
					icon: 'none',
					duration: 1000
				});
				return;
			}
			this.num = num;
			this.minusStatus = minusStatus;
		},

		//购买优惠券
		goBuy(e) {
			let param = {
				storeId: this.cardInfos[0].storeID,
				productId: this.cardInfos[0].smallProgramCardID,
				productName: this.cardInfos[0].cardName,
				smallProgramCardID: this.cardInfos[0].smallProgramCardID,
				buyCount: this.num,
				logo: getApp().globalData.PicDomain + this.cardInfos[0].logo,
				comName: this.cardInfos[0].businessName,
				storeName: this.cardInfos[0].branchName,
				payAmount: this.cardInfos[0].buyAmount * this.num,
				relAmount: this.cardInfos[0].buyAmount * this.num,
				shareMarketID: getApp().globalData.couponsCom.origin == 'isWeb' ? getApp().globalData.couponsCom.markerId : this.shareMarketID,
				shareOpenId: this.shareOpenId ? this.shareOpenId : '',
				visterId: this.visterId, //修改访问记录需要的记录id
				couponReceiveFromType: getApp().globalData.couponsCom.origin == 'isWeb' ? 30 : 10, //(10:卡券详情；20:秒杀；30:营销页)除了营销页外 都算卡券详情
				couponReceiveFromId: getApp().globalData.couponsCom.origin == 'isWeb' ? getApp().globalData.couponsCom.marketSetId :
					this.cardInfos[0].smallProgramCardID, //卡券领取来源id
			};
			uni.redirectTo({
				url: `/pages/common/pay/pay?param=${JSON.stringify(param)}&type=2`
			});
		}
	}
};
