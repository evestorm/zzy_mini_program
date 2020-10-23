<template>
	<view class="contents">
		<canvas
			style="background-color:#fff"
			id="firstCanvas"
			class="firstCanvas"
			canvas-id="firstCanvas"
			@touchmove="move"
			@touchstart="start($event)"
			@touchend="end"
			@touchcancel="cancel"
			@longtap="tap"
			disable-scroll="true"
			@error="error"
		></canvas>
		<view class="caozuo">
			<cover-view class="chongqian ts" @tap="clearClick">重签</cover-view>
			<cover-view class="over ts" @tap="overSign">完成签名</cover-view>
		</view>
	</view>
</template>
<script>
import YHBanquetTask from '@/service/YH/YHBanquetTaskAppService.js'; //获取任务详情
let content = null;
let touchs = [];
let canvasw = 0;
let canvash = 0;
let _that;
export default {
	data() {
		return {
			id: '', //接收任务id
			isEnd: false, // 是否签名
			isBj: true //图片白色背景
		};
	},
	methods: {
		async getWidthAndHeight() {
			//获取屏幕宽高
			let [err, res] = await uni.getSystemInfo();
			canvasw = res.windowWidth;
			canvash = res.windowHeight;
		},
		async overSign() {
			if (this.isEnd) {
				let [err, res] = await uni.canvasToTempFilePath({ canvasId: 'firstCanvas' });
				let tempFilePath = res.tempFilePath; //图片临时路劲
				let [error, result] = await uni.uploadFile({
					url: 'https://pic.cwyyt.cn', //仅为示例，非真实的接口地址
					fileType: 'image',
					filePath: tempFilePath,
					name: 'file'
				});
				let path = JSON.parse(result.data).path;
				let changeImgUrl = `https://pic.cwyyt.cn${path}`;
				//更新任务详情
				let userName = getApp().globalData.userInfo.fullName || getApp().globalData.userInfo.nickName;
				let upDateImgData = {
					id: _that.id,
					cstSignImgUrl: changeImgUrl,
					ModifiedName: userName
				};
				await YHBanquetTask.UpdateByDto(upDateImgData); //, res => {
				uni.navigateBack({
					delta: 1
				});
			} else {
				uni.showToast({
					title: '请先完成签名',
					icon: 'none',
					duration: 1500,
					mask: true
				});
			}
		},

		// 画布的触摸移动开始手势响应
		start(event) {
			//获取触摸开始的 x,y
			//背景色
			if (this.isBj) {
				content.fillStyle = '#fff';
				// 填充一个矩形
				content.fillRect(0, 0, canvasw, canvash);
				content.stroke();
				this.isBj = false;
			}

			let point = {
				x: event.changedTouches[0].x,
				y: event.changedTouches[0].y
			};
			touchs.push(point);
		},
		// 画布的触摸移动手势响应
		move(e) {
			let point = {
				x: e.touches[0].x,
				y: e.touches[0].y
			};
			touchs.push(point);
			if (touchs.length >= 2) {
				this.draw(touchs);
			}
		},

		// 画布的触摸移动结束手势响应
		end(e) {
			// console.log('触摸结束' + e);
			// 设置为已经签名
			this.isEnd = true;
			// 清空轨迹数组
			for (let i = 0; i < touchs.length; i++) {
				touchs.pop();
			}
		},

		// 画布的触摸取消响应
		cancel(e) {
			console.log('触摸取消' + e);
		},

		// 画布的长按手势响应
		tap(e) {
			console.log('长按手势' + e);
		},

		error(e) {
			console.log('画布触摸错误' + e);
		},

		//绘制
		draw(touchs) {
			let point1 = touchs[0];
			let point2 = touchs[1];
			touchs.shift();
			//线条
			content.fillStyle = '#000000';
			content.moveTo(point1.x, point1.y);
			content.lineTo(point2.x, point2.y);
			content.stroke();
			content.draw(true);
		},
		//清除操作
		clearClick() {
			// 设置为未签名
			this.isEnd = false;
			this.isBj = true;
			//清除画布
			this.getWidthAndHeight();
			content.clearRect(0, 0, canvasw, canvash);
			content.draw(true);
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		_that = this;
		//获取任务id
		_that.id = options.id;
		//获得Canvas的上下文
		content = uni.createCanvasContext('firstCanvas');
		//获取宽高 用于设置背景色
		this.getWidthAndHeight();
		//设置线的颜色
		content.setStrokeStyle('#000');
		//设置线的宽度
		content.setLineWidth(5);
		//设置线两端端点样式更加圆润
		content.setLineCap('round');
		//设置两条线连接处更加圆润
		content.setLineJoin('round');
	}
};
</script>
<style>
.ts {
	color: #fff;
	font-size: 25upx;
	height: 40upx;
	line-height: 40upx;
	padding: 10upx 20upx;
}

canvas {
	/* background-color: #f9f9f9; */
	width: 100%;
	height: 100%;
}

.contents {
	width: 100vw;
	height: 100vh;
	/* background: #01BEE8; */
	/* padding-top: 20upx; */
	/* padding-bottom: 100upx; */
	box-sizing: border-box;
}

#signatureImg {
	background-color: #eeeeee;
}

.caozuo {
	display: flex;
	height: 50upx;
	/* width: 750upx; */
	position: fixed;
	/* justify-content: flex-end; */
	right: 10rpx;
	bottom: 10rpx;
}

.caozuo view {
	width: 100upx;
	text-align: center;
	height: 50upx;
	line-height: 50upx;
	color: #ffffff;
}

.caozuo view:active {
	background-color: #cccccc;
	color: #333333;
}

.chongqian {
	background-color: #ff8f58;
}

.over {
	background-color: #0599d7;
}
</style>
