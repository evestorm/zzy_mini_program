<!-- 取消订单 -->
<template>
	<view class="container">
		<view class="cancelOrder_Info">
			<view class="cancelOrder_content">
				<text class="cancelOrder_title">取消原因</text>
				<view class="cancelOrder_content_radio-group">
					<radio-group @change="radioChange">
						<label class="weui-cell weui-check__label" v-for="(item, value) in radioItems" :key="value">
							<radio class="weui-check" :value="item.name" :checked="item.checked"></radio>
							<view class="weui-cell__bd">{{ item.name }}</view>
							<view class="weui-cell__ft weui-cell__ft_in-radio" v-if="item.checked">
								<image src="https://pic.cwyyt.cn/upload/yyticons/1645404540_is-sel.png" mode="" class="weui-icon-radio"></image>
							</view>
						</label>
					</radio-group>
				</view>
				<view class="cancelOrder_content_textarea" v-if="isShow">
					<!-- <text class="cancelOrder_content_textarea_title" v-show="radioItems.length > 0">填写取消订单原因</text> -->
					<view class="cancelOrder_content_textarea_content">
						<textarea
							class="weui-textarea"
							auto-focus
							placeholder="请写下您取消订单的原因~"
							adjust-position
							:minlength="min"
							:maxlength="max"
							:value="cancelDesc_Input"
							@input="getCancelDesc"
							placeholder-class="placeholder"
						></textarea>
						<view class="weui-textarea-counter">{{ currentWordNumber || 0 }}/{{ max }}</view>
						<text class="hint">{{ texts }}</text>
					</view>
				</view>
			</view>
			
			
		</view>
		<view class="bottom-btn">
			<button class="btn" @tap="goSubmit">提交</button>
		</view>
	</view>
</template>

<script >
	export { default } from './cancelOrder.js';
</script>
<style lang="less" scoped>
	@import './cancelOrder.less';
</style>
