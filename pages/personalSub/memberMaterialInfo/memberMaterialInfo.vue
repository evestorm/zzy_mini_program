<!--完善资料-->
<template>
<view>
<view class="container">
	<view class="memberMaterial_header">
		<view class="memberMaterial_Img">
			<image :src="userInfo.headImg" mode="aspectFill"></image>
      <view class="memberMaterial_edit ">
          <text class="memberMaterial_name">{{userInfo.nickName ? userInfo.nickName : ''}}</text>
      </view>
		</view>
	</view>
	<view class="memberMaterial_Info">
		<view class="memberInfo_item">
			<text class="title">姓名</text>
			<input type="text" maxlength="16" placeholder="请输入您的姓名" class="setTitle" :value="userInfo.hyUserName" placeholder-class="placeholder" name="userName" @input="editUserName" selectionStart="0"></input>
		</view>
		<view class="memberInfo_item">
			<text class="title">性别</text>
			<view class="setSex">
				<view class="setSex_item" data-type="1" @tap="selectSex">
					<text class="sexName">男</text>
					<text class="icon iconfont icon-sexm sexIcon" :style="(curSelected == 1 ? 'color:#0183ff' : 'color:#9aa9a9')"></text>
				</view>
				<view class="setSex_item" data-type="2" @tap="selectSex">
					<text class="sexName">女</text>
					<text class="icon iconfont icon-sexw sexIcon" :style="(curSelected == 2? 'color:#0183ff' : 'color:#9aa9a9')"></text>
				</view>
			</view>
		</view>
		<view class="memberInfo_item">
			<text class="title">生日</text>
			<picker mode="date" :start="startDate" :value="userInfo.hyUserBirthday" @change="bindDateChange" :disabled="changeBirth">
				<view class="picker">
				<text class="setTitle">{{userInfo.hyUserBirthday ||'去设置'}}</text>
				</view>
			</picker>
		</view>
		<view class="memberInfo_item">
			<text class="title">电话</text>
			<text class="setTitle">{{userInfo.hyUserTel||''}}</text>
		</view>
		<view class="memberInfo_item" v-if="materialType==2">
			<text class="title">身份证号</text>
			<input type="text" placeholder="请输入身份证号" class="setTitle" :value="userInfo.hyUserIdentity" placeholder-class="placeholder" name="userIdentity" @input="editUserIdentity"></input>
		</view>
		<view class="memberInfo_item" v-if="materialType==2">
			<text class="title">单位信息</text>
			<input type="text" placeholder="请输入单位信息" class="setTitle" :value="userInfo.hyUserCompany" placeholder-class="placeholder" name="userCompany" @input="editUserCompany"></input>
		</view>
		<view class="memberInfo_item" v-if="materialType==2">
			<text class="title">省份信息</text>
			<picker mode="region" @change="bindRegionChange" :value="region" :custom-item="customItem">
				<view class="picker">
					<text class="setTitle mr10">{{region[0]||'省份城市'}}</text>
					<text class="setTitle mr10">{{region[1]||''}}</text>
					<text class="setTitle">{{region[2]||''}}</text>
				</view>
			</picker>
		</view>
		<view class="memberInfo_item" v-if="materialType==2">
			<text class="title">地址</text>
			<input type="text" placeholder="请输入地址" class="setTitle" :value="userInfo.hyUserAddress" placeholder-class="placeholder" name="useraddress" @input="editUserAddress"></input>
		</view>
	</view>
	<view class="weui-btn-area" :style="(materialType==1?'margin-top:250rpx':'')">
		<form report-submit="true" @submit="updateMemberCardInfo">
			<button class="weui-btn" formType="submit">保存</button>
		</form>
	</view>
</view>
</view>
</template>

<script>
export { default } from './memberMaterialInfo.js';
</script>
<style lang="less" scoped>
@import "./memberMaterialInfo.less";
</style>