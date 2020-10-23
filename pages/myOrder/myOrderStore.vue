<!-- 作者于大明 -->
<template>
	<view class="container">
		<!-- 顶部选项卡切换 -->
		<view class="parent-tab-wrapper">
			<view class="tab-item"
				v-for="(item, index) in tabArr" :key="index"
				@tap="selectTabbar(item, index)">
				<image class="icon" :src="item.selected ? item.activeIcon : item.icon" mode=""></image>
				<view class="name" :class="item.selected ? 'active' : ''">{{ item.name }}</view>
			</view>
		</view>
		<!-- 订单列表 -->
		<view class="parent-order-wrapper">
			<!-- 预订单 -->
			<view v-if="tabIdx == 0">
				<my-bookings ref="myBookings" :storeID="storeID"></my-bookings>
			</view>
			<!-- 宴会订单 -->
			<view v-if="tabIdx == 1">
				<my-banquet ref="myBanquet"  :storeID="storeID"></my-banquet>
			</view>
			<!-- 其他订单 -->
			<view v-if="tabIdx == 2">
				<my-order ref="myOrder" :storeID="storeID"></my-order>
			</view>
			<view v-if="tabIdx == 3">
				<my-mall ref="myMall" :storeID="storeID"></my-mall>
			</view>
		</view>
	</view>
</template>

<script>
import myBookings from '@/pages/myOrder/myBookings/myBookings.vue';
import myBanquet from '@/pages/myOrder/myBanquet/myBanquet.vue';
import myOrder from '@/pages/myOrder/myOther/myOther.vue';
import myMall from '@/pages/myOrder/myMallOrder/myMallOrder.vue';
export default {
	data() {
		return {
			tabIdx: 0, // 选中的tab的index
			storeID:null, // 门店ID用于过滤门店数据
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
	async onLoad(option) {
		this.storeID=option.storeID;
		this.tabIdx=option.tabIdx||0;
		
		// 初始化选中tab
		if(this.tabIdx){
			this.selectTabbar(this.tabArr[this.tabIdx],this.tabIdx);
		}
		this.loadData();
	},
	onShow() {
		switch (parseInt(this.tabIdx)){
			case 0:
				this.$refs.myBookings && (this.$refs.myBookings.refresh());
				break;
			case 1:
				this.$refs.myBanquet && (this.$refs.myBanquet.refresh());
				break;
			case 2:
				// 当电话号码不为空，且没有短信验证码弹窗时，刷新
				(this.$refs.myOrder && this.$refs.myOrder.phone != '' && this.$refs.myOrder.showModal != true) && (this.$refs.myOrder.refresh());
				break;
			case 3:
				this.$refs.myMall && (this.$refs.myMall.refresh());
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
		},
		loadData(){
			switch (this.tabIdx){
				case 0:
					this.$refs.myBookings && (this.$refs.myBookings.refresh());
					break;
				case 1:
					this.$refs.myBanquet && (this.$refs.myBanquet.refresh());
					break;
				case 2:
					// 当电话号码不为空，且没有短信验证码弹窗时，刷新
					(this.$refs.myOrder && this.$refs.myOrder.phone != '' && this.$refs.myOrder.showModal != true) && (this.$refs.myOrder.refresh());
					break;
				case 3:
					this.$refs.myMall && (this.$refs.myMall.refresh());
					break;
				default:
					this.$refs.myBookings && (this.$refs.myBookings.refresh());
					break;
			}
		}
	}
};
</script>

<style lang="less" scoped>
.container {
	width: 100%;
	height: 100%;
	overflow: hidden;
	background: rgba(242, 242, 242, 1);
}
// 顶部选项卡
.parent-tab-wrapper {
	// position: absolute;
	// left: 0;
	// top: 0;
	width: 100%;
	height: 100rpx;
	background-color: white;
	display: flex;
	justify-content: space-between;
	align-items: center;

	.tab-item {
		width: 160rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.icon {
			width: 54rpx;
			height: 54rpx;
		}
		.name {
			font-size: 20rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(102,106,109,1);
			&.active {
				color: rgba(0, 132, 249, 1);
			}
		}
	}
}
// 订单列表容器
.parent-order-wrapper {
	// height: 100%;
	// overflow: hidden;
	box-sizing: border-box;
	height: 100vh;
	overflow: hidden;

}
</style>
