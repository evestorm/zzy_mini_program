// 作者:覃彬

export default {
	name: 'yyt-food-menu-list',
	// 注册属性
	props: {
		// 菜单item
		foodList: {
			type: Array,
			default: () => [{
				id: "aaf8b2d7-de9f-4748-6224-08d7c29589fc",
				monthSaleCount: 70,
				productDesc: '',
				productName: "卤牛肉",
				productPrice: 98,
				productTypeGUID: "4a9545ac-4f3d-4716-ab6a-08d7c271cdab",
				productTypeName: "卤菜系列",
				productUnit: "500g",
				productUrl: "https://pic.cwyyt.cn/upload/img/20200308/1428342834_卤牛肉.jpg",
			}],
		}
	},
	created() {},
	data() {
		return {
			totalCount: 0, //购物车总价格
			shoppingCartList: [], //加入购物车的产品
		};
	},
	computed: {
		// 传入的group 进行处理
		calFoodList() {
			return this.foodList;
		}
	},
	filters: {

	},
	methods: {
		previewImg(url) { //放大图片
			let imgArr = [];
			imgArr.push(url)
			uni.previewImage({
				urls: imgArr
			})
		},
		_onsub(item) { //减少商品数量
			if (item.num > 1) {
				item.num -= 1;
			} else {
				item.selected = false;
			}
			this.$emit('shoppingCartListItem', item)
		},
		_onadd(item) { //增加商品数量
			item.num += 1;
			this.$emit('shoppingCartListItem', item)
		},
		isSelect(item) { //选中该产品
			item.selected = true;
			item.num = 1;
			this.shoppingCartList.push(item);
			this.$emit('shoppingCartListItem', item)
		}
	}
};
