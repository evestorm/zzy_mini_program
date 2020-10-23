import requestConfig from "@/common/request.js";
import CY20 from '@/service/CY/CY20AppService.js';
import GZH09 from '@/service/GZH/GZH09AppService.js';
import GK04 from '@/service/GK/GK04AppService.js';

export default {
	data() {
		return {
			showModal: false, //快速标签的弹框
			webUrl: getApp().globalData.PicDomain,
			orderInfo: {}, //头部订单信息
			salesInfo: {},
			storeInfo: {},
			telPhonePic: getApp().globalData.PicDomain + '/upload/yytBanner/callPhone.png',
			isShowPhoto: false,
			//是否显示上传的图片
			shopInfo: {},
			//门店详情shopInfo
			isCollect: false,
			//默认不收藏店铺
			latitude: '',
			//获取小程序所在经纬度
			longitude: '',
			dis: [],
			//菜品（不包括包括套餐中的菜品）
			dishes: [],
			//菜品详情（包括套餐中的菜品）
			files: [],
			//上传图片数组
			selectedColor: 5,
			//总评分
			selectedColor1: 0,
			//门店环境
			selectedColor2: 0,
			//门店服务态度
			selectedColor3: 0,
			//客户经理评价样式
			selectedColorByDishes: [],
			//门店菜品评价样式
			starScore: [1, 2, 3, 4, 5],
			//评分数组
			orderId: "",
			//订单id（CY20）
			shopId: "",
			//门店id
			salerId: "",
			//客户经理id
			salerName: "",
			//客户经理名称
			commentDesc: "",
			//评论内容
			uploadImgNum: 0,
			//已上传图片的数量
			imgCodeArr: [],
			//上传的图片返回的code集合,
			uploadProgress: "",
			//上传进度百分比
			cWidth: 0,
			cHeight: 0,
			userInfo: "",
			colIds: "",
			tableTists: '' ,//预定桌台
			isDisabled:false,//当分享链接进来 评价一次后 评价按钮禁用
		};
	},
	props: {},
	async onLoad(options) {
		getApp().globalData.curUrl = {
			// path: '/pages/commentsDetail/commentsDetail',
			path: this.$util.getCurrentPageUrl(),
			query: options
		};
		await getApp().globalData.verifyAu();

		uni.showLoading({
			title: '加载中...'
		});
		//传入门店id
		if (options.id != undefined && options.id != "") {
			this.shopId = options.id;
		}
		//获取用户信息
		this.orderId = options.id;
		this.shopId = options.shopId;
		this.salerId = options.salerId;
		this.salerName = (options.salerName ? options.salerName.substring(0, 1) : "") + "经理";
		this.userInfo = getApp().globalData.userInfo;
		let url = encodeURIComponent(
			`../commentsDetail/commentsDetail?id=${options.id}&shopId=${options.shopId}&salerId=${options.salerId}&salerName=${options.salerName}`
		);
		this.userInfo = getApp().globalData.userInfo;
		if (getApp().globalData.addr) {
			this.latitude = getApp().globalData.addr.longitude;
			//获取小程序所在经纬度
			this.longitude = getApp().globalData.addr.longitude;
		}

		if (this.userInfo) {
			uni.hideLoading(); //app分享评价入口

			this.getOrderDetails(options.id); //获得门店初始数据

			this.getStoreDetails(this.shopId);
			// this.getCollectData();
		}

		if (getApp().globalData.addr) {
			this.latitude = getApp().globalData.addr.longitude;
			//获取小程序所在经纬度
			this.longitude = getApp().globalData.addr.longitude;
		}

		if (this.userInfo) {
			// if (!app.checkRegister(url)) {
			//     return;
			// }
			//app分享评价入口
			this.getOrderDetails(options.id); //获得门店初始数据

			this.getStoreDetails(this.shopId);
			// this.getCollectData();
		} //将套餐中不重复的菜品和套餐组合为新的待评价菜品
		// this.$wuxToast = getApp().globalData.wux(this).$wuxToast;
	},
	methods: {
		//获得订单详情
		async getOrderDetails(id) {
			let self = this;
			let data = {
				orderId: id
			};
			let rdata = await CY20.GetOrderDetail(data);
			if (rdata) {
				let returnData = rdata;
				let orderInfo = rdata.order;
				orderInfo.bookOn = rdata.order.bookOn.substring(0, 10);
				let arr = [];
				arr = this._.map(returnData.tablelists, 'tableTableName');
				// for(let n=0;n<returnData.tablelists.length;n++){
				// 	arr.push(returnData.tablelists[n].tableTableName)
				// }
				this.tableTists = arr.join(', '); //预定桌台
				this.orderInfo = orderInfo;
				this.salesInfo = rdata.saler;
				this.storeInfo = rdata.store;
				//订单如果不是本人的   -->   邀请函

				if (returnData.order.customerPhone != this.userInfo.phone) {
					uni.redirectTo({
						url: "/pages/myOrderSub/Invite/Invite?isShare=yes&id=" + this.orderId
					});
				} // if (returnData.order.tag =='已完成') {
				//   uni.redirectTo({ 
				// url: "/pages/bookingInfo/bookingInfo?orderId=" + this.data.orderId
				//   });
				// }
				//如果该订单已评价  就进入订单详情
				else if (returnData.order.isComment) {
					uni.redirectTo({
						url: '/pages/myOrderSub/bookingInfo/bookingInfo?orderId=' + id
					});
				}
			};
		},
		//得到评论内容
		getComment(e) {
			this.commentDesc = e.detail.value;
		},
		//点击上传图片
		upLoadPhoto() {
			this.isShowPhoto = true;
		},
		getExtension(path) {
			let _type = '';
			let parts = path.split('.');

			if (path.lastIndexOf('.') >= 0) {
				_type = parts.slice(-1)[0];
			}

			return _type;
		},
		async chooseImage(e) {
			//首先判断上传大小是否已达到上限
			let uploadNum = 6 - this.uploadImgNum;
			let codeArr = this.imgCodeArr;
			if (codeArr.length >= 6) {
				uni.showModal({
					title: '提示',
					content: '上传图片已达上限，无法继续上传！',
					success(res) {}
				});
				return;
			}

			let files = this.files;
			let [error, res] = await uni.chooseImage({
				count: uploadNum,
				// 默认6
				sizeType: ['compressed']
			});
			// 可以指定是原图还是压缩图，默认二者都有
			// sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			if (res) {
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
				let tempFiles = res.tempFiles;

				for (let i in tempFiles) {
					// if (tempFiles[0].size / 1024 > 50) {
					//   return uni.showModal({ title: '出错啦', content: '图片文件不能超过1M' })
					// }
					tempFiles[i]['uploadProgress'] = 0;
					tempFiles[i]['path_server'] = '';
					files.push(tempFiles[i]);
				}
				this.isShowPhoto = true;
				this.files = files;
				this.uploadImgNum = this.uploadImgNum + res.tempFilePaths.length;
			}
		},
		previewImage(e) {
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
		//总评分
		changeScoure(e) {
			this.selectedColor = e.target.dataset.sel;
		},
		//环境
		changeScoure1(e) {
			this.selectedColor1 = e.target.dataset.sel;
		},
		//服务状态
		changeScoure2(e) {
			this.selectedColor2 = e.target.dataset.sel;
		},
		//客户经理
		changeScoure3(e) {
			this.selectedColor3 = e.target.dataset.sel;
		},
		//获得门店初始数据
		async getStoreDetails(id) {
			let data = {
				shopId: id,
				userId: getApp().globalData.LoginUserId
			};
			let rdata = await GZH09.DetailAsync(data);
			let returnData = rdata;
			let shopInfo = this.shopInfo;
			let photoList = returnData.photoList;
			let photoList1 = [];

			for (let i in photoList) {
				let img = getApp().globalData.PicDomain + photoList[i];
				photoList1.push(img);
			}

			let hotel = {
				"photoList": photoList1,
				"storeLogo": returnData.storeLogo,
				"storeName": returnData.storeName,
				"score": returnData.score ? this.$util.toDecimal(returnData.score, 0) : 5,
				"avgPrice": returnData.avgPrice ? this.$util.toDecimal(returnData.avgPrice, 2) + "￥/人" : "",
				"category": returnData.category ? returnData.category : "",
				"address": returnData.address ? returnData.address : "",
				"latitude": returnData.latitude ? returnData.latitude : "",
				"longtitude": returnData.longtitude ? returnData.longtitude : "",
				"point": this.$util.distance(this.latitude, this.longitude, returnData.point.latitude, returnData.point.longitude) ?
					"距您" + this.$util.toDecimal(this.$util.distance(this.latitude, this.longitude, returnData.point.latitude,
						returnData.point
						.longitude), 2) + "km" : "",
				"telephone": returnData.telephone ? returnData.telephone : "",
				"openTime": returnData.openTime ? "营业时间 : " + returnData.openTime : "",
				"special": returnData.special ? "特色服务 : " + returnData.special : ""
			};
			this.shopInfo = hotel;
		},
		callPhone() {
			let phone = this.salesInfo.phone;
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},
		// //获得门店收藏数据
		// async getCollectData(success) {
		// //根据门店id获取门店评论列表   
		// 	let data = {
		// 		"pageIndex": 1,
		// 		"pageSize": 10,
		// 		"order": "CreateTime desc",
		// 		"filter": {
		// 			Type: "and",
		// 			Conditions: [{
		// 				Attribute: "OpenId",
		// 				Datatype: "nvarchar",
		// 				Operatoer: "eq",
		// 				Value: this.userInfo.openId
		// 			}, {
		// 				Attribute: "CollectionType",
		// 				Datatype: "nvarchar",
		// 				Operatoer: "eq",
		// 				Value: "shop"
		// 			}, {
		// 				Attribute: "ColId",
		// 				Datatype: "nvarchar",
		// 				Operatoer: "eq",
		// 				Value: this.shopId
		// 			}]
		// 		}
		// 	};
		// 	let rdata=await GK04.GetViewPage(data);
		// 	if(rdata) {
		// 		let returnData = rdata.dataList;
		// 		let colIds = [];
		// 		colIds =this._.map(returnData,'xcxCollectionID')
		// 		// for (let i = 0; i < returnData.length; i++) {
		// 		// 	colIds.push(returnData[i].xcxCollectionID);
		// 		// } //如果

		// 		if (colIds.length > 0) {
		// 			this.isCollect= true;
		// 			this.colIds= colIds;
		// 		}
		// 	}
		// },
		// //点击收藏店铺
		// collectShop(e) {
		// 	let self = this;
		// 	let isCollect = this.isCollect; //如果已经收藏则取消收藏

		// 	if (isCollect) {
		// 		//取消收藏   
		// 		let data = this.colIds;
		// 		GK04.BatchDelete(data, function(rdata) {
		// 			uni.showToast({
		// 				title: '取消收藏成功',
		// 				icon: 'success',
		// 				duration: 2000,
		// 				success() {}
		// 			});
		// 		}, false); 
		// 	} else {
		// 		//收藏该门店
		// 		let data = {
		// 			"openId": this.userInfo.openId,
		// 			"collectionType": "shop",
		// 			"colId": this.shopId,
		// 			"createTime": this.$util.formatTime()
		// 		};
		// 		GK04.CreateByDto(data, function(rdata) {
		// 			uni.showToast({
		// 				title: '收藏成功',
		// 				icon: 'success',
		// 				duration: 2000,
		// 				success() {}
		// 			});
		// 		}, false); 
		// 	}

		// 	this.setData({
		// 		isCollect: !isCollect
		// 	});
		// },
		// goshopInfo() {
		// 	uni.navigateTo({
		// 		url: '/pages/indexSub/shopInfo/shopInfo?id=' + this.shopId
		// 	});
		// },
		//提交评价
		goSubmit(e) {
			if (this.commentDesc.length < 8) {
				uni.showToast({
					title: '请至少输入8个字',
					icon: 'none'
				});
				return;
			}
			if (this.selectedColor1 == 0) {
				uni.showToast({
					title: '请对门店环境进行打分',
					icon: 'none'
				});
				return;
			}
			if (this.selectedColor2 == 0) {
				uni.showToast({
					title: '请对门店服务态度进行打分',
					icon: 'none'
				});
				return;
			}
			if (this.selectedColor3 == 0) {
				uni.showToast({
					title: '请对客户经理进行打分',
					icon: 'none'
				});
				return;
			}
			for (let i in this.selectedColorByDishes) {
				if (this.selectedColorByDishes[i] == "0") {
					uni.showToast({
						title: '请对菜品进行打分',
						icon: 'none'
					});
					return;
				}
			}

			uni.showLoading({
				title: '提交中...'
			});
			let files = this.files;
			let uploadImgCount = 0; //没有上传图片时直接评价

			if (files.length == 0) {
				this.comment();
			} //上传图片后先将图片上传到服务器，从服务器返回code在评价
			let self = this;
			for (let i = 0; i < files.length; i++) {
				const uploadTask = uni.uploadFile({
					url: requestConfig.api.domain + '/api/services/app/file/UploadFileForGk03?userId=' + getApp().globalData.LoginUserId,
					//仅为示例，非真实的接口地址
					filePath: files[i].path,
					header: {
						Authorization: requestConfig.api.Authorization
					},
					name: 'file',
					success(res) {
						uni.hideLoading();
						let tt = JSON.parse(res.data);
						let currentCode = tt.result; //返回的当前上传图片的code

						let codeArr = self.imgCodeArr;
						codeArr.push(currentCode.code);
						self.imgCodeArr = codeArr;
						uploadImgCount++; //图片上传完成之后通过返回的code去提交评价

						if (uploadImgCount == self.files.length) {
							self.comment();
						}
					}
				});
				uploadTask.onProgressUpdate(res => {
					console.log('上传进度', res.progress);
					console.log('已经上传的数据长度', res.totalBytesSent);
					console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend);
				});

				if (self.isCancel) {
					uploadTask.abort();
					break;
				}
			}
		},
		async comment() {
			let dishes = this.dishes;
			let selectedColorByDishes = this.selectedColorByDishes;
			let tempDis = [];

			for (let i in dishes) {
				tempDis.push({
					dishesId: dishes[i].id,
					dishesStart: selectedColorByDishes[i]
				});
			}

			let objData = {
				bookOrderID: this.orderId,
				start: this.selectedColor,
				commentDesc: this.commentDesc,
				userID: getApp().globalData.LoginUserId,
				photos: this.imgCodeArr.join(","),
				storeID: this.shopId,
				environmentStart: this.selectedColor1,
				attitudeStart: this.selectedColor2,
				salesID: this.salerId,
				salesStart: this.selectedColor3,
				dishesStartList: tempDis
			};
			let data = objData;
			let rdata = await CY20.MarkSubmit(data);
			if (rdata) {
				this.isDisabled=true;//评价成功后 按钮禁用
				uni.showToast({
					title: '评价成功'
				})
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					});
				}, 2100)
			}

		},
		callPhone() {
			let phone = this.salesInfo.phone;
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},
		cancel() { //弹出提示框取消按钮
			// this.$refs.showModal.close()
			this.showModal = false;
		},
		confirm() { //弹出提示框确认按钮
			let path = this.delpath
			this.uploadImgNum--;
			let uploadNums = 6 - (6 - this.uploadImgNum);
			let files = this.files;
			for (let i = 0; i < files.length; i++) {
				if (files[i].path == path) {
					//  ;
					//1.删除后台集合对应的元素
					files.splice(i, 1);
					break;
				}
			}

			this.uploadImgNum = uploadNums;
			this.files = files;
			this.showModal = false;
			// this.$refs.tipPopup.close()
		},
		delFile(path) { //删除图片
			this.delpath = path;
			this.showModal = true;
			// let self = this;
			// this.uploadImgNum--;
			// let uploadNums = 6 - (6 - this.uploadImgNum);
			// let files = this.files;
			// console.log('836path',path,files); 
			// for (let i = 0; i < files.length; i++) {
			// 	if (files[i].path == path) {
			// 		//  ;
			// 		//1.删除后台集合对应的元素
			// 		files.splice(i, 1);
			// 		break;
			// 	}
			// }

			// this.setData({
			// 	uploadImgNum: uploadNums,
			// 	files: files
			// });
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
				success: () => {
					suc && suc();
				}
			});
		}
	}
}
