import GZH09AppService from '@/service/GZH/GZH09AppService.js';
import GK04AppService from '@/service/GK/GK04AppService.js';
import GK06AppService from '@/service/GK/GK06AppService.js';
import GK08AppService from '@/service/GK/GK08AppService.js';
import GK09AppService from '@/service/GK/GK09AppService.js';
import GK07AppService from '@/service/GK/GK07AppService.js';
import GK18AppService from '@/service/GK/GK18AppService.js';
import HY02AppService from '@/service/HY/HY02AppService.js';

export default {
	data() {
		return {
			navTitle: '',
			urlOption: {},
			weburl: getApp().globalData.PicDomain,
			goHomePic: 'https://pic.cwyyt.cn/upload/img/20191106/1619351935_goHome.png',
			fastBookingPic: 'https://pic.cwyyt.cn/upload/img/20191106/1617391739_fastBooking.png',
			locationPic: getApp().globalData.PicDomain + '/upload/yytBanner/location1.png',
			telPhonePic: getApp().globalData.PicDomain + '/upload/yytBanner/callPhone.png',
			isScroll: false,
			currentTab: 0,
			scrollTop: 0,
			autoHeight: 300,
			//随便给的一个初始高度
			isChecked: 0,
			//选中用户评价的项目
			shopId: '',
			//门店id
			userInfo: {},
			//用户信息
			shopInfo: {},
			//门店详情
			shopBusinessInfo: {},
			// 门店营业信息
			shopIntroduceUrl: '',
			// 宴会厅介绍详情（HTML路径）
			shopCustomUrl: '',
			//门店自定义标题路径（HTML路径）
			markers: [{
				iconPath: 'https://pic.cwyyt.cn/upload/img/20191106/1622142214_location.png',
				id: 0,
				latitude: '',
				longitude: '',
				width: 50,
				height: 50
			}],
			commentList: [],
			//评论列表
			commentListToAll: [],
			//全部评论
			commentListToGood: [],
			//好评
			commentListToBad: [],
			//差评
			commentListToHaveImg: [],
			//有图片
			pageindex: 1,
			//分页
			pageindexToAll: 1,
			//分页
			pageindexToGood: 1,
			//分页
			pageindexToBad: 1,
			//分页
			pageindexToHaveImg: 1,
			//分页
			rowCountToAll: 0,
			rowCountToGood: 0,
			rowCountToBad: 0,
			rowCountToHaveImg: 0,
			latitude: '',
			//获取小程序所在经纬度
			longitude: '',
			goodCount: 0,
			//好评数量
			badCount: 0,
			//差评数量
			haveImgCount: 0,
			//有图片数量
			needStatus: 0,
			//获取评价类型
			isCollect: false,
			//默认不收藏店铺
			isClick: false,
			//默认不点击商家信息
			isClick1: false,
			//默认不回到首页
			colIds: [],
			//收藏id(可能误操作，一个门店有多次收藏记录)
			tabArr: {
				currentTab: 1,
				currentContent: 1
			},
			couponBg: getApp().globalData.PicDomain + '/upload/yytBanner/coupon_bg.png',
			hasMore: true,
			//用户评价分页
			cardInfos: [],
			shareId: '',
			//分享id
			saleId: '',
			// 客服经理id
			shopBusinessDtail: {},
			shopLocationInfo: {},
			title: '',
			//门店标题
			unclaimed: [],
			srollHeight: ''
		};
	},
	props: {},
	async onLoad(option) {
		await getApp().globalData.verifyAu();

		// options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
		//1.门店详情分享    --->进入该门店
		//2.通过客服经理对应的门店分享   --->   进入该门店，点击去预订的时候默认带上该客服经理的id
		this.urlOption = option;
		let scene = decodeURIComponent(option.scene);
		if (scene != 'undefined' && scene) { //二维码分享进入
			//没有传值解码的时候  --->   "undefined"
			this.shareId = scene; //假设scene参数中只传一个参数
			this.GetShareQRCode(this.actionToIsShare);
		} else if (option.id != 'undefined' && option.id) {
			this.shopId = option.id; //不是分享进入
			this.actionToIsShare();
		}
	},
	async onShow() {
		this.isClick1 = false;
		this.isClick = false;

		let [error, res] = await uni.getSystemInfo();
		if (res) {
			let height = res.windowHeight;
			this.srollHeight = height + 'px'
		}
	},
	onReachBottom() {
		console.log('评价触底事件分页Bo' + this.isChecked);
		let commentList = this.commentList; //显示的评论

		let commentListToAll = this.commentListToAll; //全部评论

		let commentListToGood = this.commentListToGood; //好评

		let commentListToBad = this.commentListToBad; //差评

		let commentListToHaveImg = this.commentListToHaveImg; //有图片

		let pageindexToAll = this.pageindexToAll; //全部评论分页

		let pageindexToGood = this.pageindexToGood; //好评分页

		let pageindexToBad = this.pageindexToBad; //差评分页

		let pageindexToHaveImg = this.pageindexToHaveImg; //有图片分页

		let rowCountToAll = this.rowCountToAll; //全部评论总数

		let rowCountToGood = this.rowCountToGood; //好评总数

		let rowCountToBad = this.rowCountToBad; //差评总数

		let rowCountToHaveImg = this.rowCountToHaveImg; //有图片总数

		let pageindex = this.pageindex;
		let needStatus = this.needStatus;
		let index = this.isChecked; //当前选中的评价类别

		switch (index) {
			//全部
			case '0':
				if (commentListToAll.length >= this.rowCountToAll) {
					this.hasMore = false;
					return;
				}
				uni.showLoading({
					title: '正在加载...'
				});

				this.needStatus = '0';
				this.pageindexToAll = pageindexToAll + 1;
				this.pageindex = pageindexToAll + 1;
				this.getStoreComment(obj => {
					if (obj.length == 0) {
						this.pageindexToAll = pageindexToAll - 1;
					} else {
						for (let i in obj) {
							commentListToAll.push(obj[i]);
						}
						this.commentListToAll = commentListToAll;
						this.commentList = commentListToAll;
					}

					setTimeout(() => {
						uni.hideLoading();
					}, 2000);
				});
				break;
				//好评

			case '1':
				if (commentListToGood.length >= this.rowCountToGood) {
					this.hasMore = false;
					return;
				}

				uni.showLoading({
					title: '正在加载...'
				});
				this.needStatus = '1';
				this.pageindexToGood = pageindexToGood + 1;
				this.pageindex = pageindexToGood + 1;
				this.getStoreComment(obj => {
					if (obj.length == 0) {
						this.pageindexToGood = pageindexToGood - 1;
					} else {
						for (let i in obj) {
							commentListToGood.push(obj[i]);
						}

						this.commentListToGood = commentListToGood;
						this.commentList = commentListToGood;
					}

					setTimeout(() => {
						uni.hideLoading();
					}, 2000);
				});
				break;
				//差评

			case '2':
				if (commentListToBad.length >= this.rowCountToBad) {
					this.hasMore = false;
					return;
				}

				uni.showLoading({
					title: '正在加载...'
				});
				this.needStatus = '2';
				this.pageindexToBad = pageindexToBad + 1;
				this.pageindex = pageindexToBad + 1;
				this.getStoreComment(obj => {
					if (obj.length == 0) {
						this.pageindexToBad = pageindexToBad - 1;
					} else {
						for (let i in obj) {
							commentListToBad.push(obj[i]);
						}
						this.commentListToBad = commentListToBad;
						this.commentList = commentListToBad;
					}

					setTimeout(() => {
						uni.hideLoading();
					}, 2000);
				});
				break;
				//图片

			case '3':
				if (commentListToHaveImg.length >= this.rowCountToHaveImg) {
					this.hasMore = false;
					return;
				}

				uni.showLoading({
					title: '正在加载...'
				});
				this.needStatus = '3';
				this.pageindexToHaveImg = pageindexToHaveImg + 1;
				this.pageindex = pageindexToHaveImg + 1;
				this.getStoreComment(obj => {
					if (obj.length == 0) {
						this.pageindexToHaveImg = pageindexToHaveImg - 1;
					} else {
						for (let i in obj) {
							commentListToHaveImg.push(obj[i]);
						}

						this.commentListToHaveImg = commentListToHaveImg;
						this.commentList = commentListToHaveImg;
					}

					setTimeout(() => {
						uni.hideLoading();
					}, 2000);
				});
				break;
		}
	},

	// 分享
	onShareAppMessage(option) {
		return {
			title: this.navTitle,
			path: `/pages/indexSub/shopInfo/shopInfo?id=${this.shopId}&shareOpenid=${getApp().globalData.userInfo.spOpenId}`
		};
	},

	methods: {
		updateShareInfo(title) {
			getApp().globalData.getShareInfo({
				query: this.urlOption,
				curOpenid: getApp().globalData.userInfo.spOpenId,
				path: `/pages/indexSub/shopInfo/shopInfo`,
				title: '门店详情',
				description: `门店详情-${title}`
			});
		},

		//判断是否是分享进入之后的操作
		async actionToIsShare() {
			let [error, res] = await uni.getSystemInfo(); //获取系统高度
			if (res) {
				let height = res.windowHeight;
				this.srollHeight = height + 'px'
			}
			//获取用户信息
			this.userInfo = getApp().globalData.userInfo;
			if (Object.keys(getApp().globalData.userInfo).length == 0) {
				this.userInfo = getApp().globalData.userInfo;
				if (getApp().globalData.addr) {
					this.latitude = getApp().globalData.addr.latitude;
					//获取小程序所在经纬度
					this.longitude = getApp().globalData.addr.longitude;
				}

				if (this.userInfo) {
					//获取门店收藏
					this.getCollectData(); //获得门店初始数据

					this.getStoreDetails(this.shopId); //获得门店评论初始数据

					this.getStoreComment(obj => {
						//默认显示全部评价
						this.commentListToAll = obj;
						this.commentList = obj;
					});
				}
			} else {
				if (getApp().globalData.addr) {
					this.latitude = getApp().globalData.addr.latitude;
					//获取小程序所在经纬度
					this.longitude = getApp().globalData.addr.longitude;
				}

				if (this.userInfo) {
					//获取门店收藏
					this.getCollectData(); //获得门店初始数据

					this.getStoreDetails(this.shopId); //获得门店评论初始数据

					this.getStoreComment(obj => {
						//默认显示全部评价
						this.commentListToAll = obj;
						this.commentList = obj;
					});
				}
			}

			// this.getCard();
			// this.getMemberCard();
		},
		//获得门店初始数据
		async getStoreDetails(id) {
			let data = {
				shopId: id,
				userId: getApp().globalData.LoginUserId
			};
			let rdata = await GZH09AppService.DetailAsync(data);
			uni.setStorageSync('storeName', rdata.branchName);
			let returnData = rdata;
			let title = returnData.businessName + '(' + returnData.branchName + ')'; // 获取门店标题成功后再更新访问日志

			this.updateShareInfo(title);
			this.navTitle = title;
			uni.setNavigationBarTitle({
				title: title
			});
			let shopInfo = this.shopInfo;
			let shopBusiness = this.shopBusiness;
			let photoList = returnData.photoList;
			let photoList1 = [];

			for (let i in photoList) {
				let img = getApp().globalData.PicDomain + photoList[i].imgUrl;
				photoList1.push(img);
			}
			let shopBusinessDtail = {
				openTime: returnData.openTime,
				isShowHall: returnData.isShowHall,
				special: returnData.special ? returnData.special.split(/,|，|、/) : '',
				serviceFacility: returnData.serviceFacility ? returnData.serviceFacility.split(/,|，|、/) : '',
				address: returnData.address,
				introducition: returnData.introducition,
				busGuideUrl: returnData.busGuideUrl,
				addressDtail: returnData.province + returnData.city + returnData.district,
				banquetParame: returnData.banquetParame,
				storeParame: returnData.storeParame
			};
			let shopLocationInfo = {
				address: returnData.address,
				addressDtail: returnData.province + returnData.city + returnData.district,
				introducition: returnData.introducition
			};
			let hotel = {
				photoList: photoList1,
				storeLogo: returnData.storeLogo,
				storeName: returnData.storeName,
				score: returnData.score ? this.$util.toDecimal(returnData.score, 0) : 5,
				avgPrice: returnData.avgPrice ? this.$util.toDecimal(returnData.avgPrice, 2) + '/人' : '',
				category: returnData.category ? returnData.category : '',
				address: returnData.address ? returnData.address : '',
				latitude: returnData.latitude ? returnData.latitude : '',
				isSucceed: returnData.isSucceed ? returnData.isSucceed : '',
				longtitude: returnData.longtitude ? returnData.longtitude : '',
				point: this.$util.distance(this.latitude, this.longitude, returnData.latitude, returnData.longtitude) ? '距您' +
					this.$util.toDecimal(
						this.$util.distance(this.latitude, this.longitude, returnData.latitude, returnData.longtitude), 2) + 'km' : '',
				telephone: returnData.telephone ? returnData.telephone : '',
				openTime: returnData.openTime ? '营业时间 : ' + returnData.openTime : '',
				special: returnData.special ? '特色服务 : ' + returnData.special : ''
			};
			let markers = this.markers;
			markers[0].latitude = hotel.latitude;
			markers[0].longitude = hotel.longtitude;
			this.title = title;
			this.shopInfo = hotel;
			this.markers = markers;
			this.shopBusinessDtail = shopBusinessDtail;
			this.shopIntroduceUrl = returnData.showHallDetails;
			this.shopCustomUrl = returnData.storeSelfShowDetails;
			this.shopLocationInfo = shopLocationInfo;
		},
		//获得门店评论初始数据
		async getStoreComment(success) {
			//根据门店id获取门店评论列表
			let data = {
				pageindex: this.pageindex,
				// pagesize: "10",
				userID: this.userInfo.id,
				needStatus: this.needStatus,
				shopId: this.shopId
			};
			let rdata = await GZH09AppService.CommentAsync(data);
			let returnData = rdata.dataList;
			let returnCount = rdata.rowCount;
			let comments = [];

			for (let i = 0; i < returnData.length; i++) {
				let scoreList = [];

				for (let j = 1; j <= 5; j++) {
					if (j <= returnData[i].score) {
						scoreList.push('1');
					} else {
						scoreList.push('0');
					}
				};
				comments.push({
					nickName: returnData[i].nickName,
					reply: returnData[i].reply,
					headImg: returnData[i].headImg,
					time: returnData[i].time.substring(0, 10),
					score: scoreList,
					description: returnData[i].description ? returnData[i].description : '',
					photos: returnData[i].photos
				});
			} //获取评价list总数
			switch (this.needStatus) {
				case '0':
					this.rowCountToAll = returnCount;
				case '1':
					break;

				case '2':
					this.rowCountToBad = returnCount;
					break;

				case '3':
					this.rowCountToHaveImg = returnCount;
					break;
			} //获取全部评价时候把好评差评数量记录


			if (this.needStatus == '0') {
				this.goodCount = returnData.length > 0 ? returnData[0].goodCount : 0;
				this.badCount = returnData.length > 0 ? returnData[0].badCount : 0;
				this.haveImgCount = returnData.length > 0 ? returnData[0].haveImgCount : 0;
			}

			if (success) {
				success(comments);
			}
		},
		//获得门店收藏数据
		async getCollectData(success) {
			//根据门店id获取门店评论列表
			let data = {
				pageIndex: 1,
				pageSize: 10,
				order: 'CreateTime desc',
				filter: {
					Type: 'and',
					Conditions: [{
						Attribute: 'OpenId',
						Datatype: 'nvarchar',
						Operatoer: 'eq',
						Value: this.userInfo.openId
					}, {
						Attribute: 'CollectionType',
						Datatype: 'nvarchar',
						Operatoer: 'eq',
						Value: 'shop'
					}, {
						Attribute: 'ColId',
						Datatype: 'nvarchar',
						Operatoer: 'eq',
						Value: this.shopId
					}]
				}
			};
			let rdata = await GK04AppService.GetViewPage(data);
			let returnData = rdata.dataList;
			let colIds = [];
			returnData.forEach(item => {
				colIds.push(item.xcxCollectionID)
			})
			if (colIds.length > 0) {
				this.isCollect = true;
				this.colIds = colIds;
			}
		},
		callPhone() { //拨打电话
			let phone = this.shopInfo.telephone;
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},
		// goMemberCenter() { //跳转到会员卡详情页
		// 	uni.navigateTo({
		// 		url: `/pages/personalSub/memberCenter/memberCenter?id=${this.unclaimed.hyCardID}&shopId=${this.shopId}`
		// 	});
		// },
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
		// // 回首页
		// goHome(e) {
		// 	uni.switchTab({
		// 		url: '/pages/index/index'
		// 	});
		// },
		//立即预订
		nowBook(e) {
			uni.navigateTo({
				url: `/pages/indexSub/goBooking/goBooking?id=${this.shopId}&salesID=${this.saleId}`
			});
		},
		//点击切换
		clickTab(e) {
			let dataId = e.currentTarget.dataset.current;
			let obj = {};
			obj.currentTab = dataId;
			obj.currentContent = dataId;
			this.tabArr = obj
		},
		//点击切换用户评价项目
		selectItem(e) {
			let index = e.currentTarget.dataset.index;
			this.isChecked = index;
			this.needStatus = index;
			let commentList = this.commentList; //显示的评论

			let commentListToAll = this.commentListToAll; //全部评论

			let commentListToGood = this.commentListToGood; //好评

			let commentListToBad = this.commentListToBad; //差评

			let commentListToHaveImg = this.commentListToHaveImg; //有图片
			this.pageindex = 1;
			this.needStatus = index;

			switch (index) {
				//全部
				case '0':
					this.getStoreComment(obj => {
						this.commentListToAll = obj;
						this.commentList = obj;
					});
					break;
					//好评

				case '1':
					this.getStoreComment((obj) => {
						this.commentListToGood = obj;
						this.commentList = obj;
					});
					break;
					//差评

				case '2':
					this.getStoreComment((obj) => {
						this.commentListToBad = obj;
						this.commentList = obj;
					});
					break;
					//图片

				case '3':
					this.getStoreComment(obj => {
						this.commentListToHaveImg = obj;
						this.commentList = obj;
					});
					break;
			}
		},
		//评价触底事件分页
		scrollLoading() {
			let commentList = this.commentList; //显示的评论

			let commentListToAll = this.commentListToAll; //全部评论

			let commentListToGood = this.commentListToGood; //好评

			let commentListToBad = this.commentListToBad; //差评

			let commentListToHaveImg = this.commentListToHaveImg; //有图片

			let pageindexToAll = this.pageindexToAll; //全部评论分页

			let pageindexToGood = this.pageindexToGood; //好评分页

			let pageindexToBad = this.pageindexToBad; //差评分页

			let pageindexToHaveImg = this.pageindexToHaveImg; //有图片分页

			let rowCountToAll = this.rowCountToAll; //全部评论总数

			let rowCountToGood = this.rowCountToGood; //好评总数

			let rowCountToBad = this.rowCountToBad; //差评总数

			let rowCountToHaveImg = this.rowCountToHaveImg; //有图片总数

			let pageindex = this.pageindex;
			let needStatus = this.needStatus;
			let index = this.isChecked; //当前选中的评价类别

			switch (index) {
				//全部
				case '0':
					if (commentListToAll.length >= this.rowCountToAll) {
						this.hasMore = false;
						return;
					}

					uni.showLoading({
						title: '正在加载...'
					});
					this.pageindexToAll = pageindexToAll + 1;
					this.pageindex = pageindexToAll + 1;

					this.getStoreComment(obj => {
						if (obj.length == 0) {
							this.pageindexToAll = pageindexToAll - 1;
						} else {
							for (let i in obj) {
								commentListToAll.push(obj[i]);
							}

							this.commentListToAll = commentListToAll;
							this.commentList = commentListToAll;
						}

						setTimeout(() => {
							uni.hideLoading();
						}, 2000);
					});
					break;
					//好评

				case '1':
					if (commentListToGood.length >= this.rowCountToGood) {
						this.hasMore = false;
						return;
					}

					uni.showLoading({
						title: '正在加载...'
					});
					this.pageindexToGood = pageindexToGood + 1;
					this.pageindex = pageindexToGood + 1;
					this.getStoreComment(obj => {
						if (obj.length == 0) {
							this.pageindexToGood = pageindexToGood - 1;
						} else {
							for (let i in obj) {
								commentListToGood.push(obj[i]);
							}

							this.commentListToGood = commentListToGood;
							this.commentList = commentListToGood;
						}

						setTimeout(() => {
							uni.hideLoading();
						}, 2000);
					});
					break;
					//差评

				case '2':
					if (commentListToBad.length >= this.rowCountToBad) {
						this.hasMore = false;
						return;
					}

					uni.showLoading({
						title: '正在加载...'
					});
					this.pageindexToBad = pageindexToBad + 1;
					this.pageindex = pageindexToBad + 1;
					this.getStoreComment(obj => {
						if (obj.length == 0) {
							this.pageindexToBad = pageindexToBad - 1;
						} else {
							for (let i in obj) {
								commentListToBad.push(obj[i]);
							}

							this.commentListToBad = commentListToBad;
							this.commentList = commentListToBad;
						}

						setTimeout(() => {
							uni.hideLoading();
						}, 2000);
					});
					break;
					//图片
				case '3':
					if (commentListToHaveImg.length >= this.rowCountToHaveImg) {
						this.hasMore = false;
						return;
					}
					uni.showLoading({
						title: '正在加载...'
					});
					this.pageindexToHaveImg = pageindexToHaveImg + 1;
					this.pageindex = pageindexToHaveImg + 1;
					this.getStoreComment(obj => {
						if (obj.length == 0) {
							this.pageindexToHaveImg = pageindexToHaveImg - 1;
						} else {
							for (let i in obj) {
								commentListToHaveImg.push(obj[i]);
							}
							this.commentListToHaveImg = commentListToHaveImg;
							this.commentList = commentListToHaveImg;
						}
						setTimeout(() => {
							uni.hideLoading();
						}, 2000);
					});
					break;
			}
		},
		//点击收藏店铺
		async collectShop(e) {
			let isCollect = this.isCollect; //如果已经收藏则取消收藏

			if (isCollect) {
				//取消收藏
				let rdata = await GK04AppService.BatchDelete(this.colIds);
				setTimeout(() => {
					uni.showToast({
						title: '取消收藏成功',
						icon: 'success',
						duration: 1000,
						success: () => {}
					});
				}, 200);
			} else {
				//收藏该门店
				let data = {
					openId: this.userInfo.openId,
					collectionType: 'shop',
					colId: this.shopId,
					createTime: this.$util.formatTime()
				};
				let rdata = await GK04AppService.CreateByDto(data);
				uni.showToast({
					title: '收藏成功'
				});
			}
			this.isCollect = !isCollect
		},
	
		// 预览图片
		previewImage(e) {
			let index = e.target.dataset.index;
			let num = e.target.dataset.num;
			let files = this.commentList;
			let tempFilePathList = [];
			tempFilePathList = files[num].photos;
			uni.previewImage({
				current: e.currentTarget.dataset.url,
				// 当前显示图片的http链接
				urls: tempFilePathList // 需要预览的图片http链接列表

			});
		},
		// 去商户信息的营业信息
		goShopBusiness() {
			uni.navigateTo({
				shopBusinessInfo: {},
				// 门店营业信息
				url: '/pages/indexSub/shopServiceInfo/shopServiceInfo?shopItem=' + JSON.stringify(this.shopBusinessDtail) +
					'&shopId=' + this.shopId
			});
		},
		
		//通过分享进来的操作
		async GetShareQRCode(successCallBack) {
			//得到对应的二维码分享数据（通过分享传入的id）
			let data = {
				primaryKey: this.shareId
			};
			let rdata = await GK08AppService.GetDto(data);
			this.shopId = rdata.storeID;
			this.saleId = rdata.marketerID;
			//创建二维码访问数据
			if (rdata) {
				data = {
					cardGenID: this.shareId,
					xcxUserID: getApp().globalData.LoginUserId
				};
				let res = await GK09AppService.CreateByDto(data);
				if (successCallBack) {
					successCallBack();
				};
			}
		}
	}
};
