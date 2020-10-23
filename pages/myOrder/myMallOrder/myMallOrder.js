import CY20 from '@/service/CY/CY20AppService.js';
import WMOrder from '@/service/WM/WMOrderAppService.js';

import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
// 每次请求页码
const PAGESIZE = 10;

export default {
	// 注册属性
	props: {
		storeID: {
			type: String,
			default: null
		}, // 门店ID 用于过滤
	},
	data() {
		return {
			tabIdx: 0, // 选中的tab的index
			tabArr: [
				{
					id: 0,
					name: '全部',
					selected: true
				},
				{
					id: 10,
					name: '待支付',
					selected: false
				},
				{
					id: 20,
					name: '待确定',
					selected: false
				},
				{
					id: 30,
					name: '待收货',
					selected: false
				},
				{
					id: 50,
					name: '已取消',
					selected: false
				}
			],
			dataList: [], // 订单列表

			// ---------------------- dataMescroll配置 ---------------------

			// 下拉刷新的常用配置
			downOption: {
				use: false, // 是否启用下拉刷新; 默认true
				auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
			},
			// 上拉加载的常用配置
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: PAGESIZE // 每页数据的数量,默认10（别忘了和请求参数中的pageSize一样）
				},
				noMoreSize: 0, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				empty: {
					icon: null,
					use: false,
					tip: ''
				},
				textNoMore: '没有更多啦~',
				toTop: {
					src: '', // 避免遮挡底部[打标签]按钮触发不了
				}
			},
			// mescroll实例
			mescrollSingle: {},
			navFilterBottom: '180', // 顶部筛选bottom高度,mescroll 距顶高度
			swBottom: 0, // mescroll 距底高度
		}
	},

	components: {
		MescrollEmpty
	},
	methods: {
		calcMescrollTop() { //计算mescroll高度
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query.select('.my-mall-order').boundingClientRect(data => {
					if (data) {
						this.navFilterBottom = (data.bottom + uni.upx2px((30 + 30) * 2)).toString();
					}
				}).exec();
			})
		},
		// 选中tabbar
		selectTabbar(item, idx) {
			if (item.selected) return;
			this.tabArr.forEach(item => {
				item.selected = false;
			});
			item.selected = true;
			this.tabIdx = idx;
		},
		// 取消订单
		async cancelOrder(item) {
			let data = {
				id: item.id,
				orderStatus: '取消'
			}
			let [error, res] = await uni.showModal({
				content: '确定要取消这个订单吗?'
			});
			if (res.confirm) {
				let result = await WMOrder.UpdateByDto(data);
				if (result) {
					// 删除项
					this._(this.dataList).remove(x => x.id == item.id).value();
					this.dataList.splice(this.dataList.length);
					uni.showToast({
						title: '取消成功'
					});
				}
			}
		},
		goPay(item) { //去支付/
			let param = {
				storeId: item.buUnitGUID,
				productId: item.id,
				productName: '商城订单',
				logo: getApp().globalData.PicDomain + item.logo,
				comName: item.businessName,
				storeName: item.branchName,
				payAmount: item.orderPrice, //实付金额,
				relAmount: item.orderOriginalPrice,
			};
			if (item.hyUserCardID) { //有会员卡走选择支付方式页面；否则走公共页面
				param.hyUserCardID = item.hyUserCardID; //会员卡id(仅在下单时选择会员优惠才有)
				param.cardUseScore = item.cardUseScore; //使用的积分
				uni.navigateTo({
					url: `/pages/common/onlinePay/onlinePay?param=${JSON.stringify(param)}`
				});
			} else {
				uni.navigateTo({
					url: `/pages/common/pay/pay?param=${JSON.stringify(param)}&type=7`
				})
			}

		},
		async confirm(item) { //确认收货
			let data = {
				id: item.id
			}
			let result = await WMOrder.ConfirmOrder(data);
			if (result) {
				this.refresh();
			}
		},
		// ---------------------- methods数据请求 ------------------------------

		/*下拉刷新的回调 */
		downCallback(mescroll) {
			this.mescrollSingle = mescroll;
			mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
		},
		/*上拉加载的回调*/
		async upCallback(mescroll) {
			this.mescrollSingle = mescroll;
			// 此时mescroll会携带page的参数:
			let pageNum = mescroll.num; // 页码, 默认从1开始
			let pageSize = mescroll.size; // 页长, 默认每页10条

			let data = {
				userId: getApp().globalData.LoginUserId,
				pagesize: pageSize,
				pageindex: pageNum,
				orderStatus: this.tabArr[this.tabIdx].id, // 状态
				storeID: this.storeID
			};
			let result = await WMOrder.GetWMOrderList(data);
			if (result) {
				result = this.$util.null2str(result);
				// 接口返回的当前页数据列表 (数组)
				let curPageData = result.dataList || [];
				// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
				let totalPage = Math.ceil(result.rowCount / PAGESIZE);
				//设置列表数据
				if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动置空列表
				this.dataList = this.dataList.concat(curPageData); //追加新数据
				// console.log({
				// 	'数据列表dataList': this.dataList
				// });
				//方法一(推荐): 后台接口有返回列表的总页数 totalPage
				mescroll.endByPage(curPageData.length, totalPage);
			} else {
				// 失败隐藏下拉加载状态
				mescroll.endErr();
			}
		},
		// 刷新列表
		refresh() {
			this.mescrollSingle.resetUpScroll && this.mescrollSingle.resetUpScroll();
		},
	},
	computed: {},
	watch: {
		tabIdx: {
			handler(val) {
				this.refresh();
			}
		},
	}
}
