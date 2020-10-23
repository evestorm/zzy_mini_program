<template>
	<view class="banner-page">
		<view class="ad_banner" v-if="memberCardInfo.cardBannerUrl"><image mode="aspectFill" :src="memberCardInfo.cardBannerUrl"></image></view>
		<view class="memberMaterial_Info">
			<view class="memberInfo_item">
				<text class="title">姓名</text>
				<input :value="userInfo.fullName" placeholder="请输入您的姓名" maxlength="16" placeholder-class="placeholder" name="userName" @input="editUserName" class="setTitle"></input>
			</view>
			<view class="memberInfo_item">
				<text class="title">性别</text>
				<view class="setSex">
					<view class="setSex_item" data-type="1" @tap="selectSex">
						<text class="sexName">男</text>
						<text class="icon iconfont icon-sexm sexIcon" :style="curSelected == 1 ? 'color:#0183ff' : 'color:#9aa9a9'"></text>
					</view>
					<view class="setSex_item" data-type="2" @tap="selectSex">
						<text class="sexName">女</text>
						<text class="icon iconfont icon-sexw sexIcon" :style="curSelected == 2 ? 'color:#ff0000' : 'color:#9aa9a9'"></text>
					</view>
				</view>
			</view>
			<view class="memberInfo_item">
				<text class="title">生日</text>
				<picker mode="date" :start="startDate" :value="userInfo.birthDay" @change="bindDateChange">
					<view class="picker">
						<text class="setTitle">{{ userInfo.birthDay || '去设置' }}</text>
					</view>
				</picker>
			</view>
			<view class="memberInfo_item">
				<text class="title">电话</text>
				<text class="setTitle">{{ userInfo.phone || '暂无' }}</text>
			</view>
		</view>
		<view class="bottom-btn">
			<view class="pay_btn" v-if="memberCardInfo.isNeedBuy">
				<view class="payMoney">
					<text class="payTitle">会员支付</text>
					<text class="rmb">￥</text>
					<text class="payNum">{{ memberCardInfo.cardBuyAmount | formatMoney }}</text>
				</view>
				<!-- 购买会员 -->
				<form report-submit="true" @submit="buyMemberCard"><button class="goPay" formType="submit">立即领取</button></form>
			</view>
			<form report-submit="true" @submit="getMemberCard" v-else><button class="weui-btn" formType="submit">立即领取</button></form>
		</view>
	</view>
</template>

<script>
export { default } from './buyMemberCard.js';
</script>
<style lang="less" scoped>
@import './buyMemberCard.less';
</style>
