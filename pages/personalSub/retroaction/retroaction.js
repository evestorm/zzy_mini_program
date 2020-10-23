import GK05 from '@/service/GK/GK05AppService.js';
const MAX_NUM = 6;

export default {
	data() {
		return {
			maxNum: MAX_NUM,
			name: '',
			phone: '',
			desc: '',
			userInfo: {},
			retroactionData: {},
			//上次是否有未提交的反馈信息
			isSub: false,
			//是否提交成功
			isShowPhoto: false,
			//是否显示上传的图片
			files: [],
			//上传图片数组
			uploadImgNum: 0,
			//已上传图片的数量
			imgCodeArr: [] //上传的图片返回的code集合,
		};
	},
	onLoad(options) {
		//获取用户信息
		this.userInfo = getApp().globalData.userInfo;
		this.retroactionData = getApp().globalData.retroactionData;
		if (this.retroactionData) {
			this.name = this.retroactionData.name;
			this.phone = this.retroactionData.phone;
			this.desc = this.retroactionData.desc;
		}

		if (this.retroactionData) {
			this.name = this.retroactionData.name;
			this.phone = this.retroactionData.phone;
			this.desc = this.retroactionData.desc;
		}
	},
	onUnload(option) {
		if (!this.isSub) {
			getApp().globalData.retroactionData = {
				name: this.name,
				phone: this.phone,
				desc: this.desc
			};
		}
	},
	methods: {
		getName(e) {
			this.name = e.detail.value;
		},
		getPhone(e) {
			this.phone = e.detail.value;
		},
		getDesc(e) {
			this.desc = e.detail.value;
		},
		//点击上传图片
		upLoadPhoto() {
			this.isShowPhoto = true;
		},
		async chooseImage(e) {
			//首先判断上传大小是否已达到上限
			let uploadNum = MAX_NUM - this.uploadImgNum;
			let codeArr = this.imgCodeArr;

			if (codeArr.length >= MAX_NUM) {
				uni.showModal({
					title: '提示',
					content: '上传图片已达上限，无法继续上传！',
					success: function(res) {}
				});
				return;
			}

			let files = this.files;
			let [error, res] = await uni.chooseImage({
				count: uploadNum,
				// 默认4
				sizeType: ['original', 'compressed'],
				// 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'],
				// 可以指定来源是相册还是相机，默认二者都有
			})
			if (res) {
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
				// ;
				let tempFiles = res.tempFiles;
				tempFiles.forEach(item => {
					item['uploadProgress'] = 0;
					item['path_server'] = '';
					files.push(item);
				})
				// files: self.data.files.concat(res.tempFilePaths),
				this.isShowPhoto = true;
				this.files = files;
				this.uploadImgNum = this.uploadImgNum + res.tempFilePaths.length;
			}

		},
		//预览图片
		previewImage: function(e) {
			let tempFilePathList = [];
			let files = this.files;
			tempFilePathList = this._.map(files, 'path');
			// for (let i in files) {
			// 	tempFilePathList.push(files[i].path);
			// }

			uni.previewImage({
				current: e.currentTarget.id,
				// 当前显示图片的http链接
				urls: tempFilePathList // 需要预览的图片http链接列表
			});
		},
		//删除图片
		delFile: function(e) {
			this.uploadImgNum--;
			let path = e.currentTarget.dataset.path;
			let uploadNums = 6 - (6 - this.uploadImgNum);
			let files = this.files;
			let index = this._(files).findIndex(x => x.path == path);
			if (index != -1) {
				files.splice(index, 1)
			}
			this.uploadImgNum = uploadNums;
			this.files = files;
		},
		//提交反馈
		async goSubmit(e) {
			if (!this.name) {
				this.showToastCancel('cancel', '请输入真实名字');
				return;
			}

			if (!this.$util.validatemobile(this.phone)) {
				this.showToastCancel('cancel', '手机号输入有误');
				return;
			}

			if (!this.desc) {
				this.showToastCancel('cancel', '请输入反馈内容');
				return;
			}

			let dataObj = {
				openId: this.userInfo.openId,
				userName: this.name,
				userTel: this.phone,
				createTime: this.$util.formatTime(),
				suggest: this.desc
			};
			let rdata = await GK05.CreateByDto(dataObj);
			if (rdata) {
				this.showToastCancel('success', '反馈成功', () => {
					this.isSub = true;
					setTimeout(() => {
						uni.navigateBack({
							delta: 1 //默认值是1，返回的页面数，如果 delta 大于现有页面数，则返回到首页。
						});
					}, 2000);
				});
			};
		},
		showToastCancel(types, text, suc) {
			types = types || 'cancel';
			text = text || '验证码错误!';
			let image;
			if (types == 'cancel') {
				image = '/static/toast/cancel.png';
			} else if (types == 'success') {
				image = '/static/toast/success.png';
			}
			uni.showToast({
				image: image,
				icon: 'none',
				duration: 2000,
				color: '#fff',
				title: text,
				mask: true,
			});
			suc && suc();
		}
	}
};
