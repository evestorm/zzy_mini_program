import HY09 from '@/service/HY/HY09AppService.js';
import HY07 from '@/service/HY/HY07AppService.js';
import WMOrder from '@/service/WM/WMOrderAppService.js';
export default {
	data() {
		return {
			param: {
				hyUserAmount:0
			}, //页面显示数据
			payStyle: '微信', //支付方式
		};
	},
	onLoad(option) {
		this.param = JSON.parse(option.param);
		this.getMemberCard(this.param.hyUserCardID); //获取会员卡余额
	},
	methods: {
		async getMemberCard(id) { //获取会员卡详情,取余额
			let data = {
				id: id
			}
			let res = await HY07.getMemberCardInfo(data);
			this.$set(this.param,'hyUserAmount', res.hyUserAmount)
			// this.param.hyUserAmount = res.hyUserAmount;
		},
		async payOrder() { //确认支付
			if (this.payStyle == '微信') {
				uni.navigateTo({
					url: `/pages/common/pay/pay?param=${JSON.stringify(this.param)}&type=7`
				});
			} else if (this.payStyle == '会员') {
				let data = {
					hyUserCardID: this.param.hyUserCardID, //会员卡id
					realAmount: this.param.payAmount, //实付金额,
					feeAmount:this.param.relAmount,//应付金额
					storeID: this.param.storeId ,//店铺id
					useScore:this.param.cardUseScore,//使用的积分
					wMOrderID:this.param.productId//订单id
				}
				let res = await HY09.PaymentByMembershipCard(data);
				let updateStateData={//更改订单状态
					id:this.param.productId,
					orderStatus:20//订单状态(10,未支付;20,已支付;30,配送中;40,已完成;50,取消)
				}
				let result=await WMOrder.UpdateByDto(updateStateData)
				uni.showToast({
					title: '会员卡支付成功',
					duration: 2000
				})
				setTimeout(() => {
					uni.redirectTo({
						url: `/pages/myOrderSub/onLineOrder/onLineOrder?id=${this.param.productId}` //传订单id?
					})
				}, 2000)
			}
		}

	},
}
