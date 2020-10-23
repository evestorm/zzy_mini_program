import HY17 from '@/service/HY/HY17AppService.js';
export default {
	data() {
		return {
			hyUserCardID: '', // 会员卡ID
			// canvas绘图
			canvasW: 0,
			canvasH: 0,
			bannerImg: '',
			finished: false,

			screenshotTempFilePath: '', // 保存到图片后的路径

			// isCreatedCode: false, // 是否点击过底部保存或分享按钮生成了分销码记录

			// 是否从分销列表过来
			isFromMemberRetail: false,
			// 是否已核销
			isYiHeXiao: false,
		};
	},
	components: {},
	onShareAppMessage(res) {
		// NOTE:真正生成分销码（下面if中是备用代码，因为之前逻辑是点击底部两处按钮后才真的分销，后来又说改回来，进页面就要生成分销）
		// if (!this.isCreatedCode) {
		// 	this.isCreatedCode = !this.isCreatedCode;
		// 	this.addFenxiaoRecord();
		// }
		const path = `/pages/personalSub/showFenxiaoCode/showFenxiaoCode?code=${this.val}&image=${this.bannerImg}`;
		return {
			title: '查看分销码',
			path: path,
		}
	},
	onLoad(payload) {
		this.hyUserCardID = payload.hyUserCardID;
		// 从 memberRetail 过来还会传递：
		// isVerification ，0表示未核销，1表示已核销
		// val 代表分销码
		if (payload.val) {
			this.isFromMemberRetail = true;
			// 如果核销过，则不显示底部按钮
			this.isYiHeXiao = payload.isVerification == 1;
			this.val = payload.val;
		}
		uni.setNavigationBarTitle({
			title: '分销码'
		});
		uni.hideShareMenu();
		this.canvasW = uni.getSystemInfoSync().windowWidth - 30;
		this.canvasH = this.canvasW * 10 / 7; //请求图片为690*1000
		this.getFenxiaoCode();
	},
	watch: {},
	methods: {
		// 获取生成的分销码
		async getFenxiaoCode() {
			const data = {
				hyUserCardID: this.hyUserCardID,
			}
			let result = await HY17.CreateDistributionCode(data);
			if (result) {
				const {
					disRecordCode,
					imgUrl
				} = result;
				// 不是从分销列表过来，就获取新的code，否则不处理，因为onload已经给val赋值
				if (!this.isFromMemberRetail) {
					this.val = disRecordCode;
				}
				this.bannerImg = imgUrl || 'https://pic.cwyyt.cn/upload/img/20200321/1530383038_fxm-bj.png';
				// 不是从分销列表页过来才添加
				if (!this.isFromMemberRetail) {
					this.addFenxiaoRecord();
				}
				this.toDrawCanvas();
			}
		},
		// 点击右侧分享给微信好友时触发（条件：canvase未绘制完成）
		showTip() {
			if (!this.finished) {
				uni.showToast({
					title: '正在生成图片，稍后再试',
					icon: 'none'
				});
			}
		},
		// 保存二维码图片
		async toSaveImage() {
			if (!this.finished) {
				uni.showToast({
					title: '正在生成图片，稍后再试',
					icon: 'none'
				})
				return
			}
			const that = this;
			let data = {
				canvasId: 'mini_poster',
			}
			let [error, res] = await uni.canvasToTempFilePath(data);
			if (res) {
				let result = await uni.saveImageToPhotosAlbum({
					filePath: res.tempFilePath
				})
				uni.showToast({
					title: '保存成功'
				});
			}
			if (error) {
				uni.showToast({
					icon: 'none',
					title: '保存图片失败'
				})
			}
		},
		// 添加分销记录（点击底部两个按钮时触发）
		async addFenxiaoRecord() {
			const data = {
				hyUserCardID: this.hyUserCardID,
				disRecordCode: this.val,
			};
			let result = await HY17.AddDistribution(data);
			if (result) {
				// console.log('添加分销记录成功')
			} else {
				uni.showToast({
					title: '添加分销记录失败',
					icon: 'none'
				});
			}
		},
		// 绘制canvas
		async toDrawCanvas() {
			// 内边距
			const halfPaddingW = uni.upx2px(68); // 横向padding
			const halfPaddingH = uni.upx2px(30); // 纵向padding
			// 生成卡片的高度（canvas容器的高度-上下padding的和）
			const cardHeight = this.canvasH;
			const cardWidth = this.canvasW;
			// 上下文
			let ctx = uni.createCanvasContext('mini_poster', this);
			ctx.fillRect(0, 0, this.canvasW, this.canvasH);

			// 画banner
			// 下载banner图
			let banner = {
				tempFilePath: '',
			};
			try {
				// 此处判断图片是否为空，如果为空使用本地图片
				this.bannerImg = this.bannerImg;
				banner = await this.downloadImage(this.bannerImg);
				// console.log('165 banner海报根据网络图片转的本地临时路径:', banner.tempFilePath);
			} catch (e) {
				console.log(e);
			}

			// 背景图 banner （610/900
			const bannerW = cardWidth;
			const bannerH = cardHeight;
			const r = uni.upx2px(8);
			ctx.drawImage(banner.tempFilePath, 0, 0, bannerW, bannerH, )
			// 画已核销章子（从memberRetail分销列表来，而且是已核销）
			if (this.isFromMemberRetail && this.isYiHeXiao) {
				const stampTop = uni.upx2px(560);
				const stampW = uni.upx2px(300);
				const stampH = uni.upx2px(160);
				// 绘制图片参数：图片临时路径，x轴，y轴（banner宽+上padding，图片宽，图片高）
				ctx.drawImage('https://pic.cwyyt.cn/upload/img/20200115/1549244924_yihexiao-stamp.png', (this.canvasW - stampW) /
					2, stampTop, stampW, stampH);
			}
			ctx.draw();
			this.finished = true;
		},
		// 下载图片
		downloadImage(url) {
			return new Promise((resolve, reject) => {
				uni.downloadFile({
					url: url,
					success: (res) => {
						// console.log('图片下载成功', res);
						return resolve(res);
					},
					fail: (err) => {
						// console.log(err);
						return reject(err)
					}
				})
			})
		},
	}
}
