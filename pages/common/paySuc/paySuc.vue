<template>
	<view>
		<image class="fail_top" src="https://pic.cwyyt.cn/upload/img/20200321/1712541254_pay-suc.png"></image>
		<view class="fail_mid">会员卡已领取成功</view>
		<view class="fail_bot" @tap="goTo">返回</view>
	</view>
</template>

<script>
// const App = getApp().globalData;
// import PayAppService from '@/service/Pay/PayAppService.js';
// import util from '@/common/util.js';

export default {
	data() {
		return {
			url: '',
			param: '',
			timer: ''
		};
	},

	components: {},
	props: {},

	onLoad(option) {
		this.id=option.id;
		this.openId=getApp().globalData.userInfo.spOpenId;
		this.timer = setTimeout(() => {
		  this.goTo();
		}, 3000);
	},

	methods: {
		goTo() {
			clearTimeout(this.timer);
			uni.redirectTo({
				url: `/pages/personalSub/memberCenter/memberCenter?id=${this.id}&openId=${this.openId}&isNotLog=true`
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import './paySuc.less';
</style>
