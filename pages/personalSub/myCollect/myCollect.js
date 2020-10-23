import GZH09 from '@/service/GZH/GZH09AppService.js';
import GK04 from '@/service/GK/GK04AppService.js';

export default {
	data() {
		return {
			latitude:getApp().globalData.addr ? getApp().globalData.addr.latitude : 0, // 当前位置的精度
			longitude: getApp().globalData.addr ? getApp().globalData.addr.longitude : 0, // 当前维度
			shopInfo: [],
			// //收藏门店列表
			pageIndex: 1,
			// //分页
			rowCount: 0,
			// //总数
			userInfo: getApp().globalData.userInfo,
			// //用户信息
			// // latitude: getApp().globalData.latitude,
			// // longitude: getApp().globalData.longitude,
			// collectPic: '',
			// pageindex: ''
		};
	},
	onLoad(option) {

	},
	onShow() {
		this.getStoreList();
	},
	methods: {
		//获取我的收藏门店列表
		async getStoreList() {
			let data = {
				type: 'shop',
				userId: this.userInfo.id,
				pageIndex: this.pageIndex
			};
			let rdata = await GZH09.MyCollectAsync(data);
			this._(rdata.dataList).forEach(item => {
				item.imgUrl_Server=item.storeLogo
			})
			this.shopInfo=rdata.dataList;
		},
		//滚动事件
		scrollLoading() {
			let shopInfo = this.shopInfo; //所有订单列表

			if (shopInfo.length >= this.rowCount) {
				uni.showToast({
					title: '没有更多了...',
					icon: 'none',
					duration: 1000
				});
				return;
			}

			uni.showLoading({
				title: '正在加载...'
			});
			let pageindex = this.pageindex;
			this.pageindex=pageindex+1;
			this.getStoreList(obj => {
				if (obj.length == 0) {
					this.pageindex= pageindex - 1;
				} else {
					obj.forEach(item=>{
						shopInfo.push(item);
					})
					this.shopInfo= shopInfo;
				}
				setTimeout(() => {
					uni.hideLoading();
				}, 2000);
			});
		}
		
	}
};
