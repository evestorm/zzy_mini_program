import myBookings from '@/pages/myOrder/myBookings/myBookings.vue';
import myBanquet from '@/pages/myOrder/myBanquet/myBanquet.vue';
import myOrder from '@/pages/myOrder/myOther/myOther.vue';
import myMall from '@/pages/myOrder/myMallOrder/myMallOrder.vue';
export default {
	data() {
		return {
			tabIdx: 0, // 选中的tab的index
			tabArr: [
				{
					name: '预订单',
					icon: 'https://pic.cwyyt.cn/upload/yyticons/165904594_bookings-tab.png',
					activeIcon: 'https://pic.cwyyt.cn/upload/yyticons/1659115911_bookings-tab-active.png',
					selected: true
				},
				{
					name: '宴会订单',
					icon: 'https://pic.cwyyt.cn/upload/yyticons/1658465846_banquet-tab.png',
					activeIcon: 'https://pic.cwyyt.cn/upload/yyticons/1658575857_banquet-tab-active.png',
					selected: false
				},
				{
					name: '其他订单',
					icon: 'https://pic.cwyyt.cn/upload/yyticons/17040646_other-tab.png',
					activeIcon: 'https://pic.cwyyt.cn/upload/yyticons/170412412_other-tab-active.png',
					selected: false
				},
				{
					name: '商城订单',
					icon: 'https://pic.cwyyt.cn/upload/yyticons/170353353_mall-tab.png',
					activeIcon: 'https://pic.cwyyt.cn/upload/yyticons/17040040_mall-tab-active.png',
					selected: false
				}
			]
		};
	},
	components: {
		myBookings,
		myBanquet,
		myOrder,
		myMall
	},
	methods: {
		// 选择顶部tabbar
		selectTabbar(item, idx) {
			if (item.selected) return;
			this.tabArr.forEach(item => {
				item.selected = false;
			});
			item.selected = true;
			this.tabIdx = idx;
			this.$nextTick(() => {//计算高度
				this.$refs.myBookings && (this.$refs.myBookings.calcMescrollTop());
				this.$refs.myBanquet && (this.$refs.myBanquet.calcMescrollTop());
				this.$refs.myOrder && (this.$refs.myOrder.calcMescrollTop());
				this.$refs.myMall && (this.$refs.myMall.calcMescrollTop());
			})
		}
	},
	async onLoad(option) {
		await getApp().globalData.verifyAu();
	},
	onShow() {
		console.log('onShow')
		// 没有用户信息需要跳转
		if(!getApp().globalData.LoginUserId)return;
		switch (this.tabIdx){
			case 0:
				this.$refs.myBookings && (this.$refs.myBookings.refresh());
				// this.$refs.myBookings && (this.$refs.myBookings.calcMescrollTop());
				break;
			case 1:
				this.$refs.myBanquet && (this.$refs.myBanquet.refresh());
				// this.$refs.myBanquet && (this.$refs.myBanquet.calcMescrollTop());
				break;
			case 2:
				// 当电话号码不为空，且没有短信验证码弹窗时，刷新
				(this.$refs.myOrder && this.$refs.myOrder.phone != '' && this.$refs.myOrder.showModal != true) && (this.$refs.myOrder.refresh());
				// this.$refs.myOrder && (this.$refs.myOrder.calcMescrollTop());
				break;
			case 3:
				this.$refs.myMall && (this.$refs.myMall.refresh());
				// this.$refs.myMall && (this.$refs.myMall.calcMescrollTop());
				break;
			default:
				this.$refs.myBookings && (this.$refs.myBookings.refresh());
				break;
		}
		this.$nextTick(() => {//计算高度
			this.$refs.myBookings && (this.$refs.myBookings.calcMescrollTop());
			this.$refs.myBanquet && (this.$refs.myBanquet.calcMescrollTop());
			this.$refs.myOrder && (this.$refs.myOrder.calcMescrollTop());
			this.$refs.myMall && (this.$refs.myMall.calcMescrollTop());
		})
		
	}
};