<template>
<view class="container">
  <view class="dinner_introduce">
    <view class="title">一.基本规则</view>
    <view class="content">
      <view class="address_Info">
        <text class="address_location">{{memberRules.title}}</text>
      </view>
    </view>
  </view>
  <view class="dinner_introduce">
    <view class="title">二.基本权益</view>
    <view class="content">
      <view class="address_Info">
        <text class="address_location">{{memberRules.content}}</text>
      </view>
    </view>
  </view>
</view>
</template>

<script>
export { default } from './memberRules.js';
</script>
<style lang='less' scoped>
	@import "./memberRules.less";
</style>