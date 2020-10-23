import GK07 from '@/service/GK/GK07AppService.js';
import WMProduct from '@/service/WM/WMProductAppService.js';


export default {
	data() {
		return {
			isFiststShow: true, //控制第一次进入请求接口显示加载loading，再次进入（返回该页面操作）不显示loading
			couponListBg: getApp().globalData.PicDomain + '/upload/yytBanner/coupon_my.png',
			picDomain: getApp().globalData.PicDomain + '/',
			cardInfos: [],
			// 选择优惠券进入
			selectCoup: {
				storeId: '', // 门店ID
				orderPrice: 0 // 订单价格 
			}
		}
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
	async onLoad(option) {
		await getApp().globalData.verifyAu(); // 验证权限获取用户信息
		this.selectCoup.storeId = option.storeId;
		this.selectCoup.orderPrice = option.orderPrice;
	},
	onShow() {
		this.getCardInfos();
	},
	methods: {
		async getCardInfos() {
			let userId = getApp().globalData.userInfo.id;
			let data = {
				pageIndex: 1,
				pageSize: 1000,
				xcxUserID: userId
			};
			if (this.selectCoup.storeId) { //线上商城查询优惠列表
				data.isUseShop = 1;
				data.storeID = this.selectCoup.storeId;
			}
			let result = await GK07.GetMyProgramCardList(data, null, this.isFiststShow);
			this.isFiststShow=false;
			this.cardInfos = this.$util.null2str(result.dataList);
		},
		async chooseCoupon(item) { //选择优惠券 请求接口查询优惠券信息
			if (this.selectCoup.storeId) { //从线上商城确认订单界面进来有storeId，从我的进来没有
				let isBack = true;
				if (item.cardTypeEnumValue == '兑换') {
					let data = {
						id: item.productGUID
					}
					let res = await WMProduct.GetViewDto(data);
					item.productItems = [];
					item.productItems.push(res);
				} else if (item.cardTypeEnumValue == '代金') {
					if (this.selectCoup.orderPrice < item.fullSubtractionMax) {
						isBack = false;
						uni.showToast({
							title: `该代金券满${item.fullSubtractionMax}才可使用`,
							icon: 'none',
							duration: 2500
						});
					}
				}

				if (isBack) {
					// 加入选择的优惠券对应的产品
					getApp().globalData.selectCouponProductItem = item;
					uni.navigateBack({
						delta: 1
					})
				}

			} else {
				this.goDetail(item);
			}
		},
		// 跳转到优惠券详情
		goDetail(item) {
			uni.navigateTo({
				url: `/pages/personalSub/couponDetail/couponDetail?smallProgramCardUserID=${item.smallProgramCardUserID}`
			});
		},
		//使用卡券
		goUse(e) {
			let cardItem = this.cardInfos[e.currentTarget.dataset.index];
			getApp().globalData.selectMyCouponCarDinfo = cardItem;
			uni.navigateTo({
				url: "/pages/personalSub/useCoupon/useCoupon"
			});
		}
	}
};
