<template>
<view class="container">
  <view class="dinner_introduce">
    <view class="title">宴会厅介绍</view>
    <view class="content">
      <view class="address_Info">
        <text class="address_location">{{memberRules.title}}</text>
      </view>
    </view>
  </view>
</view>
</template>

<script>

export default {
  data() {
    return {
      memberRules: {
        title: '注册即可成为双湖园会员，获得电子会员卡一张。会员可参加互动活动或购物获取会员积分并根据会员积分升级会员级别',
        content: '内容区域'
      }
    };
  }
};
</script>
<style lang="less" scoped>
	@import "./memberScore.less";
</style>