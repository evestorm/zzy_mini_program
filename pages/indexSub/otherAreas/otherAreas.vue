<!--作者:何文韬-->
<template>
	<view>
		<block>
			<!--内容-->
			<view class="content">
				<view class="page-left">
					<image
						class="head"
						:src="
							storeInfo.shopImg
						"
					></image>
				</view>
				<view class="page-right">
					<view class="store">{{ storeInfo.storeName }}</view>
				    <view class="area">企业名称:              {{ storeInfo.compnayName|parseScene }}           </view>
					<view class="area">门店电话:              {{ storeInfo.telephone|parseScene }}           </view>
					<navigator
						open-type="redirect"
						hover-class="none"
						:url="`/pages/indexSub/orderFood/orderFood?storeId=${storeInfo.storeId}`"
					 >
						<view class="button">选择此门店</view>
					</navigator>
				</view>
			</view>
		</block>
		<block v-for="(item, index) in list" :key="index">
			<!--内容-->
			<view :class="item.id == id?'content contentborder':'content'">
				<view class="page-left">
					<image
						class="head"
						:src="
							item.headImg == null
								? 'https://pic.cwyyt.cn/upload/sendPelpleApp/images/salesperson.png'
								: item.headImg
						"
					></image>
					<block v-if="item.id == id">
						<image
							class="pitchon"
							src="https://pic.cwyyt.cn/upload/yyticons/182708278_选中背景@2x.png"
						></image>
						<image
							class="check"
							src="https://pic.cwyyt.cn/upload/yyticons/1827162716_选中@2x.png"
						></image>
					</block>
				</view>
				<view class="page-right">
					<view class="store">{{ item.branchName }}</view>
					<view class="area">{{ item.sendPeopleArea|parseScene }}</view>
					<view class="area">负责人:              {{ item.sendPeopleName|parseScene }}            {{ item.sendPeoplePhone|parseScene }}</view>
					<view class="area" style="table-layout: fixed; "><rich-text :nodes="item.sendPeopleRemark" class="overflow"></rich-text> </view>
					<navigator
						open-type="redirect"
						hover-class="none"
						:url="`/pages/indexSub/orderFood/orderFood?scene=${item.id}`"
					>
						<view class="button">选择此区域</view>
					</navigator>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
export { default } from './otherAreas.js';
</script>

<style lang="less" scoped>
@import url('otherAreas.less');
</style>
