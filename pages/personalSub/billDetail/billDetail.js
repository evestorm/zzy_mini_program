import HY12 from '@/service/HY/HY12AppService.js';
import util from '@/common/util.js'

const feeType = [ // 账单类型
	{
		id: '0',
		name: '全部'
	},
	{
		id: '1',
		name: '消费'
	},
	{
		id: '2',
		name: '返现'
	},
	{
		id: '3',
		name: '充值'
	},
	{
		id: '4',
		name: '提现'
	},
];

export default {
	data() {
		return {
			hyFeeChgID: '', // 订单id
			info: {
				bookNums: 0, // 消费人数
				bookOrderTypeName: '', // 订单类型
				businessName: '', // 店名
				changesAmount: '', // '金额变动'
				chgTime: '', // 时间(消费，操作)
				diningTypeName: '', // 餐别
				feeChgType: 1, // 变动类型 (用来获取 订单类型的 不用管)
				feeType: 1, // 账单类型 (0,全部 1,消费 2,返现 3,充值 4,提现)
				hyFeeChgID: '', // 订单主键
				oldValue: 0, // 增加金额(返现 充值 不用管 看changesAmount)
				takeMoneyAmount: 0, // 提现金额
				takeMoneyIsSuccess: 0, // 是否到账
				takeMoneyTime: null, // 申请时间
				takeMoneyToTime: null, // 到账时间
				takeRealAmount: 0, // 实付金额
			},
			list: [], // 测试用，临时获取账单列表
			feeType: feeType, // 账单类型
		};
	},
	computed: {
		header() { // 头部左边标题和描述
			let desc = '',
				descColor = '#595959'; // 默认描述为空且默认描述颜色为灰色
			let typeName = feeType[this.info.feeType].name;
			if (typeName === '消费') {
				desc = this.info.businessName;
			} else if (typeName === '提现') {
				typeName = '提现至';
				desc = '微信钱包'; // 目前写死，只能提现至微信钱包
				descColor = '#595959';
			} else if (typeName === '返现') {
				desc = this.info.businessName;
			}
			return {
				typeName, // header标题
				desc, // header描述
				descColor // 描述字体颜色
			}
		},
	},
	filters: {
		formatChangesAmount(val) {
			const isPos = val > 0;
			if (isPos) {
				return '+' + val;
			} else {
				return val;
			}
		},
		formatPrice(val) {
			const num = parseFloat(val) || 0;
			return util.formatNum(val, 2);
		}
	},
	onLoad(payload) {
		uni.setNavigationBarTitle({
			title: '账单详情'
		});
		// this.requestList();
		// TODO: 接受账单id
		this.hyFeeChgID = payload.hyFeeChgID;
		// this.hyFeeChgID = "HYLOG8702600000635";
		this.requestDetail();
	},
	methods: {
		async requestDetail() {
			const data = {
				hyFeeChgID: this.hyFeeChgID,
			}
			let result=await HY12.GetBalanceInfo(data);
			if(result){
				console.log(result.balanceInfo);
				// const info = result.balanceInfo[0];
				// // 实际提现得到的钱
				// info.payload = info.payload || 4;
				// info.chgValue = 10;
				// info.feeType = 4;
				this.info = result.balanceInfo[0];
			};
		},
		// 请求账单列表（测试用）
		async requestList() {
			const data = {
				// "hyFeeChgID":"null",
				'hyUserCardID': 'HY0700000330',
				'feeType': 0, // (0,全部 1,消费 2,返现 3,充值 4,提现)
				'date': '2019-07-21 00:00:00',
				'pageSise': 1000,
				'pageIndex': 1
			}
			const obj = {
				xiaofei: [],
				fanxian: [],
				chongzhi: [],
				tixian: [],
			};
			let result=await HY12.GetBalanceInfo(data)
			if(result){
				console.log(result);
				result.balanceInfo.forEach(v => {
					switch (v.feeType) {
						case 1: // 消费
							obj.xiaofei.push(v);
							break;
						case 2: // 返现
							obj.fanxian.push(v);
							break;
						case 3: // 充值
							obj.chongzhi.push(v);
							break;
						case 4: // 提现
							obj.tixian.push(v);
							break;
						default:
							break;
					}
				});
				this.info = obj.xiaofei[0];
				console.log(this.info);
			}
		}
	}
}
