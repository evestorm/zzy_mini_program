<template>
<view name="toast">
	<view :class="'weui-toast-wrapper ' + ( visible ? 'visible' : 'hidden' ) + ' ' + cls" :hidden="!visible">
		<view class="weui-toast">
	        <icon v-if="type" :type="type" size="55" :color="color" class="weui-icon_toast"></icon>
	        <view class="weui-toast__content">{{ text }}</view>
	    </view>
	</view>
</view>
</template>
<script>
	export default {
		props: []
	}
</script>
<style>
	.weui-mask {
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}
	
	.weui-mask.hidden {
		visibility: hidden;
		opacity: 0;
		-webkit-transition: .2s opacity linear;
		transition: .2s opacity linear;
	}
	
	.weui-mask.visible {
		visibility: visible;
		opacity: 1;
	}
	
	.weui-dialog-wrapper.hidden {
		visibility: hidden;
		opacity: 0;
	}
	
	.weui-dialog-wrapper.visible {
		visibility: visible;
		opacity: 1;
	}
	
	.weui-dialog-wrapper .weui-dialog {
		opacity: 0;
		-webkit-transition: opacity .3s;
		transition: opacity .3s;
	}
	
	.weui-dialog-wrapper.visible .weui-dialog {
		opacity: 1;
	}
	
	.weui-dialog {
		position: fixed;
		z-index: 5000;
		width: 80%;
		max-width: 300px;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		background-color: #FFFFFF;
		text-align: center;
		border-radius: 3px;
		overflow: hidden;
	}
	
	.weui-dialog__hd {
		padding: 1.3em 1.6em 0.5em;
	}
	
	.weui-dialog__title {
		font-weight: 400;
		font-size: 18px;
	}
	
	.weui-dialog__bd {
		padding: 0 1.6em 0.8em;
		min-height: 40px;
		font-size: 15px;
		line-height: 1.3;
		word-wrap: break-word;
		word-break: break-all;
		color: #999999;
	}
	
	.weui-dialog__bd:first-child {
		padding: 2.7em 20px 1.7em;
		color: #353535;
	}
	
	.weui-dialog__ft {
		position: relative;
		line-height: 48px;
		font-size: 18px;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
	}
	
	.weui-dialog__ft:after {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		height: 1px;
		border-top: 1px solid #D5D5D6;
		color: #D5D5D6;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}
	
	.weui-dialog__btn {
		display: block;
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
		color: #3CC51F;
		text-decoration: none;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		position: relative;
	}
	
	.weui-dialog__btn:active {
		background-color: #EEEEEE;
	}
	
	.weui-dialog__btn:after {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		width: 1px;
		bottom: 0;
		border-left: 1px solid #D5D5D6;
		color: #D5D5D6;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scaleX(0.5);
		transform: scaleX(0.5);
	}
	
	.weui-dialog__btn:first-child:after {
		display: none;
	}
	
	.weui-dialog__btn_default {
		color: #353535;
	}
	
	.weui-dialog__btn_primary {
		color: #0BB20C;
	}
	
	.weui-toast-wrapper {
	  padding: 0 20rpx;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 1010;
		display: block;
		-webkit-transition: .2s opacity linear;
		transition: .2s opacity linear;
	}
	
	.weui-toast-wrapper.hidden {
		visibility: hidden;
		opacity: 0;
	}
	
	.weui-toast-wrapper.visible {
		visibility: visible;
		opacity: 1;
	}
	
	.weui-toast-text .weui-toast {
		width: 12em;
		min-height: 0;
		padding: 20px;
		text-overflow: ellipsis;
	}
	
	.weui-toast-text .weui-toast__content {
		margin: 0;
	}
	
	.weui-toast-text .weui-icon_toast {
		display: none;
	}
	
	.weui-toast {
		-webkit-transform: translateX(-50%);
		transform: translateX(-50%);
		margin-left: 0!important;
	}
	
	.weui-toast {
		position: fixed;
		z-index: 5000;
		width: 7.6em;
		min-height: 7.6em;
		top: 180px;
		left: 50%;
		margin-left: -3.8em;
		background: rgba(40, 40, 40, 0.75);
		text-align: center;
		border-radius: 5px;
		color: #FFFFFF;
	}
	
	.weui-icon_toast {
		margin: 22px 0 0;
		display: block;
	}
	
	.weui-icon_toast.weui-icon-success-no-circle:before {
		color: #FFFFFF;
		font-size: 55px;
	}
	
	.weui-icon_toast.weui-loading {
		margin: 30px 0 0;
		width: 38px;
		height: 38px;
		vertical-align: baseline;
	}
	
	.weui-toast__content {
		margin: 0 0 15px;
	}
	
	.wux-rater {
		text-align: left;
		display: inline-block;
		line-height: normal;
	}
	
	.wux-rater .wux-rater-box {
		display: inline-block;
		text-align: center;
		cursor: pointer;
		color: #ccc;
	}
	
	.wux-rater .wux-rater-box:last-child {
		padding-right: 2px!important;
		margin-right: 0px!important;
	}
	
	.wux-rater .wux-rater-box.is-disabled {
		color: #ccc !important;
		cursor: not-allowed;
	}
	
	.wux-rater-box {
		position: relative;
	}
	
	.wux-rater-inner {
		position: relative;
		display: inline-block;
	}
	
	.wux-rater-outer {
		position: absolute;
		left: 0;
		top: 0;
		display: inline-block;
		overflow: hidden;
	}
</style>