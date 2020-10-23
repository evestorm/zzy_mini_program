// 作者:李彦熹
import GZH09AppService from '@/service/GZH/GZH09AppService.js';

export default {
	data() {
		return {
			storeList: [], //门店信息列表
			params: {
				storeId: '', //选择门店id
				cWCompanyID: '' //企业id
			},
			latitude: getApp().globalData.addr ? getApp().globalData.addr.latitude : 0, // 当前位置的精度
			longitude: getApp().globalData.addr ? getApp().globalData.addr.longitude : 0 // 当前维度
		};
	},
	// 页面加载事件
	async onLoad(options) {
		this.params = options;
		if (this.params.cWCompanyID) {
			await this.getStoreInfoList();
		}
	},

	methods: {
		// 获取门店信息列表
		async getStoreInfoList() {
			const data = {
				cWCompanyID: this.params.cWCompanyID
			};

			let result = await GZH09AppService.GetStoreInfoList(data);
			this.storeList = result.dataList;
		}
	},
	computed: {
		//计算门店距离
		calStoreList() {
			let stores = this.storeList;
			for (let i = 0; i < stores.length; i++) {
				let store = stores[i];
				store.point = this.$util.toDecimal(this.$util.distance(this.latitude, this.longitude, store.latitude, store.longitude),
					2);
			}
			return stores;
		}
	},
	filters: {
		// parseScene(value) {
		// return value+'123';
		// }
	},
	watch: {
		// "currentStore.storeId": {
		//    handler(val, oldval) {
		//        if (val) {

		//        }
		//    }
		// }
	}
	// ## 方法
};
