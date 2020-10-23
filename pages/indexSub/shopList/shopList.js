import GZH09 from '@/service/GZH/GZH09AppService.js';

let myGlobalData = getApp().globalData;
export default {
	data() {
		return {
			storeItems: null, // 门店集合
			latitude: myGlobalData.addr ? myGlobalData.addr.latitude : 0, // 当前位置的精度
			longitude: myGlobalData.addr ? myGlobalData.addr.longitude : 0 // 当前维度
			// 当前位置的维度
		};
	},
	// 页面加载事件
	onLoad(options) {
		// 'UR0700000012'
		this.initData(options.cWCompanyID);
	},

	methods: {
		async initData(cWCompanyID) {
			const data = {
				cWCompanyID: cWCompanyID
			};

			let result = await GZH09.GetStoreInfoList(data);
			this.storeItems = result.dataList;
		},
	},
	filters: {},
	watch: {}
	// ## 方法
};
