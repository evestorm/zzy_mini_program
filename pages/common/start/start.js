import GK01AppService from '@/service/GK/GK01AppService.js'

export default {
	data() {
		return {
			bgImg: getApp().globalData.PicDomain + '/upload/yytBanner/beij.png',
			goImg: getApp().globalData.PicDomain + '/upload/yytBanner/wenzi.png',
			redirectUrl: '', // 最终跳转的url
			showNickName: false, // 展示获取微信名称
			showTel: false, // 展示获取手机号码
			isAllShow:false,// 控制两个按钮都是true的话 需要控制手机号码
			animationCloudData: ""
		};
	},
	onLoad: function(options) {
		let {
			showNickName, 
			showTel,
			redirectUrl
		} = options;
		this.showNickName = showNickName ? JSON.parse(showNickName) : false;
		let isShowtel = showTel ? JSON.parse(showTel) : false;
		if(this.showNickName&&isShowtel){
		     this.isAllShow=true; // 全部都展示的话 需要先授权一个 在授权一个	
		}else{
			this.showTel=isShowtel;
		}
		this.redirectUrl = decodeURIComponent(redirectUrl);
	},
	onReady: function() {
		// 页面渲染完成
		// 实例化一个动画
		var that = this;
		var i = 0;
		var ii = 0;
		var animationData = uni.createAnimation({
			duration: 1000,
			// 默认为400     动画持续时间，单位ms
			timingFunction: 'ease-in-out' //transformOrigin: '4px 91px'
		});
		var animationCloudData = uni.createAnimation({
			duration: 1000,
			// 默认为400     动画持续时间，单位ms
			timingFunction: 'ease-in-out' //transformOrigin: '4px 91px'

		}); //动画的脚本定义必须每次都重新生成，不能放在循环外

		animationCloudData.translateX(20).step({
			duration: 5000
		}).translateX(0).step({
			duration: 5000
		}); // 更新数据

		that.setData({
			// 导出动画示例
			animationCloudData: animationCloudData.export()
		});
		setInterval(function() {
			//动画的脚本定义必须每次都重新生成，不能放在循环外
			animationCloudData.translateX(30).step({
				duration: 5000
			}).translateX(-10).step({
				duration: 5000
			}); // 更新数据

			that.setData({
				// 导出动画示例
				//animationData: animationData.export(),
				animationCloudData: animationCloudData.export()
			});
			++ii; // console.log(ii);
		}.bind(that), 10000); //3000这里的设置如果小于动画step的持续时间的话会导致执行一半后出错
	},
	methods: {
		// ------------------------- sw-new -----------------
		showAuthDialog() {
			this.$refs.authPopup.open()
		},
		cancelAuth() {
			this.$refs.authPopup.close()
		},
		gohome() {
			uni.switchTab({
				url: '/pages/index/index'
			})
		},
		// 获取用户授权登录信息
		async bindGetUserInfo(e) {
			this.$refs.authPopup.close();
			if (e.detail.userInfo) {
				await getApp().globalData.UpdateUserInfo();
				if(!this.isAllShow){
					this.jumpUrl(this.redirectUrl);
				}else{
					uni.showToast({
						title: '在授权手机完成注册'
					});
					this.showTel=true;
					this.showNickName=false;
				}
				
				
			} else {
				uni.showModal({
					title: '未授权',
					content: '您未授权小程序获取您的信息,请重新授权'
				});
			}
		},
		// 获取验证手机号
		async getTel(e) {
			if (e.detail.encryptedData) {
				var data = {
					encryptedData: e.detail.encryptedData,
					iv: e.detail.iv,
					openId: getApp().globalData.userInfo.spOpenId
				};
				let rdata=await GK01AppService.GetTelNum(data);
				let updateUserDto = {
					id: getApp().globalData.LoginUserId,
					phone: rdata.phoneNumber
				};
				await getApp().globalData.UpdateUserInfo(updateUserDto);
				this.jumpUrl(this.redirectUrl);
			} else {
				uni.showModal({
					title: '未授权',
					content: '您未授权小程序获取您的手机号,请重新授权'
				});
			}
		},

		jumpUrl(url) {
			if (url.indexOf('index/index') > -1 || url.indexOf('myOrder/myOrder') > -1 || url.indexOf('shopSearch/shopSearch') >
				-1 || url.indexOf('personal/personal') > -1) {
				getApp().globalData.indexQuery = {
					shareOpenid: this.$util.getQueryString(url, 'shareOpenid')
				};
				uni.switchTab({
					url: url
				});
			} else {
				// url解码
				uni.redirectTo({
					url: url
				});
			}
		},

		goIndex(e) {
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		setData: function(obj) {
			let that = this;
			let keys = [];
			let val, data;
			Object.keys(obj).forEach(function(key) {
				keys = key.split('.');
				val = obj[key];
				data = that.$data;
				keys.forEach(function(key2, index) {
					if (index + 1 == keys.length) {
						that.$set(data, key2, val);
					} else {
						if (!data[key2]) {
							that.$set(data, key2, {});
						}
					}
					data = data[key2];
				});
			});
		}
	}
};
