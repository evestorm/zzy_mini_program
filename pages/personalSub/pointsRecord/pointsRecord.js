import HY12AppService from '@/service/HY/HY12AppService.js';
export default {
	data() {
		return {
			index: 1,
			size: 10,
			noData: false,
			curDate: '',
			id: '',
			record: []
		};
	},
	onLoad(option) {
		this.id = option.id;
		let date = this.$util.formatTime().substring(0, 7);
		this.curDate=date;
		this.getPointsRecord(option.id, date);
	},
	onReachBottom() {
		if (!this.noData) {
			this.index = ++this.index;
			this.getPointsRecord(this.id, this.curDate, this.record);
		};
	},
	methods: {
		getDate(event) {
			this.curDate=event.detail.value;
			this.getPointsRecord(this.id, event.detail.value);
		},
		async getPointsRecord(id, date, array) {
			if (!array) {
				this.index = 1;
				this.noData = false;
				array = [];
			}
			let start = this.$util.formatTime(new Date(date)).split(' ');
			start[1] = '00:00:00';
			start = start.join(' ');
			let year = date.substring(0, 4);
			let month = date.substring(5, 8);
			let end = this.$util.formatTime(new Date(year, month, 0)).split(' ');
			end[1] = '23:59:59';
			end = end.join(' ');
			let data = {
				"pageIndex": this.index,
				"pageSize": this.size,
				"order": "chgTime desc",
				"filter": {
					"type": "and",
					"conditions": [{
						"attribute": "hyUserCardID",
						"datatype": "nvarchar",
						"operatoer": "eq",
						"value": id ? id : 'HY0700000048'
					}, {
						"attribute": "chgTime",
						"datatype": "datetime2",
						"operatoer": "ge",
						"value": start
					}, {
						"attribute": "chgTime",
						"datatype": "datetime2",
						"operatoer": "le",
						"value": end
					}, {
						"attribute": "IsBuySuccess",
						"datatype": "tinyint",
						"operatoer": "eq",
						"value": 1
					}, {
						"attribute": "feeChgType",
						"datatype": "tinyint",
						"operatoer": "eq",
						"value": 1
					}]
				}
			};
			let res=await HY12AppService.acBalance(data);
			if(res.dataList){
				res.dataList.forEach(item => {
					item.businessName = item.businessName ? item.businessName : '';
					item.branchName = item.branchName ? item.branchName : '';
					item.chgTime = item.chgTime.replace(/-/g, '.').split(' ');
					array.push(item);
				});
					this.record=array;
				if (res.dataList.length < this.size) {
					this.noData = true;
				}
			};
		},
	}
}
