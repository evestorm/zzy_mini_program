// 作者:覃彬
import GZH09 from '@/service/GZH/GZH09AppService.js';
import GK04 from '@/service/GK/GK04AppService.js';
import GK08 from '@/service/GK/GK08AppService.js';
import MSActiveConfig from '@/service/MS/MSActiveConfigAppService.js';
export default {
	data() {
		return {
			isFiststShow: true, //控制第一次进入请求接口显示加载loading，再次进入（返回该页面操作）不显示loading
			shopId: '', //门店id
			basUrl: '', //'https://pic.cwyyt.cn'
			swiperCurrent: 0, // banner当前小圆点所处idx
			shopInfo: {
				isCollect: false, //是否收藏
			}, //店铺详情
			myCardList: [], //我的权益
			marketerPersonalInterest: {}, //客服经理信息
			towerStart: 0, //用于计算触摸移动距离
			direction: '', //towerSwiper计算方向left right
			discountInfoList: [], //优惠信息-会员卡
			personalDots: 0, //我的权益轮播小圆点index
		};
	},
	onShow() {
		// 清空选择的优惠券
		getApp().globalData.selectCouponProductItem = {};
		if (!this.isFiststShow) { //验证权限获取用户信息/通过扫码进入 会异步请求 导致无法及时拿门店id 请求数据有误
			this.getPersonalInterests(this.shopId);
			this.getSpikeActivityList(this.shopId);
		}
	},
	// 页面加载事件
	async onLoad(option) {
		
		console.log(option)
		await getApp().globalData.verifyAu(); // 验证权限获取用户信息
		if (!option.scene) {
			this.shopId = option.id;
		} else {
			// 二维码 进入
			let data = {
				id: option.scene //GK08
			};
			let res = await GK08.GetViewDto(data);
			if(res){
				this.shopId = res.storeID; //取门店id
			}
		}
		this.basUrl = getApp().globalData.PicDomain; //获取图片服务器基础路由
		this.getStoreDetails(this.shopId);
		this.getPersonalInterests(this.shopId);
		this.getSpikeActivityList(this.shopId);
		this.isFiststShow = false;
		// 加入最后页面缓存
		getApp().globalData.lastInUrlObj.saveLastInUrl();
		getApp().globalData.AddNGKUser(this.shopId);
	},
	// 通用分享
	onShareAppMessage() {
		return getApp().globalData.shareObj.getNormalShare();
	},
	methods: {
		//跳转营销页
		redirectoutUrl(marketSetID, marketSetName, paramValue) {
			console.log(marketSetID);
			if (marketSetID != null && marketSetID != '' && marketSetID) {
				uni.redirectTo({
					url: `/pages/outUrl/outUrl?marketSetID=${marketSetID}&marketSetName=${marketSetName}&paramValue=${paramValue}`
				});
			} else {
				console.log("此banner没设置营销页");
			}
		},
		// // 点击顶部轮播小圆点
		// changeSwiper(e, idx) {
		// 	if (idx) {
		// 		this.swiperCurrent = idx;
		// 	} else {
		// 		this.swiperCurrent = e.detail.current;
		// 	}
		// },
		callPhone(phone) { //拨打电话
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},
		btnMap() {
			//绑定数据
			let tempObj = this.shopInfo;

			if (tempObj.latitude == '0' || tempObj.longtitude == '0') {
				uni.showToast({
					title: '该门店暂无定位',
					icon: 'none'
				});
				return;
			}

			uni.openLocation({
				latitude: tempObj.latitude,
				longitude: tempObj.longtitude,
				scale: 14,
				name: tempObj.shopName,
				address: tempObj.address
			});
		},
		// ================================我的权益轮播=================================
		// 初始化towerSwiper
		towerSwiper(name) {
			let list = this[name];
			for (let i = 0; i < list.length; i++) {
				list[i].zIndex = i;
			}
			this.myCardList = list;
		},
		// towerSwiper触摸开始
		towerStartFun(e) {
			this.towerStart = e.touches[0].pageX;
		},

		// towerSwiper计算方向
		towerMoveFun(e) {
			let n=e.touches[0].pageX - this.towerStart;
			if(n>=40){
				this.direction = 'right'
			}else if(n<=-40){
				this.direction = 'left'
			}else{
				this.direction=''
			}
		},

		// towerSwiper计算滚动
		towerEndFun(e) {
			let direction = this.direction;
			let list = this.myCardList;
			if (direction == 'right') {
				this.personalDots = this.personalDots <= 0 ? list.length - 1 : this.personalDots - 1;
				let zIndex = list[0].zIndex;
				for (let i = 1; i < this.myCardList.length; i++) {
					this.myCardList[i - 1].zIndex = this.myCardList[i].zIndex;
				}
				this.myCardList[list.length - 1].zIndex = zIndex;
			} else if (direction == 'left')  {
				this.personalDots = this.personalDots < list.length - 1 ? this.personalDots + 1 : 0;
				let zIndex = list[list.length - 1].zIndex;
				for (let i = this.myCardList.length - 1; i > 0; i--) {
					this.myCardList[i].zIndex = this.myCardList[i - 1].zIndex;
				}
				this.myCardList[0].zIndex = zIndex;
			}
			this.direction = "";
			this.myCardList = this.myCardList;
		},
		changeScState() { //点击收藏
			this.shopInfo.isCollection ? this.isCancelCollect() : this.isCollect();
			this.shopInfo.isCollection = !this.shopInfo.isCollection;
		},
		//收藏
		async isCollect() {
			let data = {
				openId: getApp().globalData.userInfo.openId,
				collectionType: 'shop',
				colId: this.shopId,
				createTime: this.$util.formatTime()
			};
			let res = await GK04.CreateByDto(data);
			if (res) {
				this.shopInfo.colId = res.id
				uni.showToast({
					title: '收藏成功',
					icon: 'success',
					duration: 1000
				});
			}
		},
		//取消收藏
		async isCancelCollect() {
			let data = {
				id: this.shopInfo.colId
			}
			let res = await GK04.Delete(data)
			if (res) {
				uni.showToast({
					title: '取消收藏成功',
					icon: 'success',
					duration: 1000
				});
			}
		},
		//获得门店初始数据
		async getStoreDetails(id) {
			let data = {
				shopId: id,
				userId: getApp().globalData.LoginUserId
			};
			let result = await GZH09.DetailAsync(data);
			if (result) {
				this.shopInfo = this.$util.null2str(result);
				uni.setNavigationBarTitle({
					title: this.shopInfo.storeName
				});
			}

		},
		// 获取个人权益列表
		async getPersonalInterests(id) {
			let data = {
				storeId: id,
				openId: getApp().globalData.userInfo.spOpenId
			};
			let result = await MSActiveConfig.GetPersonalInterests(data, null, null, this.isFiststShow);
			if (result && (result.hyCardPersonalInterests.length != 0 || result.smallProgPersonalInterests.length != 0)) {
				let myCardArr = [];
				this.myCardList = myCardArr.concat(result.hyCardPersonalInterests, result.smallProgPersonalInterests);
				this.towerSwiper('myCardList'); //初始化个人权益轮播
			}
			this.marketerPersonalInterest = result.marketerPersonalInterest ? result.marketerPersonalInterest : {};
		},
		// 获取优惠活动列表
		async getSpikeActivityList(id) {
			let data = {
				storeId: id,
				openId: getApp().globalData.userInfo.spOpenId
			};
			let result = await MSActiveConfig.GetSpikeActivityList(data, null, null, this.isFiststShow);
			if (result) {
				let discountArr = [];
				this.discountInfoList = discountArr.concat(result.spikeActivityItems, result.smallProgramCardItems,
					result.hyCardItems); //拼接数组
				this.shopInfo.storeCount = result.storeCount; //企业多少家门店
			}

		},
	},
	filters: {
		formatCardCode(val) {
			switch (val) {
				case 2:
					return '已售罄'
					break;
				case 3:
					return '距开抢'
					break;
				case 4:
					return '距结束'
					break;
				case 5:
					return '已结束'
					break;
				default:
					return '未上线'
					break;
			}
		},
	},
	watch: {
		// "shopInfo.isCollect": {
		// 	handler: function(val, oldval) {
		// 		if (val) {
		// 			this.isCollect();
		// 		} else {
		// 			this.isCancelCollect();
		// 		}
		// 	}
		// }
	}
};
