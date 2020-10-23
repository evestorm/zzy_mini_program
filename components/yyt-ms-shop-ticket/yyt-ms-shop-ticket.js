export default {
	name: 'yyt-ms-shop-ticket',
	// 注册属性
	props: {
		inputItems: {
			type: Array,
			default: () => [{
					"activeConfigName": "阿尔抢购中",
					"msGoodType": 2,
					"msGoodGUID": "GK0600000093",
					"msBeginTime": "2020-04-27 08:00:00",
					"msEndTime": "2020-04-29 00:00:00",
					"msGoodsPrice": 1,
					"buyCount": 0,
					"msGoodsCount": 10,
					"activeConfigPic": "https://pic.cwyyt.cn/upload/img/20200427/1443114311_刘巧珍.jpg",
					"remainingCount": 10,
					"msGoodOriginalPrice": 3,
					"stateCode": 4,
					"stateStr": "抢购中",
					"msBeginTimeStr": "08:00",
					"id": "b22de7e5-e799-48dd-38cb-08d7e1c56662"
				},
				{
					"activeConfigName": "阿尔抢购中",
					"msGoodType": 2,
					"msGoodGUID": "GK0600000093",
					"msBeginTime": "2020-04-27 08:00:00",
					"msEndTime": "2020-04-29 00:00:00",
					"msGoodsPrice": 0,
					"buyCount": 0,
					"msGoodsCount": 10,
					"activeConfigPic": "https://pic.cwyyt.cn/upload/img/20200427/1443114311_刘巧珍.jpg",
					"remainingCount": 10,
					"msGoodOriginalPrice": 0,
					"stateCode": 4,
					"stateStr": "抢购中",
					"msBeginTimeStr": "08:00",
					"id": "b22de7e5-e799-48dd-38cb-08d7e1c56692"
				},
				{
					"activeConfigName": "阿尔啊-已售罄",
					"msGoodType": 2,
					"msGoodGUID": "GK0600000093",
					"msBeginTime": "2020-04-27 08:00:00",
					"msEndTime": "2020-04-29 00:00:00",
					"msGoodsPrice": 0,
					"buyCount": 0,
					"msGoodsCount": 10,
					"activeConfigPic": "https://pic.cwyyt.cn/upload/img/20200427/1443114311_刘巧珍.jpg",
					"remainingCount": 10,
					"msGoodOriginalPrice": 0,
					"stateCode": 2,
					"stateStr": "已售罄",
					"msBeginTimeStr": "09:00",
					"id": "b22de7e5-e799-48dd-38cb-08d7e1c56663"
				},


				{
					"activeConfigName": "阿尔啊-未开始",
					"msGoodType": 2,
					"msGoodGUID": "GK0600000093",
					"msBeginTime": "2020-04-27 08:00:00",
					"msEndTime": "2020-04-29 00:00:00",
					"msGoodsPrice": 0,
					"buyCount": 0,
					"msGoodsCount": 10,
					"activeConfigPic": "https://pic.cwyyt.cn/upload/img/20200427/1443114311_刘巧珍.jpg",
					"remainingCount": 10,
					"msGoodOriginalPrice": 0,
					"stateCode": 3,
					"stateStr": "未开始",
					"msBeginTimeStr": "20日 18:00",
					"id": "b22de7e5-e799-48dd-38cb-08d7e1c56664"
				},
				{
					"activeConfigName": "154-结束",
					"msGoodType": 2,
					"msGoodGUID": "GK0600000088",
					"msBeginTime": "2020-04-27 12:00:00",
					"msEndTime": "2020-04-28 00:00:00",
					"msGoodsPrice": 0,
					"buyCount": 0,
					"msGoodsCount": 16,
					"activeConfigPic": null,
					"remainingCount": 16,
					"msGoodOriginalPrice": 0,
					"stateCode": 5,
					"stateStr": "已结束",
					"msBeginTimeStr": "05:00",
					"id": "38db59da-aaff-40be-7b66-08d7e1b84536"
				},
			]
		}
	},
	created() {
		this.currentSlectItem = this.items[0];
	},
	data() {
		return {
			currentSlectItem: {} // 当前选中的Item
		};
	},
	computed: {
		items() {
			// 处理传入的Items
			return this.inputItems;
		},
		// 滑块向左滚动的距离
		scrollLeft() {
			let itemIndx = this._(this.items).findIndex(x => x.id == this.currentSlectItem.id);
			return (itemIndx - 1) * 60 // 控制向左滚动
		}
	},
	filters: {
	},
	methods: {
		// 选择tab
		selctActiveTab(item) {
			this.currentSlectItem = item;
			if(item.stateStr == '未开始'){
				// 刷新时间
				this.$refs.YytCountdownNoBegin && (this.$refs.YytCountdownNoBegin._onCountDown(item.msBeginTime));
			}else if(item.stateStr == '抢购中'){
				this.$refs.YytCountdownAlreadyBegin && (this.$refs.YytCountdownAlreadyBegin._onCountDown(item.msEndTime));
			}
		},
	}
};
