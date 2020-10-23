// 作者:何文韬
import WMSendPeople from '@/service/WM/WMSendPeopleAppService.js';
import GZH09 from '@/service/GZH/GZH09AppService.js';
export default {
	data() {
		return {
			id: '', //团长的ID
			area: '', //区域名称
			list: [], //查询的数据集
			storeInfo:[], //门店信息
		};
	},
	// 页面加载事件
	async onLoad(option) {
		this.storeInfo=this.$storage.getShoppinglineInfo();
		console.log(this.storeInfo)
		let result=await GZH09.GetDto({primaryKey:this.storeInfo.storeId});
		this.storeInfo.telephone=result.telephone;
		this.area = (typeof(option.area) == 'undefined' || option.area == 'undefined') ? '' : option.area;
		this.id = (typeof(option.id) == 'undefined' || option.id == 'undefined') ? '' : option.id;
		this.storeid = (typeof(option.storeid) == 'undefined' || option.storeid == 'undefined') ? '' : option.storeid;
		await this.getOtherLeaders();
	},
	methods: {
		async getOtherLeaders() {
			let result = await WMSendPeople.GetOtherLeadersInTheArea({
				area: this.area,
				storeid: this.storeid,
			});
			this.list = result.leaders;
		}
	},
	computed: {
		// fullName: {
		//    get: function () {
		//        return this.firstName+this.lastName
		//    },
		//    set: function (newValue) {
		//        var names = newValue.split(' ')
		//        this.firstName = names[0]
		//        this.lastName = names[names.length - 1]
		//    }
		// }
		//this.fullName = 'John Doe' // set测试
	},
	filters: {
		parseScene: function(value) {
			if (value == null || typeof(value) == 'undefined') {
				return '';
			} else {
				return value;
			}
		}
	},
	watch: {
		//"currentStore.storeId": {
		//    handler: function (val, oldval) {
		//        if (val) {
		//            vmDivItem1.$options.methods.getMonthSummaryData.bind(vmDivItem1)(1, val);
		//            vmDivItem3.$options.methods.getTodyBookData.bind(vmDivItem3)(1, val);
		//        }
		//    }
		//}
	}
	// ## 方法
};
