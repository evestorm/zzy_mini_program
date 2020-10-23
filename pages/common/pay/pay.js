const App = getApp().globalData;
import Pay from '@/service/Pay/PayAppService.js';
import GK22 from '@/service/GK/GK22AppService.js';
export default {
	data() {
		return {
			payInfo: {
				param: {
					payAmount: 0,
					relAmount: 0,
					logo: "https://pic.cwyyt.cn/upload/img/20191105/1719521952_logo_new.png"
				}
			}
		};
	},
	onLoad(option) {
		option.param = JSON.parse(option.param);
		option.param.orderTime = this.$util.formatTime(new Date());
		this.payInfo = option;
	},
	methods: {
		async payFail(id, failUrl) {
			let data = {
				outTradNo: id
			};
			let res = await Pay.orderFail(data);
			uni.navigateTo({
				url: failUrl
			});
		},

		async pay() {
			let type = Number(this.payInfo.type);
			let option = this.payInfo.param;
			let userInfo = App.userInfo;
			let failUrl;
			let sucessUrl;
			let toUrl;
			let toUrlParam;
			let data = {
				storeId: option.storeId,
				openId: userInfo.spOpenId,
				productDto: {
					productId: option.productId,
					productName: option.productName,
					buyType: type
				}
			};
			switch (type) {
				case 1: //会员卡
					toUrl = `/pages/personalSub/storeMember/storeMember`;
					toUrlParam = `storeId;${option.storeId}|type;1`;
					failUrl = `/pages/common/payFail/payFail?url=${toUrl}&param=${toUrlParam}`;
					sucessUrl = `/pages/personalSub/memberCenter/memberCenter?`;
					data.productDto.wxBuyCardDto = {
						hyCardID: option.productId,
						hyUserName: option.hyUserName,
						hyUserSex: option.hyUserSex,
						hyUserBirthday: option.hyUserBirthday,
						hyUserTel: option.hyUserTel,
						shareMarketID: option.shareMarketID,
						shareOpenId: option.shareOpenId,
						cardBuyAmount: option.payAmount, //会员支付价格
						activeConfigGUID: option.activeConfigGUID ? option.activeConfigGUID : '', // 秒杀活动的id
						receiveType: option.receiveType ? option.receiveType : '2' ,//秒杀过来1
						cardReceiveFromType: option.cardReceiveFromType ? option.cardReceiveFromType : '',// 会员卡券领取来源类型 10,卡券详情;20,秒杀;30,营销页
						cardReceiveFromId: option.cardReceiveFromId ? option.cardReceiveFromId : '',//会员卡领取来源id
					};
					break;
				case 2: //优惠券
					toUrl = `/pages/personalSub/couponInfo/couponInfo`;
					toUrlParam = `shopId;${option.storeId}`;
					failUrl = `/pages/common/payFail/payFail?url=${toUrl}&param=${toUrlParam}`;
					sucessUrl = `/pages/personalSub/myCoupon/myCoupon`;
					data.productDto.buyTicketDto = {
						xcxUserID: App.userInfo.id,
						smallProgramCardID: option.smallProgramCardID,
						buyCount: option.buyCount,
						marketID: option.shareMarketID,
						shareOpenId: option.shareOpenId ? option.shareOpenId : '',
						buyAmount: option.payAmount, //支付价格
						activeConfigGUID: option.activeConfigGUID ? option.activeConfigGUID : '', // 秒杀活动的id
						receiveType: option.receiveType ? option.receiveType : '2' ,//秒杀1
						couponReceiveFromType: option.couponReceiveFromType ? option.couponReceiveFromType : '',//卡券领取来源类型 10,卡券详情;20,秒杀;30,营销页
						couponReceiveFromId: option.couponReceiveFromId ? option.couponReceiveFromId : '',// 卡券领取来源id
					};
					break;

				case 6: //充值
					toUrl = `/pages/personalSub/prePay/prePay`;
					toUrlParam = `id;${option.hyUserCardID}`;
					failUrl = `/pages/common/payFail/payFail?url=${toUrl}&param=${toUrlParam}`;
					sucessUrl = `/pages/personalSub/prePay/prePay?id=${option.hyUserCardID}`;
					data.productDto.productName = data.productDto.productName + '充值';
					data.productDto.rechargeCard = {
						hyUserCardID: option.hyUserCardID,
						feeComeType: 2,
						oldValue: option.relAmount,
						payload: option.payAmount,
						operationName: userInfo.fullName ? userInfo.fullName : userInfo.nickName,
						hyPayOptionID: option.hyPayOptionID,
					};
					break;

				case 7: //线上订单支付
					toUrl = `/pages/myOrderSub/onLineOrder/onLineOrder`;
					toUrlParam = `id;${option.productId}`;
					failUrl = `/pages/common/payFail/payFail?url=${toUrl}&param=${toUrlParam}`;
					sucessUrl = `/pages/myOrderSub/onLineOrder/onLineOrder?`;
					break;
			}
			let resOrder = await Pay.order(data);
			let outTradNo = resOrder.outTradNo;
			let [error, res] = await uni.requestPayment({
				timeStamp: resOrder.timeStamp,
				nonceStr: resOrder.nonceStr,
				package: resOrder.package,
				signType: 'MD5',
				paySign: resOrder.paySign
			});

			// 购买失败
			if (error) {
				this.payFail(outTradNo, failUrl);
			} else {
				uni.showToast({
					title: type == 6 ? '充值中...' : '购买中...',
					icon: 'loading',
					duration: 5000
				});

				// 循环查询购买状态
				let timeInterVal = setInterval(() => {
					searchBuyStatus();
				}, 1000);

				let searchCount = 1;

				// 查询购买成功状态
				let self = this;
				async function searchBuyStatus() {
					let rdata = await Pay.orderStatus({
						outTradNo: outTradNo
					});
					if (rdata.isBuySuccess == 1) {
						clearInterval(timeInterVal);
						uni.hideToast();
						
						uni.showToast({
							title: type == 6 ? '充值成功' : '购买成功'
						});
						
						// 购买优惠券或会员卡 需要修改访问记录
						if (self.payInfo.param.visterId && (type == 1 || type == 2)) {
							let visterData = {
								id: self.payInfo.param.visterId,
								appInIsBuy: 1
							}
							GK22.UpdateByDto(visterData);
						}
						
						setTimeout(() => {
							if (type == 1) {
								uni.redirectTo({
									url: `${sucessUrl}&id=${option.productId}&isNotLog=true`
								});
							} else if(type == 7){
								uni.redirectTo({
									url: `${sucessUrl}&id=${option.productId}`
								});
							} else {
								uni.redirectTo({
									url: sucessUrl
								});
							}
						}, 1000);
					} else {
						searchCount++;
						if (searchCount >= 8) {
							clearInterval(timeInterVal);
							self.payFail(outTradNo, failUrl);
						}
					}
				}
			}
		}
	}
};
