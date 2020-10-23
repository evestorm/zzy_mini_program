// import uniRate from '@/components/uni-rate/uni-rate.vue'
import CY20 from '@/service/CY/CY20AppService.js';
import GK04 from '@/service/GK/GK04AppService.js';

export default {
	data() {
		return {
			locationPic: getApp().globalData.PicDomain + '/upload/yytBanner/location1.png',
			telPhonePic: getApp().globalData.PicDomain + '/upload/yytBanner/callPhone.png',
			noPic: getApp().globalData.PicDomain + '/upload/yytBanner/noPic1.png',
			// 展开折叠
			selectedFlag: [false],
			customerOrderId: '',
			//用户自行预订订单id //CY28001  or  CY20001
			orderId: '',
			//订单id(CY20)
			orderDetail: {
				customerOrder: {
					fee: 0 //付款金额
				},
				description: {
					time: ''
				}
			},
			//订单详情
			latitude: '',
			//获取小程序所在经纬度
			longitude: '',
			userInfo: {},
			//登录用户
			showInfo: [],
			//显示的预订简洁信息
			isShowPrefood: false,
			//是否显示点菜单
			isCanOrderDishes: false,
			//该门店是否可以点菜
			isCanOrderDishesPay: false,
			//该门店是否可以点菜
			payIsPaidMoney: '',
			//还需要支付的金额
			isPayMaterialMoney: true,
			//是否显示支付（点菜金额小于定金不让支付）
			isLoad: true,
			//第一次不执行onshow方法
			isCollect: false,
			//默认不收藏店铺
			colIds: [], //收藏id(可能误操作，一个门店有多次收藏记录)
			shopInfo: {}, //门店详情
			customerBookStatus: 1, //订单状态：（1客户申请2审核确认3客户取消4销售取消
			tipText: '', //状态提示文字
			isAPPOrder: false, //是否是APP下单
			tableTists: '', //预定桌台
		};
	},

	components: {},
	props: {},
	onLoad(option) {
		//获取用户信息
		this.userInfo = getApp().globalData.userInfo;
		this.customerOrderId = option.orderId; //CY28001  or  CY20001	
		if (getApp().globalData.addr) {
			this.latitude = getApp().globalData.addr.latitude;
			//获取小程序所在经纬度
			this.longitude = getApp().globalData.addr.longitude;
		}
		if (this.userInfo) {
			//获得订单初始数据
			this.getStoreDetails(option.orderId);
		}

		if (getApp().globalData.addr) {
			this.latitude = getApp().globalData.addr.latitude;
			//获取小程序所在经纬度
			this.longitude = getApp().globalData.addr.longitude
		}

		if (this.userInfo) {
			//获得订单初始数据
			this.getStoreDetails(option.orderId);
		}
	},
	onShow() {
		//回到页面时重新获得订单初始数据（点菜操作会改变订单状态）
		if (!this.isLoad) {
			this.getStoreDetails(this.customerOrderId);
		}
		this.isLoad = false;
	},
	methods: {
		//获得订单详情
		async getStoreDetails(id) {
			let data = {
				orderId: id
			};
			let rdata = await CY20.GetOrderDetail(data);
			if (rdata) {
				rdata = this.$util.null2str(rdata);
				let returnData = rdata;
				let orderDetail = this.orderDetail;
				let photoList = returnData.store.photoList;
				let photoList1 = [];
				this.isAPPOrder = returnData.customerOrder == "" ? true : false; //是否是APP下单
				this.customerBookStatus = returnData.customerOrder.customerBookStatus ? returnData.customerOrder.customerBookStatus :
					returnData.order.status;
				if (this.customerBookStatus == 2) {
					let fee = returnData.order.fee == '' ? 0 : fee = returnData.order.fee;
					this.tipText = fee == 0 ? '您的订单已被商家确认' : '您的订单已消费完成'
				} else if (this.customerBookStatus == 3) {
					this.tipText = '您的订单已取消'
				} else if (this.customerBookStatus == 4) {
					this.tipText = '您的订单已被商家取消'
				} else {
					this.tipText = '您的订单已被商家取消'
				}
				for (let i in photoList) {
					let img = getApp().globalData.PicDomain + photoList[i];
					photoList1.push(img);
				} //订单对应的门店

				let store = {
					photoList: photoList1,
					storeID: returnData.store.storeID,
					storeLogo: returnData.store.storeLogo,
					storeName: returnData.store.storeName,
					score: returnData.store.score ?
						this.$util.toDecimal(returnData.store.score, 0) : 5,
					isCanOrderDishes: returnData.store.isCanOrderDishes ?
						returnData.store.isCanOrderDishes : '',
					isCanOrderDishesPay: returnData.store.isCanOrderDishesPay ?
						returnData.store.isCanOrderDishesPay : '',
					avgPrice: returnData.store.avgPrice ?
						'￥' + this.$util.toDecimal(returnData.store.avgPrice, 2) + '/人' : '',
					category: returnData.store.category ?
						returnData.store.category : '',
					address: returnData.store.address ? returnData.store.address : '',
					latitude: returnData.store.latitude ?
						returnData.store.latitude : '',
					longtitude: returnData.store.longtitude ?
						returnData.store.longtitude : '',
					point: this.$util.distance(
							this.latitude,
							this.longitude,
							returnData.store.latitude,
							returnData.store.longtitude
						) ?
						'距您' +
						this.$util.toDecimal(
							this.$util.distance(
								this.latitude,
								this.longitude,
								returnData.store.latitude,
								returnData.store.longtitude
							),
							2
						) +
						'km' : '',
					telephone: returnData.store.telephone ?
						returnData.store.telephone : '',
					openTime: returnData.store.openTime ?
						'营业时间 : ' + returnData.store.openTime : '',
					special: returnData.store.special ?
						'特色服务 : ' + returnData.store.special : ''
				};
				let saler = {};

				if (returnData.saler) {
					//订单对应的销售
					saler = {
						marketerID: returnData.saler.marketerID,
						name: returnData.saler.name,
						imgUrl: returnData.saler.imgUrl,
						phone: returnData.saler.phone,
						desc: returnData.saler.desc,
						id: returnData.saler.id
					};
				}

				let description = {};

				if (returnData.description) {
					//订单对应的销售
					description = {
						description: returnData.description.description,
						headImg: returnData.description.headImg,
						images: returnData.description.images,
						photos: returnData.description.photos,
						nickName: returnData.description.nickName,
						score: returnData.description.score,
						reply: returnData.description.reply,
						time: returnData.description.time.substring(0, 10)
					};
				} //订单对应的菜品

				let foodList = [];
				if (
					returnData.goodsList.foodList != null &&
					returnData.goodsList.foodList.length > 0
				) {
					for (let i = 0; i < returnData.goodsList.foodList.length; i++) {
						foodList.push({
							materialId: returnData.goodsList.foodList[i].materialId,
							materialName: returnData.goodsList.foodList[i].materialName,
							materialUnit: returnData.goodsList.foodList[i].materialUnit,
							materialPrice: returnData.goodsList.foodList[i].materialPrice,
							memberPrice: returnData.goodsList.foodList[i].memberPrice,
							imgUrl: returnData.goodsList.foodList[i].imgUrl,
							quantity: parseInt(returnData.goodsList.foodList[i].quantity),
							foodDetailList: returnData.goodsList.foodList[i].foodDetailList,
							id: returnData.goodsList.foodList[i].id
						});
					}
				}

				let goodsList = {
					totalMoney: returnData.goodsList.totalMoney,
					discountMoney: returnData.goodsList.discountMoney,
					isPay: returnData.goodsList.isPay,
					foodList: foodList // "foodList": returnData.goodsList.foodList,
				};
				let customerOrder = {};
				let arr = [];
				for (let n = 0; n < returnData.tablelists.length; n++) {
					arr.push(returnData.tablelists[n].tableTableName)
				}
				this.tableTists = arr.join(', '); //预定桌台
				if (!returnData.customerOrder) {
					//通过CY20001得到的预定订单（商户订单查询过来的（没有CY28数据））
					customerOrder = {
						customerBookID: returnData.order.customerBookID,
						//CY28001 
						customerName: returnData.order.customerName,
						customerBookPhone: returnData.order.customerPhone,
						bookDate: returnData.order.bookOrderCreateOn.substring(0, 10),
						diningTypeName: returnData.order.diningTypeName,
						willArrivedOn: returnData.order.willArrivedOn,
						bookOrderTypeName: returnData.order.bookOrderTypeName,
						// masterTableName: returnData.tablelists, //预定桌台
						customerBookCompany: returnData.order.customerCompany,
						remark: '',
						// "remark": returnData.order.remark.split(','),
						customerBookBookNums: returnData.order.bookNums,
						frontMoney: returnData.order.frontMoney,
						//定金
						fee: returnData.order.fee,
						//预定金额
						enablePay: returnData.order.enablePay,
						//是否需要支付定金(1是 0否)
						paid: returnData.order.paid,
						//是否已支付定金(1是 0否)
						materiaMoney: returnData.order.materiaMoney,
						//点菜金额[折扣价]
						isPayMateriaMoney: returnData.order.isPayMateriaMoney,
						//是否支付点菜金额(1是，0否）
						isComment: returnData.order.isComment,
						//是否评价(1是，0否）
						reason: returnData.order.reason,
						statusCode: returnData.order.statusCode,
						// "tag": '商户预订单',
						tag: returnData.order.tag,
						customerBookBookOrderId: returnData.order.bookOrderID, //CY20001
						bookOrderHabit: returnData.order.bookOrderHabit, //商家备注
					};
				} else {
					// 小程序
					customerOrder = {
						//通过CY28001得到的预定订单）
						customerBookID: returnData.customerOrder.customerBookID,
						//CY28001
						customerName: returnData.customerOrder.customerName,
						customerBookPhone: returnData.customerOrder.customerBookPhone,
						bookDate: returnData.customerOrder.bookDate.substring(0, 10),
						diningTypeName: returnData.customerOrder.diningTypeName,
						willArrivedOn: returnData.customerOrder.willArrivedOn,
						bookOrderTypeName: returnData.customerOrder.bookOrderTypeName,
						masterTableName: returnData.customerOrder.bookTableTableName,
						customerBookCompany: returnData.customerOrder.customerBookCompany,
						remark: returnData.customerOrder.remark,
						orderInfoRemark: returnData.customerOrder.orderInfoRemark ? JSON.parse(returnData.customerOrder.orderInfoRemark) :
							[],
						customerRemark: returnData.customerOrder.customerRemark ? returnData.customerOrder.customerRemark : '',
						customerBookBookNums: returnData.customerOrder.customerBookBookNums,
						frontMoney: returnData.customerOrder.frontMoney,
						//定金
						fee: returnData.customerOrder.fee,
						//预定金额
						enablePay: returnData.customerOrder.enablePay,
						//是否需要支付定金(1是 0否)
						paid: returnData.customerOrder.paid,
						//是否已支付定金(1是 0否)
						materiaMoney: returnData.customerOrder.materiaMoney,
						//点菜金额[折扣价]
						isPayMateriaMoney: returnData.customerOrder.isPayMateriaMoney,
						//是否支付点菜金额(1是，0否）
						isComment: returnData.customerOrder.isComment,
						//是否评价(1是，0否）
						reason: returnData.customerOrder.reason,
						statusCode: returnData.customerOrder.statusCode,
						tag: returnData.customerOrder.tag,
						customerBookBookOrderId: returnData.customerOrder.customerBookBookOrderId, //CY20001
						bookOrderHabit: returnData.order.bookOrderHabit, //商家备注
					};
				} //如果有取消原因就显示
				if (customerOrder.reason) {
					customerOrder.remark = customerOrder.reason;
				} //还需要支付的金额

				let payIsPaidMoney = this.payIsPaidMoney; //支付价格   =   点菜价格   -   定金

				if (customerOrder.enablePay == 1 && customerOrder.paid == 1) {
					//是否需要支付定金     并且  已经支付定金
					let nowNeedPaidMoney =
						(customerOrder.materiaMoney * 100 -
							customerOrder.frontMoney * 100) /
						100;
					this.payIsPaidMoney = nowNeedPaidMoney;
				} else {
					this.payIsPaidMoney = customerOrder.materiaMoney;
				} // uni.setStorageSync('cart', '');
				//如果已点菜，就将点菜订单点菜列表加入缓存（cart）

				if (goodsList.foodList != null && goodsList.foodList.length > 0) {
					uni.setStorageSync('cart', goodsList.foodList);
					this.isShowPrefood = true // confirmFood: details.goods
				} else {
					//否则清空
					uni.setStorageSync('cart', '');
				}

				if (store.isCanOrderDishes == 1) {
					this.isCanOrderDishes = true;
				}

				if (store.isCanOrderDishesPay == 1) {
					this.isCanOrderDishesPay = true;
				} //如果定金金额小于点菜金额    不让支付

				// 定金，点菜金额[折扣价]
				if (customerOrder.frontMoney && customerOrder.materiaMoney) {
					if (customerOrder.frontMoney > customerOrder.materiaMoney) {
						this.isPayMaterialMoney = false;
					}
				}

				this.orderId = customerOrder.customerBookBookOrderId; //预订信息精简显示

				let tempRemark = [];

				if (!returnData.customerOrder) {
					//通过CY20001得到的预定订单（商户订单查询过来的（没有CY28数据））
					tempRemark.push(customerOrder.bookOrderTypeName);
				} else {
					if (customerOrder.customerRemark.length > 1) {
						for (let i = 0; i < customerOrder.customerRemark.length; i++) {
							tempRemark.push(customerOrder.customerRemark[i]);
						}
					}
				}

				tempRemark.push(customerOrder.bookDate);
				tempRemark.push(customerOrder.diningTypeName);
				tempRemark.push(customerOrder.willArrivedOn);
				this.orderDetail = {
					saler: saler,
					store: store,
					goodsList: goodsList,
					customerOrder: customerOrder,
					orderId: customerOrder.customerBookBookOrderId,
					description: description
				};
				//预订信息精简显示
				this.showInfo = tempRemark;
			}
		},
		callPhone() {
			let phone = this.orderDetail.store.telephone;
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},
		// 展开折叠选择
		changeToggle(e) {
			let index = e.currentTarget.dataset.index;

			if (this.selectedFlag[index]) {
				this.selectedFlag[index] = false;
			} else {
				this.selectedFlag[index] = true;
			}

			this.selectedFlag = this.selectedFlag;
		},
		//点击进入地图（暂时未用）
		btnMap() {
			//绑定数据
			let tempObj = this.orderDetail.store;
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

		// 预览图片
		previewImage(e) {
			let tempFilePathList = [];
			let files = this.orderDetail.description.photos;
			files.forEach(item => {
				tempFilePathList.push(item);
			})
			uni.previewImage({
				current: e.currentTarget.dataset.url,
				// 当前显示图片的http链接
				urls: tempFilePathList // 需要预览的图片http链接列表
			});
		},
		// async goPay() {//暂未使用
		// 	let data = {
		// 		orderId: this.orderId,
		// 		userId: getApp().globalData.LoginUserId
		// 	};
		// 	let rdata=await CY20.BookFrontmoney(data);
		// 		if(rdata){
		// 			let returnData = rdata.payParams;
		// 			let [error,res]=await uni.requestPayment({
		// 				timeStamp: returnData.timeStamp,
		// 				nonceStr: returnData.nonceStr,
		// 				package: returnData.package,
		// 				signType: 'MD5',
		// 				paySign: returnData.paySign})
		// 				if(res){
		// 					uni.showModal({
		// 						title: '提示',
		// 						content: '支付成功'
		// 					});
		// 					this.getStoreDetails(this.customerOrderId);
		// 				};
		// 				if(error){
		// 					uni.showModal({
		// 						title: '提示',
		// 						content: '支付失败'
		// 					});
		// 				}
		// 		}
		// },
		// //点菜付款接口
		// async payMaterial() {//暂未使用
		// 	let data = {
		// 		orderId: this.orderId,
		// 		userId: getApp().globalData.LoginUserId
		// 	};
		// 	let rdata=await CY20.BookFee(data);
		// 		if(rdata){
		// 			let returnData = rdata.payParams;
		// 			let [error,res]=await uni.requestPayment({
		// 				timeStamp: returnData.timeStamp,
		// 				nonceStr: returnData.nonceStr,
		// 				package: returnData.package,
		// 				signType: 'MD5',
		// 				paySign: returnData.paySign});
		// 				if(res){
		// 					uni.showModal({
		// 						title: '提示',
		// 						content: '支付成功'
		// 					});
		// 					this.getStoreDetails(this.customerOrderId);
		// 				};
		// 				if(error){
		// 					uni.showModal({
		// 						title: '提示',
		// 						content: '支付失败'
		// 					});
		// 				}
		// 		}
		// },
	}
};
