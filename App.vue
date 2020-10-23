<script>
import Vue from 'vue';
import pagesAu from '@/common/pageAuthority.config.js';
import util from '@/common/util.js';
import GK01AppService from '@/service/GK/GK01AppService.js';
import GK18AppService from '@/service/GK/GK18AppService.js';
import GK20AppService from '@/service/GK/GK20AppService.js';
import GK21AppService from '@/service/GK/GK21AppService.js';
import GK22AppService from '@/service/GK/GK22AppService.js';
import NGKUser2StoreAppService from '@/service/NGK/NGKUser2StoreAppService.js';
import storage from '@/common/unistorage/index.js';

export default {
	globalData: {
		aMapKey: 'd5b8ac92271c1c9785b384c9b83ce8b5', //高德地图key
		PicDomain: 'https://pic.cwyyt.cn',
		curUrl: { path: '', query: '' }, // 存储页面地址和参数 用于判断当前页面是否需要加入权限操作
		indexQuery: {},
		addr: null, // 记录当前位置的精度和维度
		formatted_address: '', // 省市区 "湖北省武汉市洪山区书城路"
		userInfo: storage.getUserInfo(), // 用户信息
		//用户信息
		retroactionData: null,
		//反馈信息
		commentData: null,
		//评价信息
		bookData: null,
		LoginUserId: storage.getUserInfo() ? storage.getUserInfo().id : '',
		//存储登录的用户唯一ID
		IsAuthUserInfo: true,
		shaleSaleId: '',
		//点菜菜单
		globalFood: {
			confirmFood: []
		},
		selectMyCouponCarDinfo: {}, // 选择优惠券的Item
		selectCouponProductItem: {}, // 菜品优惠券进入商城后要在购物车内加入菜品
		storeInfo: {}, // 存储门店信息 用于判断用户最后进入的是那个门店
		confirmOrder: {
			orderSendType: 1 //1,自提;2,配送
		}, // confirmOrder 界面的缓存
		couponsCom:{
			origin:'zzy',
			marketSetId:'',// 用于缓存营销页id
			markerId:'',// 进营销页客户经理ID
		},//需要区别优惠券是否是营销页进入 ,营销页： 'isWeb'; 其他：zzy（默认） 在进入首页后 还原成'zzy'
		//  微信登陆 先获取code 在请求后端拿到对应的信息 进行登录操作
		async appLogin() {
			// #ifdef MP-WEIXIN
			let [error, res] = await uni.login({ provider: 'weixin' });
			let data = {
				code: res.code
			};
			let rdata = await GK01AppService.login(data);
			// rdata.spOpenId = rdata.openId; // 小程序里面的openid 都是用 wxOpenId
			this.LoginUserId = rdata.id;
			storage.setUserInfo(rdata);
			return rdata;
			// #endif

			// #ifdef H5
			if (!this.userInfo) {
				let userInfo = Vue.prototype.$AppConst.TestUserInfo;
				storage.setUserInfo(userInfo);
				this.LoginUserId = userInfo.id;
			}
			return Vue.prototype.$AppConst.TestUserInfo;
			// #endif
		},
		// 更新用户信息 没传就获取w微信的
		async UpdateUserInfo(updateUserDto) {
			if (!updateUserDto) {
				let [error, res] = await uni.getUserInfo();
				updateUserDto = {
					id: this.LoginUserId,
					nickName: res.userInfo.nickName,
					country: res.userInfo.country,
					province: res.userInfo.province,
					city: res.userInfo.city,
					headImg: res.userInfo.avatarUrl,
					encryptedData: res.encryptedData,
					iv: res.iv
				};
			}

			// 更新用户信息;
			let userInfo = await GK01AppService.UpdateByDto(updateUserDto);
			storage.setUserInfo(userInfo);
		},
		// 获取用户信息
		async GetUserInfo() {
			if (this.LoginUserId) {
				let data = {
					primaryKey: this.LoginUserId
				};
				let userInfo = await GK01AppService.GetDto(data, null, () => {
					this.appLogin();
				});
				if (userInfo) {
					storage.setUserInfo(userInfo);
				}
			}
		},
		// 获取用户定位
		async getLocation() {
			let [error, res] = await uni.getSetting();
			let authSetting = res.authSetting;
			if (!statu['scope.userLocation']) {
				let [error, res] = await uni.showModal({
					title: '是否授权当前位置',
					content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用'
				});
				if (res.confirm) {
					let [error, res] = uni.openSetting();
					if (res.authSetting['scope.userLocation'] === true) {
						uni.showToast({
							title: '授权成功',
							icon: 'success',
							duration: 1000
						});
					}
				}
			}
		},
		// 验证权限
		async verifyAu(success) {
			// 判断用户初始化信息
			if (!this.userInfo) {
				// 获取用户信息
				await this.appLogin();
			}
			let userInfo = getApp().globalData.userInfo;
			// 获取当前页面的URL和url完整路径
			let fullPath = util.getCurrentPageUrlAndArgs();
			let path = util.getCurrentPageUrl();

			// 看当前的url的权限 1代表需要获取用户信息 2 代表需要获取手机信息
			let urlAuthorInt = pagesAu['/' + path];
			// 没有权限信息 直接返回
			if (!urlAuthorInt) return;

			// 判断跳转之后 是只要获取用户信息 还是也是获取电话信息
			let showNickName = false;
			let showTel = false;
			if (urlAuthorInt === 1 && !userInfo.nickName) {
				showNickName = true;
				showTel = false;
			} else if (urlAuthorInt === 2 && !userInfo.nickName) {
				showNickName = true;
				showTel = true;
			} else if (urlAuthorInt === 2 && !userInfo.phone) {
				showNickName = false;
				showTel = true;
			}

			if (showNickName || showTel) {
				let redirectUrl = '/' + fullPath;
				let url = `/pages/common/start/start?showNickName=${showNickName}&showTel=${showTel}&redirectUrl=${encodeURIComponent(
					redirectUrl
				)}`;
				uni.redirectTo({
					url
				});
			}else{
				success && success();
			}
			
		},

		// 记录用户自发分享、营销页引导、客服经理app分享
		getShareInfo(options, noMarketSetID) {
			if (options.query.shareOpenid) {
				GK20AppService.CreateByDto(
					{
						fromOpenId: options.query.shareOpenid,
						userInOpenId: options.curOpenid,
						userPageUrl: options.path,
						userPageName: options.title,
						userPageDesc: options.description ? options.description : ''
					},
					res => console.log(res)
				);
			} else if (options.query.marketSetID && !noMarketSetID) {
				GK21AppService.CreateByDto(
					{
						marketSetID: options.query.marketSetID,
						marketInOpenId: options.curOpenid,
						marketPageUrl: options.path,
						marketPageName: options.title,
						marketingLogId: options.query.marketingLogId,
						marketPageDesc: options.description ? options.description : ''
					},
					res => console.log(res)
				);
			} else if (options.query.marketerID) {
				// 暂无
				GK22AppService.CreateByDto(
					{
						marketerID: options.query.marketerID,
						appInOpenId: options.curOpenid,
						appPageUrl: options.path,
						appPageName: options.title,
						appPageDesc: options.description ? options.description : ''
					},
					res => console.log(res)
				);
			}
		},

		//扫码进入添加门店(门店id，路由地址)
		AddNGKUser(storeid) {
			let userInfo = getApp().globalData.userInfo;
			let fullPath = util.getCurrentPageUrlAndArgs();
			let data = {
				xcxUserID: userInfo.id,
				storeID: storeid,
				GKPageFullPath: fullPath
			};

			NGKUser2StoreAppService.CreateByDto(data);
		},
		// 存入formid
		createformId(e) {},
		// 用于保存最后一次访问的页面 当进入时刻可以进行跳转
		lastInUrlObj: {
			// 缓存最后一次进入的界面
			saveLastInUrl() {
				let fullPath = util.getCurrentPageUrlAndArgs();
				storage.setLastInUrl(fullPath);
			},
			// 移除最后一次进入的界面
			removeLastInUrl() {
				storage.removeLastInUrl();
			},
			// 跳转最后一次进入的界面
			navLastInUrl() {
				let path = storage.getLastInUrl();
				path && uni.navigateTo({ url: `/${path}` });
			}
		},
		// 分享需要的数据
		shareObj: {
			getNormalShare() {
				let fullPath = util.getCurrentPageUrlAndArgs();
				let userInfo = getApp().globalData.userInfo;
				let shareUrl = util.getFullUrl(fullPath, { shareOpenId: userInfo.spOpenId });
				return {
					path: `/${shareUrl}`
				};
			}
		},
		// 及时更新微信小程序
		updateWxApp() {
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(res => {
				// 请求完新版本信息的回调
				if (res.hasUpdate) {
					updateManager.onUpdateReady(async res2 => {
						let [error, rdata] = await uni.showModal({
							title: '更新提示',
							content: '发现新版本，是否重启应用?',
							cancelColor: '#eeeeee',
							confirmColor: '#FF0000'
						});
						if (rdata.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					});
				}
			});

			updateManager.onUpdateFailed(async res => {
				let [error, rdata] = await uni.showModal({
					title: '提示',
					content: '检查到有新版本，但下载失败，请检查网络设置'
				});

				if (rdata.confirm) {
					// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
					updateManager.applyUpdate();
				}
			});
		}
	},
	async onLaunch(options) {
		this.$options.globalData.GetUserInfo();
		this.$options.globalData.updateWxApp();
	}
};
</script>

<style>
@import './app.css';
</style>
