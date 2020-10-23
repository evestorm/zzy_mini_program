<template>
	<view class="main">
		<view class="myCard">
			<view class="card_list" :style="'background-image: url(' + (cardInfo.hyLevelBgUrl ? cardInfo.hyLevelBgUrl : cardInfo.cardImgUrl) + ')'">
				<view class="card_Info">
					<view class="left">
						<view class="image" :style="'background: url(' + cardInfo.cardLogoUrl + ') 0 0/100% 100% no-repeat'"></view>
						<text :style="'color: #' + cardInfo.hyCardTitleColor">{{ cardInfo.hyCardTitle }}</text>
					</view>
					<text :style="'color: #' + cardInfo.hyCardTitleColor">{{ cardInfo.hyLevelName }}</text>
				</view>
				<view class="card_bottom" :style="'color: #' + cardInfo.hyCardCodeColor">
					<text v-for="(innerItem, Innerindex) in cardInfo.hyUserCode" :key="Innerindex">{{ innerItem }}</text>
				</view>
			</view>
		</view>
		<view class="prepay_main" style="background: url(https://pic.cwyyt.cn/upload/img/20200318/172204224_bj.png) 0 0/100% 100% no-repeat;">
			<view v-for="(item, index) in amount" :key="index">
				<view
					v-for="(innerItem, innerIndex) in item"
					:key="innerIndex"
					:class="[innerItem ? 'prepay_item' : 'prepay_item_split', innerItem.selected ? 'prepay_sel' : '']"
					:data-outindex="index"
					:data-index="innerIndex"
					@tap="selectItem"
				>
					<view v-if="innerItem">{{ innerItem.hyPayOptionName }}</view>
					<view v-if="innerItem">
						<text class="mr_15">售价</text>
						<text>{{ innerItem.hyPayAmount }}元</text>
					</view>
				</view>
			</view>
			<!-- <view class="prepay_item {{item.selected ? 'prepay_sel' : ''}}" 
          wx:for="{{amount}}" 
          wx:for-indx="index" wx:key="index"
          data-index="{{index}}"
          bindtap="selectItem">
      <view>{{item.hyPayOptionName}}</view>
      <view>
        <text class="mr_15">售价：</text>
        <text>{{item.hyPayAmount}}元</text>
      </view>
    </view> -->
			<!-- <view wx:if="{{amount.length >= 0 && amount.length < 1}}"></view>
    <view wx:if="{{amount.length >= 0 && amount.length < 2}}"></view>
    <view wx:if="{{amount.length >= 0 && amount.length < 3}}"></view>
    <view wx:if="{{amount.length >= 0 && amount.length < 4}}"></view> -->
		</view>
		<view class="bottom-btn"><view class="prepay_btn" @tap="goPay">立即充值</view></view>
	</view>
</template>

<script>
export { default } from './prePay.js';
</script>
<style lang="less" scoped>
@import './prePay.less';
</style>
