import YHBanquetOrder from '@/service/YH/YHBanquetOrderAppService.js';
// 每次请求页码
const PAGESIZE = 10;

export default {
	// 注册属性
	props: {
		storeID: {
			type: String,
			default:null
		}, // 门店ID 用于过滤
	},
	data() {
		return {
			dataList: [], // 宴会订单列表

			// ---------------------- dataMescroll配置 ---------------------

			// 下拉刷新的常用配置
			downOption: {
				use: true, // 是否启用下拉刷新; 默认true
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
			navFilterBottom: '90', // 顶部筛选bottom高度,mescroll 距顶高度
			swBottom: 0, // mescroll 距底高度
		}
	},
	methods: {
		calcMescrollTop() {//计算mescroll高度
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query.select('.my-banquet').boundingClientRect(data => {
					if(data){
						this.navFilterBottom = (data.bottom+uni.upx2px(30*2)).toString();
					}
				}).exec();
			});
		},
		// ---------------------- methods数据请求 ------------------------------

		/*下拉刷新的回调 */
		downCallback(mescroll) {
			this.mescrollSingle = mescroll;
			mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
		},
		/*上拉加载的回调*/
		async upCallback(mescroll) {
			// 此时mescroll会携带page的参数:
			let pageNum = mescroll.num; // 页码, 默认从1开始
			let pageSize = mescroll.size; // 页长, 默认每页10条

			let data = {
				nameOrPhone: getApp().globalData.userInfo.phone,
				pageIndex: pageNum,
				pageSize: pageSize,
				storeID:this.storeID
			}
			// 获取宴会订单列表
			let result=await YHBanquetOrder.GetBanquetOrder(data,null,(err)=>{mescroll.endErr()});
				if (result) {
					result = this.$util.null2str(result);
					// 接口返回的当前页数据列表 (数组)
					let curPageData = result.list || [];
					// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
					let totalPage = Math.ceil(result.rowCount || 1 / PAGESIZE);
					//设置列表数据
					if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动置空列表
					this.dataList = this.dataList.concat(curPageData); //追加新数据
					// console.log({
					// 	'数据列表dataList': this.dataList
					// });
					//方法一(推荐): 后台接口有返回列表的总页数 totalPage
					mescroll.endByPage(curPageData.length, totalPage);
				} 
				// if(error) {
				// 	// 失败隐藏下拉加载状态
				// 	mescroll.endErr();
				// }
		},
		// 刷新列表
		refresh() {
			this.mescrollSingle.resetUpScroll && this.mescrollSingle.resetUpScroll();
		},
	},
	watch: {
	}
}
