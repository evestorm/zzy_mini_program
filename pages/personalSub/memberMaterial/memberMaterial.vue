<!--完善资料	-->
<template>
	<view class="container">
		<view class="memberMaterial_header">
			<view class="memberMaterial_Img">
				<image :src="userInfo.headImg" mode="aspectFill"></image>
				<view class="memberMaterial_edit ">
					<text class="memberMaterial_name">{{ userInfo.nickName ? userInfo.nickName : '昵称' }}</text>
					<image src="https://pic.cwyyt.cn/upload/yyticons/1623222322_address-edit.png" class="memberMaterial-icon" @tap="editMaterial" mode=""></image>
				</view>
			</view>
		</view>
		<view class="memberMaterial_Info">
			<view class="memberInfo_item">
				<text class="title">姓名</text>
				<text class="setTitle">{{ userInfo.hyUserName || '' }}</text>
			</view>
			<view class="memberInfo_item">
				<text class="title">性别</text>
				<view class="setSex">
					<view class="setSex_item" v-if="curSelected == 2">
						<text class="sexName">女</text>
						<text class="icon iconfont icon-sexw sexIcon" v-if="materialType == 1" :style="curSelected == 2 ? 'color:#0183ff' : 'color:#9aa9a9'"></text>
					</view>
					<view class="setSex_item" v-if="curSelected == 1">
						<text class="sexName">男</text>
						<text class="icon iconfont icon-sexm sexIcon" v-if="materialType == 1" :style="curSelected == 1 ? 'color:#0183ff' : 'color:#9aa9a9'"></text>
					</view>
				</view>
			</view>
			<view class="memberInfo_item">
				<text class="title">生日</text>
				<text class="setTitle">{{ userInfo.hyUserBirthday || '' }}</text>
			</view>
			<view class="memberInfo_item">
				<text class="title">电话</text>
				<text class="setTitle">{{ userInfo.hyUserTel || '' }}</text>
			</view>
			<view class="memberInfo_item" v-if="materialType == 2">
				<text class="title">身份证号</text>
				<text class="setTitle" >{{ userInfo.hyUserIdentity|| ''}}</text>
			</view>
			<view class="memberInfo_item" v-if="materialType == 2">
				<text class="title">单位信息</text>
				<text class="setTitle">{{ userInfo.hyUserCompany || ''}}</text>
			</view>
			<view class="memberInfo_item" v-if="materialType == 2">
				<text class="title">省份信息</text>
				<view class="setTitle">
					<text class="setTitle mr10">{{ region[0] || '' }}</text>
					<text class="setTitle mr10">{{ region[1] || '' }}</text>
					<text class="setTitle">{{ region[2] || '' }}</text>
				</view>
			</view>
			<view class="memberInfo_item" v-if="materialType == 2">
				<text class="title">地址</text>
				<text class="setTitle">{{ userInfo.hyUserAddress || ''}}</text>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './memberMaterial.js';
</script>

<style lang="less" scoped>
@import './memberMaterial.less';
</style>
