// 作者:于大明

export default {
	name: 'yyt-product-type-x',
	// 注册属性
	props: {
		typeItems: {
			type: Array,
			default: () => [{
					id: "5d5ed8a1-2f84-4b9d-2c6a-08d7c1a01784",
					productTypeName: "盒饭套餐1",
					productTypeUrl: "https://pic.cwyyt.cn/upload/img/20200306/1529192919_微信图片_20200301151234.jpg",
					productTypeDesc: null
				},
				{
					id: "5d5ed8a1-2f84-4b9d-2c6a-08d7c1a01785",
					productTypeName: "盒饭套餐2",
					productTypeUrl: "https://pic.cwyyt.cn/upload/img/20200306/1529192919_微信图片_20200301151234.jpg",
					productTypeDesc: null
				}, {
					id: "5d5ed8a1-2f84-4b9d-2c6a-08d7c1a01786",
					productTypeName: "盒饭套餐3",
					productTypeUrl: "https://pic.cwyyt.cn/upload/img/20200306/1529192919_微信图片_20200301151234.jpg",
					productTypeDesc: null
				},
				{
					id: "5d5ed8a1-2f84-4b9d-2c6a-08d7c1a01788",
					productTypeName: "盒饭套餐4",
					productTypeUrl: "https://pic.cwyyt.cn/upload/img/20200306/1529192919_微信图片_20200301151234.jpg",
					productTypeDesc: null
				},
				{
					id: "5d5ed8a1-2f84-4b9d-2c6a-08d7c1a01712",
					productTypeName: "盒饭套餐5",
					productTypeUrl: "https://pic.cwyyt.cn/upload/img/20200306/1529192919_微信图片_20200301151234.jpg",
					productTypeDesc: null
				},
				{
					id: "5d5ed8a1-2f84-4b9d-2c6a-08d7c1a01734",
					productTypeName: "盒饭套餐6",
					productTypeUrl: "https://pic.cwyyt.cn/upload/img/20200306/1529192919_微信图片_20200301151234.jpg",
					productTypeDesc: null
				},
				{
					id: "5d5ed8a1-2f84-4b9d-2c6a-08d7c1a01757",
					productTypeName: "盒饭套餐7",
					productTypeUrl: "https://pic.cwyyt.cn/upload/img/20200306/1529192919_微信图片_20200301151234.jpg",
					productTypeDesc: null
				},
				{
					id: "5d5ed8a1-2f84-4b9d-2c6a-08d7c1a017812",
					productTypeName: "盒饭套餐8",
					productTypeUrl: "https://pic.cwyyt.cn/upload/img/20200306/1529192919_微信图片_20200301151234.jpg",
					productTypeDesc: null
				},
				{
					id: "5d5ed8a1-2f84-4b9d-2c6a-08d7c1a01738",
					productTypeName: "盒饭套餐9",
					productTypeUrl: "https://pic.cwyyt.cn/upload/img/20200306/1529192919_微信图片_20200301151234.jpg",
					productTypeDesc: null
				}
			]
		},
		// 当前选中那个item
		selectItem: {
			type: Object,
			default: () => {
				return null;
			}
		}
	},
	created() {
		// 默认选中第一个
		if (!this.selectItem&&this.typeItem) {
			this.currentSelectItemId = this.typeItems[0].id;
		} else {
			// 选中selectItem的
			this.currentSelectItemId = this.selectItem.id;
		}
	},
	data() {
		return {
			currentSelectItemId:null ,// 当前选中的Item的Id
		};
	},
	computed: {
		// 滑块向左滚动的距离
		scrollLeft() {
			let itemIndx=this._(this.typeItems).findIndex(x=>x.id==this.currentSelectItemId);
			return (itemIndx - 1) * 60 // 控制向左滚动
		}
	},
	methods: {
		// 注册选中事件
		_onSelctItem(item) {
			this.currentSelectItemId = item.id;
			this.$emit('onSelctItem', item);
		},
		// 设置选中的项
		setSelectItem(item){
			this.currentSelectItemId = item.id;
		}
	}
};