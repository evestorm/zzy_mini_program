import CY20 from '@/service/CY/CY20AppService.js';
export default {
	data() {
		return {
			urlOption: {},
			// locationPic:
			//   getApp().globalData.PicDomain + '/upload/yytBanner/location1.png',
			// telPhonePic:
			//   getApp().globalData.PicDomain + '/upload/yytBanner/telPhone.png',
			orderDetail: {},
			//订单详情
			userInfo: {},
			//登录用户
			orderId: '',
			//用户自行预订订单id //CY28001  or  CY20001
			isShare: '',
			//是否是通过分享进来的
			sadf: getApp().globalData.PicDomain + '/upload/yytBanner/invite.png',
			InviteImg: '',
			InviteText_l: '',
			InviteText_r: ''
		};
	},

	components: {},
	props: {},
	async onLoad(options) {
		// test：YD191113830710032750
		getApp().globalData.curUrl = {
			path: this.$util.getCurrentPageUrl(),
			query: options
		};
		await getApp().globalData.verifyAu();
			//获取用户信息
			this.urlOption = options;
			this.InviteImg = getApp().globalData.PicDomain + '/upload/img/20200326/164300430_yqh-bg.png';
			this.userInfo = getApp().globalData.userInfo;
			this.isShare = options.isShare ? options.isShare : '';
			this.orderId = options.id;

			this.getStoreDetails(options.id);
	},
	onShareAppMessage(options) { //分享
		if (options.from === 'button') {
			// 来自页面内转发按钮
		}
		//单桌显示桌号，多桌显示桌
		let bookNumTag =
			this.orderDetail.customerOrder.bookTableNum > 1 ?
			this.orderDetail.customerOrder.bookTableNum + '桌' :
			this.orderDetail.customerOrder.masterTableName; // 设置菜单中的转发按钮触发转发事件时的转发内容
		let shareObj = {
			// title: "我在" + this.data.orderDetail.store.storeName + "订了一单，快来看看吧", // 默认是小程序的名称(可以写slogan等)
			title: '我在【' +
				this.orderDetail.store.storeName +
				'】已订好【' +
				bookNumTag +
				'】，敬请您来',
			path: `/pages/myOrderSub/Invite/Invite?isShare=yes&id=${
        this.orderId
      }&shareOpenid=${getApp().globalData.userInfo.spOpenId}`,
			// 默认是当前页面，必须是以‘/’开头的完整路径
			// imgUrl: app.PicDomain + '/upload/yytBanner/beij.png',
			imgUrl: getApp().globalData.PicDomain + '/upload/yytBanner/invite.png',
			//自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
			success: res => {
				// 转发成功之后的回调
				if (res.errMsg == 'shareAppMessage:ok') {}
			},
			fail: () => {
				// 转发失败之后的回调
				if (res.errMsg == 'shareAppMessage:fail cancel') {
					// 用户取消转发
				} else if (res.errMsg == 'shareAppMessage:fail') {
					// 转发失败，其中 detail message 为详细失败信息
				}
			},
		};
		return shareObj;
	},
	methods: {
		updateShareInfo(description) {
			getApp().globalData.getShareInfo({
					query: this.urlOption,
					curOpenid: getApp().globalData.userInfo.spOpenId,
					path: `/pages/myOrderSub/Invite/Invite`,
					title: '邀请函',
					description: description ? `邀请函-${description}` : ''
				},
				true
			);
		},
		//点击进入地图
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
		callPhone(e) {
			let phone = this.orderDetail.saler.phone;
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},
		callSalesPhone(e) {
			let phone = this.orderDetail.store.telephone;
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},
		//获得订单详情
		async getStoreDetails(id) {
			let data = {
				orderId: id
			};
			let rdata = await CY20.GetOrderDetail(data);
			if (rdata) {
				rdata = this.$util.null2str(rdata);
				// 插入分享邀请函日志记录
				if (rdata.order) {
					let array = [];
					rdata.order.bookerName && array.push(rdata.order.bookerName);
					rdata.order.bookerPhone && array.push(rdata.order.bookerPhone);
					rdata.order.bookOn && array.push(rdata.order.bookOn);
					rdata.order.diningTypeName &&
						array.push(rdata.order.diningTypeName);
					rdata.order.bookOrderTypeName &&
						array.push(rdata.order.bookOrderTypeName);
					this.updateShareInfo(array.join(';'));
				}
				let returnData = rdata;
				let orderDetail = this.orderDetail;
				let photoList = returnData.store.photoList;
				let photoList1 = [];
				photoList.forEach(item => {
					let img = getApp().globalData.PicDomain + item;
					photoList1.push(img);
				})
				//订单对应的门店

				let store = {
					photoList: photoList1,
					storeID: returnData.store.storeID,
					storeLogo: returnData.store.storeLogo,
					storeName: returnData.store.storeName,
					score: returnData.store.score ?
						this.$util.toDecimal(returnData.store.score, 0) : 5,
					isCanOrderDishes: returnData.store.isCanOrderDishes ?
						returnData.store.isCanOrderDishes : '',
					avgPrice: returnData.store.avgPrice ?
						this.$util.toDecimal(returnData.store.avgPrice, 2) + '￥/人' : '',
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
				}; //订单对应的销售

				let saler = {
					marketerID: returnData.saler.marketerID,
					name: returnData.saler.name,
					imgUrl: returnData.saler.imgUrl,
					phone: returnData.saler.phone,
					desc: returnData.saler.desc,
					id: returnData.saler.id
				};
				//订单对应的菜品
				let foodList = [];
				returnData.goodsList.foodList.forEach(item => {
					let obj = {
						memberPrice: item.memberPrice,
						materialId: item.materialId,
						materialName: item.materialName,
						materialUnit: item.materialUnit,
						materialPrice: item.materialPrice,
						imgUrl: item.imgUrl,
						quantity: item.quantity,
						foodDetailList: item.foodDetailList,
						id: item.id
					}
					foodList.push(obj);
				})
				let goodsList = {
					totalMoney: returnData.goodsList.totalMoney,
					discountMoney: returnData.goodsList.discountMoney,
					isPay: returnData.goodsList.isPay,
					foodList: foodList // "foodList": returnData.goodsList.foodList,
				};
				let customerOrder = {};
				if (!returnData.customerOrder) {
					//通过CY20001得到的预定订单（商户订单查询过来的（没有CY28数据））
					customerOrder = {
						customerBookID: returnData.order.customerBookID,
						//CY28001
						customerName: returnData.order.customerName,
						customerBookPhone: returnData.order.customerPhone,
						shareBookRemark: returnData.order.shareBookRemark ? returnData.order.shareBookRemark : '宴会',
						bookDate: returnData.order.bookOrderCreateOn.substring(0, 10),
						diningTypeName: returnData.order.diningTypeName,
						willArrivedOn: returnData.order.willArrivedOn,
						bookOrderTypeName: returnData.order.bookOrderTypeName,
						masterTableName: returnData.order.masterTableName,
						customerBookCompany: returnData.order.customerCompany,
						remark: '',
						// "remark": returnData.order.remark.split(','),
						customerBookBookNums: returnData.order.bookNums,
						frontMoney: returnData.order.frontMoney,
						//定金
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
						tag: '商户预订单',
						createTime: returnData.order.bookOrderCreateOn,
						customerBookBookOrderId: returnData.order.bookOrderID //CY20001
					};
				} else {
					customerOrder = {
						//通过CY28001得到的预定订单（商户订单查询过来的（没有CY28数据））
						customerBookID: returnData.customerOrder.customerBookID,
						//CY28001
						customerName: returnData.customerOrder.customerName,
						customerBookPhone: returnData.customerOrder.customerBookPhone,
						shareBookRemark: returnData.customerOrder.shareBookRemark ? returnData.customerOrder.shareBookRemark : '宴会',
						bookDate: returnData.customerOrder.bookDate &&
							returnData.customerOrder.bookDate.substring(0, 10),
						diningTypeName: returnData.customerOrder.diningTypeName,
						willArrivedOn: returnData.customerOrder.willArrivedOn,
						bookOrderTypeName: returnData.customerOrder.bookOrderTypeName,
						masterTableName: returnData.customerOrder.masterTableName,
						customerBookCompany: returnData.customerOrder.customerBookCompany,
						remark: returnData.customerOrder.remark,
						customerRemark: returnData.customerOrder.customerRemark &&
							returnData.customerOrder.customerRemark.split(','),
						customerBookBookNums: returnData.customerOrder.customerBookBookNums,
						frontMoney: returnData.customerOrder.frontMoney,
						//定金
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
						'statusCod  e': returnData.customerOrder.statusCode,
						tag: returnData.customerOrder.tag,
						createTime: returnData.customerOrder.createTime,
						customerBookBookOrderId: returnData.customerOrder.customerBookBookOrderId //CY20001
					};
				}

				this.orderDetail = {
					store: store,
					saler: saler,
					goodsList: goodsList,
					customerOrder: customerOrder
				}
			}
		},

	}
};
