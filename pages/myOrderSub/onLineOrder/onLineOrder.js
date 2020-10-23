import WMOrder from '@/service/WM/WMOrderAppService.js';
export default {
	data() {
		return {
			id: '', //订单id
			orderInfo: {
				orderPrice: 0, //合计金额
				orderPackAmount: 0, //打包费用
				// orderUserAddressX: '114.428980',
				// orderUserAddressY: '30.491710',

			}, //订单详情
			// orderStatus: {}, //订单状态(10,未支付;20,已支付;30,配送中;40,已完成;50,取消)
			foodList: [], //产品集合
			showSteps: false, //是否显示时间轴
			//----------------地图相关-----------------------
			showMap: false, //控制地图显示
			sendInfo: [], //需要标记的坐标（配送员坐标）
			interTime: null, //定时器
		};
	},
	onLoad(option) {
		this.id = option.id;
		this.getAllProduct(option.id);
	},
	onPullDownRefresh() { //下拉显示地图
		this.showMap = this.orderInfo.orderStatus == 30 ? this.orderInfo.orderSendStatus >= 30 && this.orderInfo.orderSendStatus <=
			40 ? true : false : false;
		if (this.showMap) {

		}
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 10);
	},
	onUnload() {
		if (this.interTime) {
			clearInterval(this.interTime);
		}
	},
	computed: {
		orderStatus(){//顶部状态及图标
			let obj={};
			switch (this.orderInfo.orderStatus) { //订单状态(10,未支付;20,待接单;25,待发货;30,配送中;40,已完成;50,取消)
				case 10:
					obj = {
						orderStatus: 10,
						payImg: 'https://pic.cwyyt.cn/upload/yyticons/1653255325_order-not-pay.png'
					}
					break;
				case 20:
					obj = {
						orderStatus: 20,
						payImg: 'https://pic.cwyyt.cn/upload/yyticons/1658445844_待接单@2x.png'
					}
					break;
				case 25:
					obj = {
						orderStatus: 25,
						payImg: 'https://pic.cwyyt.cn/upload/yyticons/17080787_待发货@2x.png'
					}
					break;
				case 30:
					switch (this.orderInfo.orderSendStatus) { //订单配送状态(10,配送中;20,骑手待接单;30,骑手待取货;40,骑手配送中;50,骑手已送达;60,已完成;70,呼叫异常)
						case 20: //'配送中'
							obj = {
								orderStatus: 31,
								payImg: 'https://pic.cwyyt.cn/upload/yyticons/1710111011_order-deliver.png'
							}
							break;
						case 30: //'骑手已接单'
							obj = {
								orderStatus: 32,
								payImg: 'https://pic.cwyyt.cn/upload/yyticons/1718191819_1.png'
							}
							break;
						case 30: //'骑手已到店'
							obj = {
								orderStatus: 33,
								payImg: 'https://pic.cwyyt.cn/upload/yyticons/1721132113_已到店@2x.png'
							}
							break;
						case 40: //'骑手已取货'
							obj = {
								orderStatus: 34,
								payImg: 'https://pic.cwyyt.cn/upload/yyticons/1720462046_骑手已取货@2x.png'
							}
							break;
						case 50: //'骑手已送达'
							obj = {
								orderStatus: 35,
								payImg: 'https://pic.cwyyt.cn/upload/yyticons/1720572057_骑手已送达@2x.png'
							}
							break;
						default:
							obj = {
								orderStatus: 31,
								payImg: 'https://pic.cwyyt.cn/upload/yyticons/1710111011_order-deliver.png'
							}
							
						break;
					}
					break;
				case 40:
					obj = {
						orderStatus: 40,
						payImg: 'https://pic.cwyyt.cn/upload/yyticons/1713531353_order-suc.png'
					}
					break;
				case 50:
					obj = {
						orderStatus: 50,
						payImg: 'https://pic.cwyyt.cn/upload/yyticons/1648464846_order-canael.png'
					}
					break;
				default:
					break;
			}
			return obj;
		},
		points() { //标记点坐标
			// if (this.markers) {
			let arr = [];
			this.markers.forEach(item => {
				let obj = {};
				obj.latitude = item.latitude;
				obj.longitude = item.longitude;
				arr.push(obj)
			})
			console.log('point', arr)
			return arr
			// }

		},
		markers() { //多点标记 （门店坐标 + 目的地坐标 +骑手坐标）
			// if (!this.orderInfo.sendInfo) {
			let arr = [{
					iconPath: 'https://pic.cwyyt.cn/upload/yyticons/1015111511_商家地址@2x.png',
					longitude: this.orderInfo.longtitude,
					latitude: this.orderInfo.latitude,
					width: uni.upx2px(48),
					height: uni.upx2px(58)
				},
				{
					iconPath: 'https://pic.cwyyt.cn/upload/yyticons/1014451445_目的地@2x.png',
					longitude: this.orderInfo.orderUserAddressX, //'114.322334', //
					latitude: this.orderInfo.orderUserAddressY, //'30.375637', //,
					width: uni.upx2px(48),
					height: uni.upx2px(58)
				}
			]
			if (this.orderInfo.orderSendStatus >= 30 && this.orderInfo.orderSendStatus <= 40 && this.sendInfo.longitude) { //只有接单后才有配送员信息
				let str = this.$util.parseKm(this.sendInfo.distance, 1) ? '距您' + this.$util.parseKm(this.sendInfo.distance, 1) : '';
				let sendObj = {
					iconPath: 'https://pic.cwyyt.cn/upload/yyticons/1014551455_骑车的骑手@2x.png',
					longitude:this.sendInfo.longitude,// '114.338980',
					latitude: this.sendInfo.latitude,//'30.401710', 
					width: uni.upx2px(96),
					height: uni.upx2px(116),
					// alpha:0.5,   //透明度
					callout: {
						content: this.orderInfo.orderSendStatusStr+'\n'+str,
						bgColor: '#ffffff',
						color: '#3C3C3C',
						fontsize: uni.upx2px(30),
						padding: uni.upx2px(16),
						borderRadius: uni.upx2px(8),
						display: 'ALWAYS'
					},
				}
				arr.push(sendObj)
			}


			console.log('markers', arr)
			return arr;
			// }

		},
		// longth() { //计算两点间距离
		// 	let long = 0;
		// 	if (this.points.length == 3 && this.showMap) {
		// 		long = this.$util.distance(this.points[1].latitude, this.points[1].longitude, this.points[2].latitude, this.points[
		// 			2].longitude)
		// 	}
		// 	return long
		// }
	},
	methods: {
		callPhone() { //联系配送员
			let phone = this.orderInfo.sendInfo.tel;
			uni.makePhoneCall({
				phoneNumber: phone
			})
		},
		//获取骑手位置
		async getTheLocation() {
			let data = {
				id: this.orderInfo.id
			}
			let rdata = await WMOrder.GetsTheLocation(data);
			if (rdata) {
				if (this.interTime && !rdata.latitude) { //没有配送员位置清除
					clearInterval(this.interTime);
					return
				}
				this.sendInfo = Object.assign({}, this.sendInfo, {
					longitude: rdata.longitude,
					latitude: rdata.latitude
				})
			}
		},
		//获取订单详情
		async getAllProduct(id) {
			let data = {
				id: id
			}
			let rdata = await WMOrder.GetViewDto(data);
			this.orderInfo = JSON.parse(JSON.stringify(rdata));
			this.orderInfo.orderUserAddressX = parseFloat(this.orderInfo.orderUserAddressX);
			this.orderInfo.orderUserAddressY = parseFloat(this.orderInfo.orderUserAddressY);
			this.foodList = JSON.parse(JSON.stringify(rdata.wmOrder2ProductItems));
			uni.setNavigationBarTitle({
				title: this.orderInfo.orderSendStatusStr
			});
			rdata.orderStatus == 30 && this.getTheLocation();
		},
		async cancleOrder() { //取消订单
			let data = {
				id: this.id,
				orderStatus: '取消'
			}
			let [error, res] = await uni.showModal({
				content: '确定要取消这个订单吗?'
			});
			if (res.confirm) {
				let result = await WMOrder.UpdateByDto(data);
				if (result) {
					// 删除项
					this.orderInfo.orderStatus = 50;
					this.orderInfo.orderSendStatusStr = "已取消"
					// this.orderStatus = {
					// 	orderStatus: 50,
					// 	payImg: 'https://pic.cwyyt.cn/upload/yyticons/1648464846_order-canael.png'
					// }
					uni.setNavigationBarTitle({
						title: '已取消'
					});
					//更新底部日志
					this.orderInfo.eventLogs.push({
						eventName:'订单已取消',
						eventDateTime:this.$moment(result.orderCancleTime).format('MM.DD HH:mm')
					})
					// uni.showToast({
					// 	title: '取消成功'
					// });
				}
			}
		},
		goPay() { //去支付/
			let param = {
				storeId: this.orderInfo.buUnitGUID,
				productId: this.orderInfo.id,
				productName: '商城订单',
				logo: 'https://pic.cwyyt.cn' + this.orderInfo.logo,
				comName: this.orderInfo.businessName,
				storeName: this.orderInfo.branchName,
				payAmount: this.orderInfo.orderPrice, //实付金额,
				relAmount: this.orderInfo.orderOriginalPrice,
			};
			if (this.orderInfo.hyUserCardID) { //使用会员卡-跳转选择支付方式
				param.hyUserCardID = this.orderInfo.hyUserCardID; //会员卡id(仅在下单时选择会员优惠才有)
				param.cardUseScore = this.orderInfo.cardUseScore //使用的积分
				uni.navigateTo({
					url: `/pages/common/onlinePay/onlinePay?param=${JSON.stringify(param)}`
				});
			} else { //没有使用会员卡，跳转公共支付
				uni.navigateTo({
					url: `/pages/common/pay/pay?param=${JSON.stringify(param)}&type=7`
				})
			}
		},
		async confirm() { //确认收货
		let [error, res] = await uni.showModal({
			content: '确定确认收货该订单?'
		});
		if(res.confirm){
			let data = {
				id: this.id
			}
			let result = await WMOrder.ConfirmOrder(data);
			if (result) {
				this.orderInfo.orderStatus = 40;
				this.orderInfo.isCanConfirmOrder=0;//去除确认收货按钮
				this.orderInfo.orderSendStatusStr = "已完成";
				// this.orderStatus = {
				// 	orderStatus: 40,
				// 	payImg: 'https://pic.cwyyt.cn/upload/yyticons/1713531353_order-suc.png'
				// }
				uni.setNavigationBarTitle({
					title: '已完成'
				});
				//更新底部日志
				this.orderInfo.eventLogs.push({
					eventName:'订单已完成',
					eventDateTime:this.$moment(result.orderFinishTime).format('MM.DD HH:mm')
				})
			}
			}
		},
		//取消时间轴的显示
		cancleStep(data) {
			this.showSteps = data
		}
	},
	filters: {},
	watch: {
		"showMap": {
			handler: function(val, oldval) {
				if (val) {
					// this.interTime&&clearInterval(this.interTime);//
					this.interTime = setInterval(() => {
						this.getTheLocation();
					}, 3000)
				}
			}
		}
	}
}
