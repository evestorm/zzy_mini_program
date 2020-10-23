<!--我的信息-->
<template>
<!--pages/myInfo/myInfo.wxml-->
<view class="container">
  <view class="myPersonal_header">
    <view class="myPersonal_header_top">
       <image :src="userInfo.headImg" mode="aspectFill"></image>
    </view>
    <view class="myPersonal_header_bottom">
      <text class="myPersonal_name">{{userInfo.nickName}}</text>
      <!-- <text class='icon iconfont icon-wode myPersonal_sexIcon'></text> -->
    </view>
  </view>
  <view class="myPersonal_myInfo">
    <view class="myPersonal_myInfo_list">
      <text>姓名</text>
      <input type="text" maxlength="16" :value="userInfo.fullName" placeholder="请输入您的姓名" name="userName" @blur="updateMyInfo" @input="editUserName" :focus="isShowInput"></input>
    </view>
    <view class="myPersonal_myInfo_list">
      <text>生日</text>
      <picker mode="date" :start="startDate" :value="userInfo.birthDay" @change="bindDateChange" :disabled="userInfo.birthDay">
        <view class="picker">
          <text class="dateSelect">{{userInfo.birthDay|| '去设置'}}</text>
        </view>
      </picker>
    </view>
    <view class="myPersonal_myInfo_list">
      <text>电话</text>
      <text>{{userInfo.phone||'暂无'}}</text>
    </view>

  </view>
</view>
</template>

<script>
export { default } from './myInfo.js';
</script>
<style lang="less" scoped>
	@import "./myInfo.less";
</style>