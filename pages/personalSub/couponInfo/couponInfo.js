import GK06 from '@/service/GK/GK06AppService.js';
import GK07 from '@/service/GK/GK07AppService.js';
export default {
	data() {
		return {
			nowDate: '',
			useId: '',
			shopId: '',
			couponListBg: getApp().globalData.PicDomain + '/upload/yytBanner/coupon_Info.png',
			cardInfos: [],
			isLoadEnd: true //是否加载完毕（是否禁用领取按钮）

		};
	},
	filters: {
		formatRemark(val) {
			return val.replace('到', ' 至 ');
		},
		formatCardCode(val) {
			let formatStr = val.slice(0, 8);
			let tailStr = val.slice(8);
			const g = /\d{4}/g;
			const matched = formatStr.match(g);
			return matched ? matched.join(' ') + ' ' + tailStr : val;
		}
	},
	components: {},
	props: {},
	async onLoad(options) {
		getApp().globalData.curUrl = {
			path: this.$util.getCurrentPageUrl(),
			query: options
		};
		await getApp().globalData.verifyAu();
		this.nowDate = this.$util.formatTime();
		this.shopId = options.shopId;
		this.getCard();
	},
	methods: {
		// 跳转到优惠券详情
		goDetail(e) {
			let id = e.currentTarget.dataset.couponid;
			let shopId = this.shopId;
			uni.navigateTo({
				url: `/pages/personalSub/coupons/coupons?smallProgramCardID=${id}&shopId=${shopId}`
			});
		},

		// 获取门店的所有卡卷的信息
		async getCard() {
			let data = {
				xcxUserID: getApp().globalData.LoginUserId,
				storeId: this.shopId,
				pagedInput: {
					pageIndex: 1,
					pageSize: 1000,
					order: 'CardName desc',
					filter: {
						Type: 'and',
						Conditions: [{
								Attribute: 'IsEnable',
								Datatype: 'int',
								Operatoer: 'eq',
								Value: 1
							},
							{
								Attribute: 'SurplusCount',
								Datatype: 'int',
								Operatoer: 'gt',
								Value: 0
							}
						]
					}
				}
			};
			let result = await GK06.GetDataPage(data);
			if (result) {
				const list = result.datalist.dataList;
				const newlist = [];
				list.forEach(item => {
					if (!item.isPast) {
						newlist.push(item);
					}
				})
				this.cardInfos = newlist;
			};
		},
		//领取优惠券
		async goGet(e) {
			let url = encodeURIComponent(`/pages/personalSub/couponInfo/couponInfo?shopId=${this.shopId}`); // if (!app.checkRegister(url)) {
			let index = e.currentTarget.dataset.index;
			let userId = getApp().globalData.userInfo.id;
			let cardItem = this.cardInfos[index];
			if (cardItem.surplusCount == 0) {
				uni.showToast({
					title: '卡券已领完!',
					icon: 'none',
					duration: 2000,
					mask: true
				});
				return;
			}
			let data = {
				xcxUserID: userId,
				smallProgramCardID: cardItem.smallProgramCardID,
				couponReceiveFromType: getApp().globalData.couponsCom.origin == 'isWeb' ? 30 : 10, //(10:卡券详情；20:秒杀；30:营销页)除了营销页外 都算卡券详情
				couponReceiveFromId: getApp().globalData.couponsCom.origin == 'isWeb' ? getApp()
					.globalData.couponsCom.marketSetId : cardItem.smallProgramCardID, //卡券领取来源id
			};

			let result = await GK07.ReceiveCoupons(data);
			if (result) {
				cardItem.surplusCount = cardItem.surplusCount - 1;
				cardItem.restrictionPerPerson = cardItem.restrictionPerPerson - 1;
				const tempCardsInfos = [].concat(this.cardInfos);
				tempCardsInfos[index].surplusCount = cardItem.surplusCount;
				tempCardsInfos[index].restrictionPerPerson = cardItem.restrictionPerPerson;
				this.cardInfos = tempCardsInfos;
				setTimeout(() => {
					uni.showToast({
						title: '领取成功,可到我的卡券中查看',
						icon: 'none',
						duration: 2000,
						mask: true
					});
				}, 100);
			}
		},
		//购买卡券
		goBuy(e) {
			let cardItem = this.cardInfos[e.currentTarget.dataset.index];
			uni.setStorageSync('couponInfoCarDinfo', cardItem); // 验证改用户是否注册
			uni.navigateTo({
				url: '/pages/personalSub/buyCoupon/buyCoupon'
			});
		}
	}
};
