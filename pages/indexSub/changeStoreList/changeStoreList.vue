<!--作者:李彦熹-->
<template>
	<view class="page-box">
		<navigator open-type="redirect" :url="`/pages/indexSub/orderFood/orderFood?storeId=${item.storeID}`" class="item mt-2" v-for="(item, index) in calStoreList" :key="index">
			<image v-if="params.storeId == item.storeID " class="item-selected-img"
				src="https://pic.cwyyt.cn/upload/yyticons/172609269_选中.png"
			mode="aspectFill"
			></image>
			<view class="item-top p-2">
				<view class="item-top-left">
					<text>{{ item.businessName }}({{item.branchName}})</text>
				</view>
				<view class="item-top-right">
					<text v-if="item.point>0">{{item.point}}km</text>  
				</view>
			</view>
			<view class="item-bottom pl-2">
				<image class="pr-1"
					src="https://pic.cwyyt.cn/upload/yyticons/1359495949_zzy-定位.png"
				mode="aspectFill"
				></image>
				<text>{{item.address}}</text>
			</view>
		</navigator>
	</view>
</template>

<script>
    export { default } from './changeStoreList.js';
</script>

<style lang="less" scoped>
    @import url('changeStoreList.less');
</style>
