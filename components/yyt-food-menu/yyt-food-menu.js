// 作者:覃彬

export default {
	name: 'yyt-food-menu',
	// 注册属性
	props: {
		// 菜单item
		foodGroupList: {
			type: Array,
			default: () => [{
				productTypeGUID: '',
				productTypeName: '',
				topMin: 0, // 该类别顶部距离
				topMax: 0, // 改类别顶部结束距离
				productList: [{
					id: "aaf8b2d7-de9f-4748-6224-08d7c29589fc",
					monthSaleCount: 70,
					productDesc: '',
					productName: "卤牛肉",
					productPrice: 98,
					productTypeGUID: "4a9545ac-4f3d-4716-ab6a-08d7c271cdab",
					productTypeName: "卤菜系列",
					productUnit: "500g",
					productUrl: "https://pic.cwyyt.cn/upload/img/20200308/1428342834_卤牛肉.jpg",
				}] // 该类别下的产品
			}] // 产品分组对象 topMin TopMax控制滚动定位
		},
		minCount: { //至少需要达到多少才能下订单
			type: Number,
			default: 0,
		},
		// 初始加入 购物车的产品
		initAddCardProducts: {
			type: Array,
			default: () => [{
				id: "aaf8b2d7-de9f-4748-6224-08d7c29589fc",
				num: 0 // 加入的数量
			}]
		}
	},
	data() {
		return {
			shoppingCartList: [], //加入购物车的产品
			isShowShoppingCart: false, //显示购物车
		};
	},
	mounted() {
		if (this.copyCouponProductItem) {
			this.shoppingCartList.push(this.copyCouponProductItem);
		}
		// if (!this._.isEmpty(this.initProductItem)) {
		// 	let productItem = this.foodList.find(x => x.id == this.initProductItem.productGUID);
		// 	this.isSelect(productItem);
		// }
	},
	computed: {
		// 传入选择的菜品优惠券
		initProductItem() {
			return getApp().globalData.selectCouponProductItem;
		},
		// 购物车总价格
		totalCount() {
			return this._(this.shoppingCartList).sumBy(item => item.num * item.productPrice);
		},
		// 优惠券过来的菜品
		copyCouponProductItem() {
			if (!this._.isEmpty(this.initProductItem)) {
				let productItem = this.foodList.find(x => x.id == this.initProductItem.productGUID);
				if (productItem) {
					// 加入购物车价格
					let cloneItem = this._.cloneDeep(productItem);
					cloneItem.productPrice = 0;
					cloneItem.copyId = cloneItem.id;
					cloneItem.id = '';
					cloneItem.productName = cloneItem.productName + '(优惠券)';
					return cloneItem;
				}
			}
		},
		// 获取所有的food
		foodList() {
			let foodList = [];
			// 每个产品要加入两个属性
			this.foodGroupList.forEach(groupItem => {
				// 如果分组下没有数据 那么需要加上这个数据
				if (groupItem.productList.length == 0) {
					groupItem.productList.push({
						productTypeGUID: groupItem.productTypeGUID,
						productTypeName: groupItem.productTypeName,
					});
				}

				groupItem.productList.forEach(item => {
					// 如果是优惠券来的
					if (!this._.isEmpty(this.initProductItem) && this.initProductItem.productGUID == item.id) {
						item.selected = true;
						item.num = 1;
					} else {
						item.selected = false;
						item.num = 0;
					}

					foodList.push(item);
				})
			});

			return foodList;
		},
	},
	filters: {

	},
	methods: {
		previewImg(url) { //放大图片
			this.$util.previewImage(url);
		},
		sub(item) { //减少商品数量
			// 找到food的产品 找到购物车的产品进行加减处理
			let foodItem=this.foodList.find(x=>x.id==item.id);
			// 找到购物车产品
			let shopItem=this.shoppingCartList.find(x=>x.id==item.id);
			if(shopItem&&shopItem.num>1){
				shopItem.num-=1;
			}else{
				this._(this.shoppingCartList).remove(x => x.id == item.id).value();
				this.shoppingCartList.splice(this.shoppingCartList.length);
			}

			if(foodItem.num>1){
				foodItem.num-=1;
			}else{
				foodItem.selected = false;
				this._(this.shoppingCartList).remove(x => x.id == item.id || x.copyId == item.id).value();
				this.shoppingCartList.splice(this.shoppingCartList.length);
			}
		},
		add(item) { // 增加商品数量
			// 最大购买数量控制
			if (item.buyMuchCount == 0 || item.buyMuchCount - 1 >= item.num) {
				// 找到food的产品 找到购物车的产品进行加减处理
				let foodItem=this.foodList.find(x=>x.id==item.id);
				if(foodItem) foodItem.num += 1;
				
				// 找到购物车产品
				let shopItem=this.shoppingCartList.find(x=>x.id==item.id);
				if(shopItem){
					shopItem.num += 1
				}else{
					// 购物车和菜品要独立开来
					let copyItem = this._.cloneDeep(item);
					copyItem.num -= 1;
					this.shoppingCartList.push(copyItem);
				}
			}
		},
		isSelect(item) { //选中该产品
			item.selected = true;
			item.num = 1;
			//  分两种情况 一种是从优惠券过来的 一种是普通的 从优惠券过来的加入优惠券的菜品 优惠券菜品不在列表才加入
			if (this.copyCouponProductItem && item.id == this.copyCouponProductItem.copyId &&
				!this.shoppingCartList.find(x => x.id == '')) {
				this.shoppingCartList.push(this.copyCouponProductItem);
			} else {
				// 购物车和菜品要独立开来 所以用深拷贝
				this.shoppingCartList.push(this._.cloneDeep(item));
			}
		},
		goConfirmOrder() { //下订单
			if (this.shoppingCartList.length == 0) { //购物车不能为空
				return;
			}
			let shoppingCartList = this._.cloneDeep(this._.uniqBy(this.shoppingCartList, 'id')); // 不影响原来数据去重

			// 下单的时候需要把优惠券的菜重新处理下
			if (this.initProductItem.productGUID) {
				let coupFoodIndex = shoppingCartList.findIndex(x => x.copyId == this.initProductItem.productGUID);
				if (coupFoodIndex != -1) {
					// 删掉之前加入的优惠券
					shoppingCartList.splice(coupFoodIndex, 1);
					// 找到真正的菜加进去
					let foodItem = this.foodList.find(x => x.id == this.initProductItem.productGUID);
					let shoppingCartItem = shoppingCartList.find(x => x.id === this.initProductItem.productGUID);
					if (shoppingCartItem) {
						shoppingCartItem.num++
					} else {
						foodItem.num = 1;
						shoppingCartList.push(foodItem);
					}
				}
			}
			shoppingCartList.forEach(x => x.extendProductPrice = x.productPrice);

			this.$storage.setShoppingCartList(shoppingCartList); //缓存已预订的菜单
			uni.navigateTo({
				url: `/pages/indexSub/confirmOrder/confirmOrder`
			})
		},
		_onGetProductTypeTop() {
			// 生成每个类别对应导航栏的距离 要减去产品类型的高度
			this.foodGroupList.forEach(item => {
				uni.createSelectorQuery().in(this).select(`#group-section${item.productTypeGUID}`).boundingClientRect(
					data => {
						let typeItem = {
							productTypeGUID: item.productTypeGUID,
							topMin: data.top - (data.width / 3.3) // 做比列处理
						};
						this.$emit('onGetProductTypeTop', typeItem);
					}).exec();
			})
		}
	}
};
