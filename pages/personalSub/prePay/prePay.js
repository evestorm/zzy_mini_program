import HY07 from '@/service/HY/HY07AppService.js';
export default {
	data() {
		return {
			id: '',
			remark: '',
			hyPayOptionID: '',
			cardInfo: {},
			amount: [],
			amountItem: false
		};
	},
	onLoad(option) {
		this.id= option.id;
		this.getMemberCard(option.id);
	},

	methods: {
		splitNum(res) {
			if (!res.memberOf.cardImgUrl) {
				res.memberOf.cardImgUrl = 'https://pic.cwyyt.cn/upload/img/20200319/120912912_card-bj.png';
			} else {
				res.memberOf.cardImgUrl = res.memberOf.cardImgUrl;
			}

			if (!res.memberOf.cardLogoUrl) {
				res.memberOf.cardLogoUrl = 'https://pic.cwyyt.cn/upload/img/20200319/121504154_card-logo.png';
			} else {
				res.memberOf.cardLogoUrl = res.memberOf.cardLogoUrl;
			}

			let splitRule = [4, 4, 6, 5];
			let array = [];

			if (res.memberOf.hyUserCode) {
				for (let i = 0; i < splitRule.length; i++) {
					let curStr = res.memberOf.hyUserCode.substring(0, splitRule[i]);
					res.memberOf.hyUserCode = res.memberOf.hyUserCode.substring(splitRule[i]);
					array.push(curStr);
				}
			}
			res.memberOf.hyUserCode = array;
			const obj = res.memberOf;
			obj.id = res.id;
			obj.marketing = res.marketing;
			this.cardInfo= obj
		},

		async getMemberCard(id) {
			let data = {
				hyUserCardID: id
			};
			let res=await HY07.memberCardInfo(data);
			if (res && res.memberOf) {
				this.splitNum(res);
				this.getAmount(res.memberOf.hyCardID);
			}
		},

		async getAmount(id) {
			let data = {
				"pageIndex": 1,
				"pageSize": 999999,
				"order": "hyRealAmount asc",
				"filter": {
					"type": "and",
					"conditions": [{
						"attribute": "hyCardID",
						"datatype": "nvarchar",
						"operatoer": "eq",
						"value": id
					}]
				}
			};
			let res=await HY07.getAmount(data);
				if (res.dataList.length > 0) {
					res.dataList.forEach(item => {
						item.selected = false;
					});
					let outArray = [];
					for (let i = 0; i < 2; i++) {
						let array = [];
						array.push(res.dataList[i * 2] ? res.dataList[i * 2] : '');
						array.push('');
						array.push(res.dataList[i * 2 + 1] ? res.dataList[i * 2 + 1] : '');
						outArray.push(array);
					};
						this.amount= outArray;
				}
		},

		selectItem(e) {
			let amount = this.amount;
			let outIndex = e.currentTarget.dataset.outindex;
			let index = e.currentTarget.dataset.index;
			if ((index + 1) % 2 == 0) {
				return;
			}
			let boolean = amount[outIndex][index].selected;
			if (boolean) {
				return;
			} else {
				amount.forEach(item => {
					item.forEach(innerItem => {
						if (typeof innerItem.selected == 'boolean') {
							innerItem.selected = false;
						}
					});
				});
				// let amountItem = `amount[${outIndex}][${index}].selected`;
				amount[outIndex][index].selected = true;
				this.remark= amount[outIndex][index].hyPayOptionName;
				this.hyPayOptionID= amount[outIndex][index].hyPayOptionID;
				this.amount= amount;
			}
		},

		goPay() {
			let payAmount;
			let relAmount;
			this.amount.forEach(item => {
				item.forEach(innerItem => {
					if (typeof innerItem.selected == 'boolean') {
						if (innerItem.selected) {
							payAmount = innerItem.hyPayAmount;
							relAmount = innerItem.hyRealAmount;
						}
					}
				});
			}); 
			if (!relAmount || !payAmount) {
				uni.showToast({
					title: '请选择充值金额',
					icon: 'none',
					image: 'https://pic.cwyyt.cn/upload/img/20191105/2034303430_warning.png',
					duration: 3000
				});
				return;
			}
			let param = {
				redirectoUrl: "/pages/index/index",
				logo: this.cardInfo.cardLogoUrl == 'https://pic.cwyyt.cn/upload/yytBanner/img1.png' ? this.cardInfo.logoUrl : this
					.cardInfo.cardLogoUrl,
				comName: this.cardInfo.businessName,
				storeName: this.cardInfo.branchName,
				storeId: this.cardInfo.getStoreID,
				productName: this.cardInfo.hyCardTitle,
				remark: this.remark,
				productId: this.cardInfo.hyCardID,
				hyUserCardID: this.cardInfo.hyUserCardID,
				payAmount: payAmount,
				relAmount: relAmount,
				hyPayOptionID: this.hyPayOptionID
			};
			uni.redirectTo({
				url: `/pages/common/pay/pay?param=${JSON.stringify(param)}&type=6`
			});
		},
	}
};
