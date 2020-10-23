// 作者:李彦熹
export default {
	name: 'yyt-dialog-detail',
	// 注册属性
	props: {
		//是否是团长
		isSendPeople: {
			type: Boolean,
			default: true
		},
		//是否显示对话框
		isShowDialog: {
			type: Boolean,
			default: false
		},
		//数据信息
		shopStoreDetail: {
			type: Object,
			default: () => {
				return {
					sendPeopleName: '王大川',
					sendPeoplePhone: '15857122573',
					sendPeopleArea: '格林郡社区',
					headImgUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKqSwPrp34qsTyrXkdZqkL2WN5PZ0nYPu8Mk3ibvHA2cicBW2KEdyibB2Vbp6VT2lnDbWFPRcDf9ZJOg/132',
					noticeRemark: '近日，瑞士最重要的海报比赛瑞士海报奖公布了年度 最佳海报设计的获奖名单。哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
					storeName: '双湖园',
					storePhone: '027-81898087',
					storeImgUrl: 'https://pic.cwyyt.cn/upload/yyticons/1659345934_eg-head-img.png'
				}
			}
		},
		//区域点击事件
		onAreaClick: {
			type: Function,
			default: () => {

			}
		},
		//关闭事件
		onClose: {
			type: Function,
			default: () => {

			}
		},
		//门店跳转事件
		onStoreRedirectTo: {
			type: Function,
			default: () => {

			}
		}
	},
	data() {
		return {

		};
	},
	methods: {
		//区域点击事件
		_onAreaClick() {
			this.$emit('onAreaClick');
		},
		//关闭事件
		_onClose() {
			this.$emit('onClose');
		},
		//门店跳转
		_onStoreRedirectTo() {
			this.$emit('onStoreRedirectTo');
		}
	}
};
