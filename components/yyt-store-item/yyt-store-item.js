// 作者:于大明
export default {
	name: 'yyt-store-item',
	// 注册属性
	props: {
		// 门店item
		item: {
			type: Object,
			default: () => {
				return {
					storeID: "GZH0900000036",
					businessName: "双湖园",
					branchName: "水果湖店",
					address: "湖北省武汉市武昌区兴国北路",
					offsetType: 1,
					longtitude: 114.370422,
					latitude: 30.544522,
					avgPrice: 70,
					imgUrl: "/upload/img/20181018/1731303130_二楼宴.jpg",
					imgUrl_Server: "https://pic.cwyyt.cn/upload/img/20181018/1731303130_二楼宴.jpg",
					score: 5,
				}
			}
		},
		latitude: {
			type: Number,
			default: 0
		}, // 精度
		longitude: {
			type: Number,
			default: 0
		} // 维度

	},
	created() {
	},
	data() {
		return {
		};
	},
	computed: {
		// 传过来的item 需要经过计算
		storeItem(){
			this.item.score = this.item.score || 5;
			this.$set(this.item,'point',0);
			this.item.points =this.$util.distance(this.latitude, this.longitude, this.item.latitude, this.item.longtitude) ? ''+this.$util.toDecimal(this.$util.distance(this.latitude, this.longitude, this.item.latitude, this.item.longtitude),2):'';
		    return this.item;
		}
	},
	methods: {
		// 注册事件
		_onClick() {
			this.$emit('onClick');
		}
	}
};
