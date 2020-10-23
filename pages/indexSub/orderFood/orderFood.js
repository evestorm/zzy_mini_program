// 于大明
import WMProduct from '@/service/WM/WMProductAppService.js';
import WMSendPeople from '@/service/WM/WMSendPeopleAppService.js';
import MSActiveConfig from '@/service/MS/MSActiveConfigAppService'

export default {
	data() {
		return {
			//-----------------------------产品相关--------------------------
			productTypeInfos: [], //产品类型列表
			productInfos: [], // 产品列表
			selectproductTypeItem: {}, // 当前选中的产品类型item
			isShowTopProductType: false, // 是否展示顶部的产品类型 滚动时候超过了就展示
			topTjHeight: 0, // 推荐离顶部的高度 用于点击滚动推荐的位置
			topProductHeight: 0, // 用于放于产品的高度
			groupProducts: [{
				productTypeGUID: '',
				productTypeName: '',
				topMin: 0, // 该类别顶部距离
				topMax: 0, // 改类别顶部结束距离
				productList: [] // 该类别下的产品
			}], // 产品分组对象 topMin TopMax控制滚动定位

			// ---------------------------------秒杀相关---------------------------
			msItems: [], // 秒杀Items
			getMsTimer:{},// 秒杀轮询定时器

			// ---------------------门店相关------------------------------------
			storeId: '', // 门店id
			conmpanyInfo: {
				isEnableWxShop:1,//是否有线上商城权限
			}, // 门店信息


			//--------------------------团长相关----------------------------------
			orderShareOpenId: '', //分享人id
			sendPeopleInfo: {}, //团长信息

			//--------------------弹出层信息-------------------------------------------
			isShowPop: false, // 是否显示内容
		};
	},
	// 页面滚动事件
	onPageScroll(e) {
		if (this.productTypeInfos) {
			// 展示顶部菜单 要考虑影响高度的 这里用产品类型距离顶部位置
			if (e.scrollTop > this.topProductHeight) {
				this.isShowTopProductType = true;
			} else {
				this.isShowTopProductType = false;
			}

			// 滚动的时候要联动选中产品类型
			let selectProductTypeItem = this.currentGroupProducts.find(x => x.topMin <= e.scrollTop && e.scrollTop <= x.topMax);
			if(selectProductTypeItem){
				let selectTypeItem = this.productTypeInfos.find(x => x.id == selectProductTypeItem.productTypeGUID);
				this.onSelctItem(selectTypeItem,true);
			}
		}
	},
	async onLoad(option) {
		await getApp().globalData.verifyAu(); // 验证权限获取用户信息
		if (!option.scene) {
			//门店详情点击线上商城进来
			this.storeId = option.storeId;
		} else {
			// 二维码需要请求后端拿到对应团长数据和门店
			let data = {
				id: option.scene //配送员id
			};
			let res = await WMSendPeople.GetSendPeopleViewDto(data)
			this.sendPeopleInfo = res;
			this.storeId = res.buUnitGUID;
		}
		if (option.shareOpenId) {
			this.orderShareOpenId = option.shareOpenId;
		}

		let data = {
			storeID: this.storeId, //门店id
		}
		this.getCompanyUserInfo(data); //获取门店信息
		this.getAllProductAndMsItem(); //获取门店产品和秒杀Item
		
		// 加入最后页面缓存
		getApp().globalData.lastInUrlObj.saveLastInUrl();
	},
	async onShow(){
		if(this.storeId){
			let result = await MSActiveConfig.GetShopMSActiveList({
				storeId: this.storeId
			}, null,null, false);
			this.msItems = result.shopMSActiveItems;
		}
	},
	// 通用分享
	onShareAppMessage(){
		return getApp().globalData.shareObj.getNormalShare();
	},
	methods: {
		//菜单类型组件点击回调
		onSelctItem(selectTypeItem,isNotScroll) {
			this.selectproductTypeItem = selectTypeItem;
			// 同步刷新选中的item
			this.$refs.productTypeX && (this.$refs.productTypeX.setSelectItem(selectTypeItem));
			this.$refs.productType && (this.$refs.productType.setSelectItem(selectTypeItem));

			// 找到这一个类别距离顶部距离
			let topMin = this.currentGroupProducts.find(x => x.productTypeGUID == selectTypeItem.id).topMin;
			
			if(!isNotScroll){
				// 滚动到菜单
				uni.pageScrollTo({
					scrollTop: topMin+5,
					duration: 200
				});
			}
			
		},
		//获取门店的所有产品类型及产品
		async getAllProductAndMsItem() {
			let data = {
				storeID: this.storeId //门店id
			};
			let rdata = await WMProduct.GetAllProductTypeAndProInfo(data);
			this.productTypeInfos = rdata.wMlProductTypeInfos; // 产品类型
			this.selectproductTypeItem = rdata.wMlProductTypeInfos[0]; // 绑定默认的选中
			this.productInfos = rdata.wMlProductInfos;

			// 获取秒杀 这里 写后面是因为 要获取页面整体高度 做顶部展示 不能两个都异步
			let result = await MSActiveConfig.GetShopMSActiveList({
				storeId: this.storeId
			});
			this.msItems = result.shopMSActiveItems;

			// 算页面高度
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query.select('#ProductTypeMenu').boundingClientRect(data => {
					this.topProductHeight = data.top + data.height;
				}).exec();

				this.$refs.YytFoodMenu && this.$refs.YytFoodMenu._onGetProductTypeTop();
			})
		},
		//获取企业信息
		async getCompanyUserInfo(data) {
			let rdata = await WMSendPeople.GetSendCompanyUserInfo(data);
			this.conmpanyInfo = rdata.wmConmpanyInfo;
			uni.setNavigationBarTitle({
				title: this.fullShopName
			});
			this.conmpanyInfo.imgUrl = getApp().globalData.PicDomain + this.conmpanyInfo.imgUrl;

			let shoppinglineInfo = { //缓存店名 和运费 等
				isQRcode: this.sendPeopleInfo.id ? true : false, //是否是二维码进来
				shopName: this.fullShopName, //店名
				businessName: this.conmpanyInfo.businessName,
				storeName: this.conmpanyInfo.branchName,
				compnayName: this.conmpanyInfo.compnayName, //企业名
				storeId: this.storeId, //门店id
				logo: this.conmpanyInfo.logo, //店铺logo
				shopImg: this.conmpanyInfo.imgUrl, //店铺pic
				freight: this.conmpanyInfo.orderTransAmount ,//运费 默认为0
				isEnableSelf:this.conmpanyInfo.isEnableSelf,
			};
			if (shoppinglineInfo.isQRcode) {
				shoppinglineInfo.orderShareOpenId = this.orderShareOpenId;
				shoppinglineInfo.sendPeopleGUID = this.sendPeopleInfo.id; //配送人id
				shoppinglineInfo.freight=this.sendPeopleInfo.sendOrderTransAmount;
			}

			// 缓存门店信息 用于支付使用
			this.$storage.setShoppinglineInfo(shoppinglineInfo);
		},
		// 跳转选择区域
		goArea() {
			uni.navigateTo({
				url: `/pages/indexSub/otherAreas/otherAreas?id=${this.sendPeopleInfo.id}&storeid=${this.storeId}`,
			});
			this.isShowPop = false;
		},
		// 跳转门店
		goStore() {
			uni.navigateTo({
				url: `/pages/indexSub/shopIntroduce/shopIntroduce?id=${this.storeId}`,
			});

			this.isShowPop = false;
		},
		//  获取产品类型距离顶部高度
		onGetProductTypeTop(productTypeItem) {
			// 生成每个类别对应导航栏的距离 要减去产品类型的高度
			let typeItem = this.currentGroupProducts.find(x => x.productTypeGUID == productTypeItem.productTypeGUID);
			typeItem.topMin = productTypeItem.topMin;

			// 计算topMax topmax就是后一个topmin
			this.currentGroupProducts.forEach((item, index) => {
				if (index != this.currentGroupProducts.length - 1) {
					item.topMax = this.currentGroupProducts[index + 1].topMin + 1;
				} else {
					item.topMax = 9999;
				}
			});
		}
	},
	computed: {
		// 当前类型下的产品
		currentGroupProducts() {
			let grpupProducts = [{
				productTypeGUID: '',
				productTypeName: '',
				topMin: 0, // 该类别顶部距离
				topMax: 0, // 改类别顶部结束距离
				productList: [] // 该类别下的产品
			}]; // 产品分组对象 topMin TopMax控制滚动定位
			
			// 根据产品类型进行分组处理 传给菜单组件
			grpupProducts =this._(this.productTypeInfos).map(typeItem=>{
				return {
					productTypeGUID: typeItem.id,
					productTypeName: typeItem.productTypeName,
					topMin: 0,
					topMax: 0,
					productList: this.productInfos.filter(x=>x.productTypeGUID== typeItem.id)
				}
			}).value();
			return grpupProducts;
		},
		// 门店全称
		fullShopName() {
			return this.conmpanyInfo.compnayName ? this.conmpanyInfo.compnayName + '(' + this.conmpanyInfo.branchName + ')' : '';
		},
		// 团长配送的姓名 没有就门店
		sendPeopleName() {
			return this.sendPeopleInfo.sendPeopleName || this.conmpanyInfo.branchName || ''
		},
		// 头像 有配送员的显示配送员 没有显示门店
		sendPeoplePicUrl() {
			return this.sendPeopleInfo.headImg || this.conmpanyInfo.imgUrl || ''
		},
		// 弹窗的数据
		shopStoreDetail() {
			let shopStoreDetail = {
				sendPeopleName: '',
				sendPeoplePhone: '',
				sendPeopleArea: '',
				headImgUrl: '',
				noticeRemark: '',
				storeName: '',
				storePhone: '',
				storeImgUrl: ''
			};
			shopStoreDetail.sendPeopleName = this.sendPeopleInfo.sendPeopleName;
			shopStoreDetail.sendPeoplePhone = this.sendPeopleInfo.sendPeoplePhone;
			shopStoreDetail.sendPeopleArea = this.sendPeopleInfo.sendPeopleArea;
			shopStoreDetail.headImgUrl = this.sendPeopleInfo.headImg;
			shopStoreDetail.noticeRemark = this.sendPeopleInfo.sendPeoplePhone ? this.sendPeopleInfo.sendPeopleRemark : this.conmpanyInfo
				.storePushTip;
			shopStoreDetail.storeName = this.conmpanyInfo.branchName;
			shopStoreDetail.storePhone = this.conmpanyInfo.telephone;
			shopStoreDetail.storeImgUrl = this.conmpanyInfo.imgUrl;

			return shopStoreDetail;
		},
		// 通知组件文字
		contentList() {
			let list = [];
			// 展示团长信息
			if (!this._.isEmpty(this.sendPeopleInfo)) {
				// list.push(`已有${this.sendPeopleInfo.orderPeopleImgList.length}人参与,满20人即可成团`);
				list.push(this.sendPeopleInfo.sendPeopleName + "       " + this.sendPeopleInfo.sendPeoplePhone);
				list.push(this.sendPeopleInfo.sendPeopleRemark);
			} else if (!this._.isEmpty(this.conmpanyInfo)) {
				// 展示门店信息
				if(this.conmpanyInfo.branchName){
					list.push(`${this.conmpanyInfo.branchName}    ${this.conmpanyInfo.telephone}`);
				}
				list.push(this.conmpanyInfo.storePushTip && this.conmpanyInfo.storePushTip.replace(/<\/?.+?>/g, ""));
			}
			
			// 过滤null值
			list = list.filter(x => x);
			return list;
		},
		// 通知组件右边内容
		orderPeopleImgList() {
			if (!this._.isEmpty(this.sendPeopleInfo)) {
				return this.sendPeopleInfo.orderPeopleImgList;
			}
		}
	},
}
