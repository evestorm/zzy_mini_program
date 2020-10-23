import WMOrder from '@/service/WM/WMOrderAppService.js';
import MSActiveConfig from '@/service/MS/MSActiveConfigAppService.js';
export default {
	data() {
		return {
			myShoppingCartList: this.$storage.getShoppingCartList(), // 商品列表
			orderSendType: getApp().globalData.confirmOrder.orderSendType, //1,自提;2,配送
			orderRemark: "", //备注
			address: {}, //顶部地址信息
			disCountInfo: { //可以选择的优惠信息
				coupons: {}, //优惠券
				hyCard: [], //会员卡
			},
			// 当前选择的优惠信息 包含优惠卷和会员卡
			selectDisCountInfo: {
				isSelectCoupons: false, // 选择的优惠卷
				isSelectCard: false, // 选择的会员卡
				cardItem: {
					isUseScore: false, // 是否使用积分
					isChoosePoints: false, // 打开积分开关
					maxUseScore: 0, // 最大积分
					inputUseScore: 0, // 输入的积分
					useScore: 0 // 使用的积分
				}, // 会员卡
				couponItem: {}, // 优惠卷
				disCountMoney: 0, // 总共优惠的金额
			},
			// 用户信息 用于用于填写用户名称和电话
			userInfo: {
				orderUserName: getApp().globalData.userInfo.fullName,
				orderUserPhone: getApp().globalData.userInfo.phone
			},
			isEditPoints: false, //点击编辑积分按钮 弹出编辑弹窗
		};
	},
	// 页面加载事件
	onLoad(option) {
		this.orderSendType=this.orderSendType==1?this.shoppInfo.isEnableSelf?1:2:2;//选择自提时 判断是否有自提权限 有：1 否则默认 2
		console.log(this.orderSendType)
		this.getCardDiscountInfo(); //获取可以使用的优惠信息
	},
	onShow() {
		this.useCoupon(); //获取优惠券信息
		// 地址选择回调
		this.address = this.$storage.getOrderAddress() ? this.$storage.getOrderAddress() : {};
		if (this.$storage.getOrderSelfUserInfo()) {
			this.userInfo = this.$storage.getOrderSelfUserInfo();
		}
	},
	methods: {
		// 确定修改积分操作
		tapScoreSure() {
			// 判断当前积分是否大于最大积分
			let value = parseInt(this.selectDisCountInfo.cardItem.inputUseScore);
			if (value > this.selectDisCountInfo.cardItem.maxUseScore) {
				uni.showToast({
					title: '不能超过最大积分',
					icon: 'none'
				});
			} else {
				this.selectDisCountInfo.cardItem.useScore = value;
				this.isEditPoints = false
			}
		},
		// 选择会员卡支付
		tapCard() {
			this.selectDisCountInfo.isSelectCoupons = false;
			this.selectDisCountInfo.isSelectCard = !this.selectDisCountInfo.isSelectCard;
			//会员卡默认选中第一个
			if(this.disCountInfo.hyCard.length!=0){
				this.selectDisCountInfo.cardItem = this.disCountInfo.hyCard[0];
			}
		},
		// 选择优惠券
		tapCoup() {
			this.selectDisCountInfo.isSelectCoupons = true;
			this.selectDisCountInfo.isSelectCard = false;
		},
		useCoupon() { //选择的优惠券信息
			let item = getApp().globalData.selectCouponProductItem;
			if (!this._.isEmpty(item)) {
				this.selectDisCountInfo.isSelectCoupons = true;
				this.selectDisCountInfo.isSelectCard = false;
				let price = this.originalTotalCount; // 订单总价格
				this.selectDisCountInfo.disCountMoney = 0; // 初始化为0
				let useCouponInfo = {};
				if (item.cardTypeEnumValue) {
					if (item.cardTypeEnumValue == '折扣') { //折扣
						useCouponInfo = {
							smallProgramCardUserID: item.smallProgramCardUserID, // 用户领取优惠券ID
							cardDiscount: item.cardDiscount, //折扣
							cardTypeEnumValue: item.cardTypeEnumValue,
							cardName: item.cardName
						}
						// 赋值选中优惠券 触发重新计算逻辑
						this.selectDisCountInfo.couponItem = useCouponInfo;
						price=this.originalTotalCount;
						// 计算折扣价格
						this.selectDisCountInfo.disCountMoney = price * (1 - useCouponInfo.cardDiscount) //计算折扣价格
						// 如果超出商城最大金额那么使用最大金额
						if (this.selectDisCountInfo.disCountMoney > item.shopMaxSub) {
							this.selectDisCountInfo.disCountMoney = item.shopMaxSub;
						}
					} else if (item.cardTypeEnumValue == '代金') {
						// 当前金额不满足就不赋值
						if (price >= item.fullSubtractionMax) {
							useCouponInfo = {
								smallProgramCardUserID: item.smallProgramCardUserID, // 用户领取优惠券ID
								fullSubtractionMax: item.fullSubtractionMax, // 满减上限
								fullSubtraction: item.fullSubtraction,
								cardTypeEnumValue: item.cardTypeEnumValue,
								cardName: item.cardName
							}
							
							// 赋值选中优惠券 触发重新计算逻辑
							this.selectDisCountInfo.couponItem = useCouponInfo;
							this.selectDisCountInfo.disCountMoney = useCouponInfo.fullSubtraction //计算满减
						} else {
							uni.showToast({
								title: `该代金券满${item.fullSubtractionMax}才可使用`,
								icon: 'none',
								duration: 2500
							});
						}
					} else if (item.cardTypeEnumValue == '兑换') {
						let res = item.productItems[0];
						if (res && res.productName) {
							useCouponInfo = {
								smallProgramCardUserID: item.smallProgramCardUserID, // 用户领取优惠券ID
								cardTypeEnumValue: item.cardTypeEnumValue,
								cardName: item.cardName,
								isFromCoup: true, // 是否来自优惠券
								id: res.id,
								monthSaleCount: res.monthSaleCount, //74
								originalPrice: res.originalPrice,
								productDesc: res.productDesc,
								productName: res.productName + '(优惠券)', //"卤牛肉"
								productPrice: 0, //价格为0
								num: 1, //数量为1
								productUnit: res.productUnit, // "500g"
								productUrl: res.productUrl,
								disCountMoney: res.productPrice,
								productPackBoxAmount: res.productPackBoxAmount,
								extendProductPrice: res.productPrice,
								extendproductName: res.productName
							}
							this.selectDisCountInfo.disCountMoney = res.productPrice //计算满减
						}
						
						// 赋值选中优惠券 触发重新计算逻辑
						this.selectDisCountInfo.couponItem = useCouponInfo;
					}
				}
				
			}

		},
		changeCard(arr) { //折叠面板改变选择的会员卡
			if (!this._.isEmpty(arr)) {
				// 拿到目前选择的会员卡
				this.selectDisCountInfo.isSelectCoupons = false;
				this.selectDisCountInfo.isSelectCard = true; //选择会员卡
				this.selectDisCountInfo.cardItem = this.disCountInfo.hyCard[arr[0]];
			}
		},
		userCardScore(item) { // 更改选择积分抵扣的开关
			item.isUseScore = !item.isUseScore;
		},
		//获取优惠信息
		async getCardDiscountInfo() {
			let data = {
				storeId: this.shoppInfo.storeId, // 门店Id
				openID: getApp().globalData.userInfo.spOpenId
			}
			let result = await MSActiveConfig.GetCardDiscountInfo(data);
			// 复制优惠卷信息
			this.disCountInfo.coupons = result.smallProgramCardDiscountInfo;

			// 复制会员卡信息 有多张
			this._(result.hyCardDiscountInfos).forEach(item => {
				item.scorePrecent = item.cardDeductionMoney / item.cardUseScore; //补积分折扣比
				item.isUseScore = false; // 是否使用积分
				item.isChoosePoints = false; // 是否打开更改积分图标
				item.useScore = item.hyUserScore; // 当前使用的积分
				item.inputUseScore = item.useScore; // input里面输入的积分
				item.maxUseScore = item.useScore; // 最大积分控制
			})
			this.disCountInfo.hyCard = result.hyCardDiscountInfos; //会员卡
		},
		//提交订单的资料
		async createOrder() {
			// 分自提和快递 自提取自提输入名称 快递取地址的
			let userName = this.address.orderUserName;
			let userPhone = this.address.orderUserPhone;
			// 不是自提的需要验证收货地址
			if (this.orderSendType != 1) {
				if (!this.address.orderUserPhone || this.address.orderUserPhone == '') {
					uni.showToast({
						title: '收货地址不能为空',
						icon: 'none',
					})
					return;
				}
			} else {
				if (!this.userInfo.orderUserName) {
					uni.showToast({
						title: '联系电话和姓名不能为空',
						icon: 'none',
					})
					return;
				} else {
					if (!this.$util.validatemobile(this.userInfo.orderUserPhone)) {
						uni.showToast({
							title: '手机格式不正确',
							icon: 'none',
						})
						return;
					} else {
						userName = this.userInfo.orderUserName;
						userPhone = this.userInfo.orderUserPhone;
						this.$storage.setOrderSelfUserInfo(this.userInfo);
					}
				}
			}

			let porductDtos = [],
				porductStr = '';
			for (let item of this.shoppingCartList) {
				let obj = {};
				obj.productGUID = item.id;
				obj.productNums = item.num;
				obj.productPrice = item.productPrice;
				porductStr += `${item.productName}(${item.productUnit})X${item.num} `;
				porductDtos.push(obj);
			}
			let data = {
				wxUserOpenId: getApp().globalData.userInfo.spOpenId, //微信用户的OpenId
				buUnitGUID: this.shoppInfo.storeId, //门店Id
				orderShareOpenId: this.shoppInfo.orderShareOpenId, //分享人id
				sendPeopleGUID: this.sendPeopleGUID, //配送人id
				orderUserName: userName, //订单电话
				orderUserPhone: userPhone, //订单用户电话
				orderUserAddress: this.orderSendType==2?this.address.orderUserAddress:'', //订单用户地址 zit
				orderUserAddressX:this.address.userAddressX ,//地址经度
				orderUserAddressY:this.address.userAddressY ,//地址纬度
				userAddressGUID: this.address.id, //配送地址GUID
				orderSendType: this.orderSendType, //1,自提;2,配送
				orderPrice: this.$filter['fixedMoney'](this.orderPrice), //订单总价格
				orderOriginalPrice: this.$filter['fixedMoney'](this.totalCount), // 订单应付金额
				orderRemark: this.orderRemark, //备注
				productDetailDesc: porductStr,
				porductDtos: porductDtos, //产品订单dto集合
			}

			if (this.selectDisCountInfo.isSelectCoupons) { //优惠券
				data.smallProgramCardUserID = this.selectDisCountInfo.couponItem.smallProgramCardUserID; //   卡券id?
			} else if (this.selectDisCountInfo.isSelectCard) { //选择会员卡
				data.hyUserCardID = this.selectDisCountInfo.cardItem.hyUserCardID; //   会员用户卡id
				// 如果使用积分 那么走积分机制
				if (this.selectDisCountInfo.cardItem.isUseScore) {
					data.cardUseScore = this.selectDisCountInfo.cardItem.useScore; //  积分
				}
			}
			let rdata = await WMOrder.CreateByDto(data);
			if (rdata&&rdata.id) {
				getApp().globalData.selectCouponProductItem = {}; // 下单成功后移除优惠券缓存
				this.$storage.removeShoppingCartList(); //移除购物车券缓存
				// 如果订单金额为0 直接跳转我的订单界面
				if (rdata.orderPrice == 0) {
					uni.navigateTo({
						url: `/pages/myOrder/myOrderStore?storeID=${this.shoppInfo.storeId}&tabIdx=3`
					});
				} else {
					uni.showToast({
						title: '订单已提交成功!正在跳转支付页面......',
						icon: 'none',
						duration: 2500
					})
					let param = {
						storeId: rdata.buUnitGUID,
						productId: rdata.id,
						productName: this.shoppInfo.shopName + '商城订单',
						logo: this.shoppInfo.logo,
						comName: this.shoppInfo.businessName, //企业名称
						storeName: this.shoppInfo.storeName,
						payAmount: this.$filter['fixedMoney'](rdata.orderPrice), // 实付金额
						relAmount: this.$filter['fixedMoney'](this._(this.shoppingCartList).sumBy(x=>x.originalPrice*x.num)),  // 应付取产品的原价格
					};
					
					let reditUrl = `/pages/common/pay/pay?param=${JSON.stringify(param)}&type=7`;
					// 选择会员卡传递会员卡id 名称和余额 会卡卡跳转会员支付 不然直接跳支付
					if (this.selectDisCountInfo.isSelectCard) {
						param.hyUserCardID = this.selectDisCountInfo.cardItem.hyUserCardID; // 卡ID
						param.hyCardTitle = this.selectDisCountInfo.cardItem.hyCardTitle; // 卡名称
						param.hyUserAmount = this.selectDisCountInfo.cardItem.hyUserAmount; // 卡余额
						param.cardUseScore = this.selectDisCountInfo.cardItem.useScore; // 使用积分
						reditUrl = `/pages/common/onlinePay/onlinePay?param=${JSON.stringify(param)}&type=7`;
					}

					setTimeout(function() {
						uni.redirectTo({
							url: reditUrl
						});
					}, 1500);
				}
			}
		},

	},
	computed: {
		// 购物车 由于要加菜所有这个需要计算
		shoppingCartList() {
			let shoppingCartList = this._.cloneDeep(this.myShoppingCartList);
			if (this.selectDisCountInfo.isSelectCoupons) {
				let couponItem = this.selectDisCountInfo.couponItem;
				// 移除所有来自优惠券的在进行添加
				if (couponItem.cardTypeEnumValue == '兑换') {
					// 是否存在有这个菜 
					let productIndex = shoppingCartList.findIndex(x => x.id == couponItem.id);
					// 只有一个 那么把这个金额改成0 否则减一添优惠券的菜
					if (productIndex != -1) {
						if (shoppingCartList[productIndex].num > 1) {
							shoppingCartList[productIndex].num--;
						} else {
							this._(shoppingCartList).remove(x => x.id == couponItem.id).value();
						}
					}
				
					shoppingCartList.push(couponItem);
				}
			}
			return shoppingCartList;
		},
		// 展示的产品的总价
		cartListAmount() {
			return this._(this.shoppingCartList).sumBy(x => x.num * x.productPrice);
		},
		//订单商品总价 包含打包费用 包换优惠卷的
		totalCount() {
			return this._(this.shoppingCartList).sumBy(x => x.num * (x.extendProductPrice + x.productPackBoxAmount));
		},
		// 原始总价格不包含优惠券的价格
		originalTotalCount() {
			let price= this._(this.myShoppingCartList).sumBy(x => x.num * (x.productPrice + x.productPackBoxAmount));
			// 如果有选择卡卷那么需要加上卡券打包盒费用
			if (this.selectDisCountInfo.isSelectCoupons) {
				let couponItem = this.selectDisCountInfo.couponItem;
				if (couponItem.cardTypeEnumValue == '兑换') {
					price+=couponItem.productPackBoxAmount;
				}
			}
			return price;
		},
		// 运费
		freight() {
			return this.orderSendType === 1 ? 0 : this.shoppInfo.freight;
		},
		// 打包费用
		packAmount() {
			let packAmount = this._(this.shoppingCartList).sumBy(x => x.num * x.productPackBoxAmount);
			return packAmount || 0;
		},
		//订单总价格(包括运费)
		orderPrice() {
			let price = this.totalCount;
			// 如果有使用会员卡 那么需要走折扣或者积分
			if (this.selectDisCountInfo.isSelectCard && this.selectDisCountInfo.cardItem.hyUserCardID) {
				let cardItem = this.selectDisCountInfo.cardItem;
				// 如果有用积分那么用积分抵扣金额
				if (cardItem.isUseScore) {
					let subPrice = cardItem.useScore * cardItem.scorePrecent;
					price = price - subPrice;
				}
				// 先计算折扣
				price = (price / 10.0 * cardItem.hyLevelDiscount);

			} else if (this.selectDisCountInfo.isSelectCoupons) {
				// 减去优惠券抵扣
				price = price - this.selectDisCountInfo.disCountMoney;
			}

			price = price > 0 ? price : 0
			// 加上运费
			price = price + (this.freight || 0);

			return price;
		},
		// 店铺西相关信息
		shoppInfo() {
			let shoppinglineInfo = this.$storage.getShoppinglineInfo();
			let myShopInfo = {};
			if (shoppinglineInfo) { //获取缓存的店铺信息
				myShopInfo.shopName = shoppinglineInfo.shopName; //店名
				myShopInfo.storeName = shoppinglineInfo.storeName; //店名
				myShopInfo.businessName = shoppinglineInfo.compnayName; //企业名
				myShopInfo.storeId = shoppinglineInfo.storeId; //门店id
				myShopInfo.orderShareOpenId = shoppinglineInfo.orderShareOpenId ? shoppinglineInfo.orderShareOpenId :
					''; //分享人id
				myShopInfo.logo = shoppinglineInfo.logo; //logo
				myShopInfo.shopImg = shoppinglineInfo.shopImg; //shopImg			
				myShopInfo.freight = shoppinglineInfo.freight ? shoppinglineInfo.freight : 0; //运费
				myShopInfo.isEnableSelf=shoppinglineInfo.isEnableSelf;//是否支持自提
			}
			return myShopInfo;
		},
		// 是否有地址
		isAddress() {
			return !this._.isEmpty(this.address);
		},
		// 配送人GUID
		sendPeopleGUID() {
			let shoppinglineInfo = this.$storage.getShoppinglineInfo();
			return shoppinglineInfo.sendPeopleGUID ? shoppinglineInfo.sendPeopleGUID : '';
		}
	},
	watch: {
		orderSendType(n, o) {
			getApp().globalData.confirmOrder.orderSendType = n;
		}
	}
};
