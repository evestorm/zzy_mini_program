<template>
    <view>
         <view class="my-reply">
			
				<textarea v-model='data.cstRemark' class="textarea-text" maxlength='300' placeholder-style="font-size:28rpx" placeholder="请输入客户备注"/>
				<text class="textarea-length">{{data.cstRemark.length}}/300</text>
			</view>
			<view class="weui-btn-area" style="margin-top: 200rpx;">
			    <button class="weui-btn"   @tap="updateFile">保存</button>		     
			</view>
    </view>
</template>

<script>
    export { default } from './evaluate.js';
</script>

<style lang="less" scoped>
    @import url('evaluate.less');
</style>
