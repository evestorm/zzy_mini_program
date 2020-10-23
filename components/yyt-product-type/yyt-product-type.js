export default {
	name: 'yyt-product-type',
	// 注册属性
	props: {
		// 所有产品类型
		typeItems: {
			type: Array,
			default: () => [{
					id: "5d5ed8a1-2f84-4b9d-2c6a-08d7c1a01784",
					productTypeName: "盒饭套餐",
					productTypeUrl: "https://pic.cwyyt.cn/upload/img/20200306/1529192919_微信图片_20200301151234.jpg",
					productTypeDesc: null
				},
				{
					id: "5d5ed8a1-2f84-4b9d-2c6a-08d7c1a01785",
					productTypeName: "盒饭套餐",
					productTypeUrl: "https://pic.cwyyt.cn/upload/img/20200306/1529192919_微信图片_20200301151234.jpg",
					productTypeDesc: null
				}, {
					id: "5d5ed8a1-2f84-4b9d-2c6a-08d7c1a01786",
					productTypeName: "盒饭套餐",
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
	data() {
		return {
			currentSelectItemId: null // 当前选中的Item的Id
		};
	},
	created() {
		// 默认选中第一个
		if (!this.selectItem&&this.typeItems) {
			this.currentSelectItemId = this.typeItems[0].id;
		} else {
			// 选中selectItem的
			this.currentSelectItemId = this.selectItem.id;
		}
	},
	computed: {
		// 分页 分成多个数组
		mutilTypeItems: {
			get() {
				// 进行分页 每页8个
				return this._(this.typeItems).chunk(8).value();
			}
		},
		// 定位当前在那个滑块的Index
		currentPageIndex() {
			let currentIndex = 1;
			// 查询index
			this.mutilTypeItems.forEach((items, index) => {
				if (this._(items).some(x => x.id == this.currentSelectItemId)) {
					currentIndex = index;
					return;
				}
			})
			return currentIndex;
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
