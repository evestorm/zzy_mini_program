// 引入uni自定义导航栏
import YHBanquetTask from '@/service/YH/YHBanquetTaskAppService.js'; //获取任务详情
import YHClueFileManage from '@/service/YH/YHClueFileManageAppService.js';
import YHBanquetHistoryLog from '@/service/YH/YHBanquetHistoryLogAppService.js';
export default {
	data() {
		return {
			isFiststShow:true,//控制第一次进入请求接口显示加载loading，onshow不显示loading
			id: '', //任务详情id
			userInfo: {}, //测试 当前用户信息
			userName: '', //登陆人姓名
			userId: '', //登陆人id
			taskDetail: {}, //页面显示任务详情
			viewYHClueFileManages: [], //文件列表
			imageList: [], //图片列表
			fileId: '', //图片id
		}
	},
	onLoad(option) {
		//获取任务详情id
		this.id = option.id;
		this.userName = option.orderCstName ||getApp().globalData.userInfo.nickName;//通过分享的没有姓名-上传图片没有姓名  取微信姓名
		this.userId = getApp().globalData.userInfo.id;
	},
	onShow() {
		this.getViewDto();
		this.isFiststShow=false;
		// uni.getStorageSync({//更改备注刷新页面
		// 	key:'isRefreshTaskDetail',
		// 	res=>{
		// 		console.log(res)
		// 		this.getViewDto();
		// 	}
		// })
	},
	
	methods: {
		// tapLeftFromNav() {
		// 	console.log('back')
		// 	uni.navigateBack({
		// 		url: `/pages/myOrderSub/banquetDetail/banquetDetail?banquetId=${this.taskDetail.banquetOrderGUID}`
		// 	});
		// },
		//删除提示框取消按钮
		cancel() {
			this.$refs.delPopup.close();
		},
		//删除提示框确认按钮 删除文件
		async confirm() {
			let res=await YHClueFileManage.DeleteByDto({id: this.fileId})
				this.$refs.delPopup.close();
				this.getViewDto();
				let logTime = this.$util.formatTime();
				let str = `操作了任务 ${logTime} 任务名称:${this.taskDetail.taskConfName},删除了图片 `
				this.createLogByDto(str);
		},
		delFile(id) { //点击删除文件图标事件
			this.$refs.delPopup.open();
			this.fileId = id;
		},
		goPageEvaluate() { //跳转备注页面
			let banquetTaskRemark = this.taskDetail.cstRemark == null || this.taskDetail.cstRemark == undefined ? '' : this.taskDetail
				.cstRemark;
			uni.navigateTo({
				url: `/pages/myOrderSub/evaluate/evaluate?id=${this.taskDetail.id}&banquetTaskRemark=${banquetTaskRemark}`
			})
		},
		upBottomPopup() { //打开底部popup
			this.$refs.projPopupRef.open();
		},
		//popup 相机
		selCamera() {
			let imgType = ['camera'];
			this.upLoadImg(imgType);
		},
		//popup 相册
		selAlbum() {
			let imgType = ['album'];
			this.upLoadImg(imgType);
		},
		//popup 取消
		closeProjPopup() {
			this.$refs.projPopupRef.close();
		},

		async upLoadImg(imgType) { //底部上传图片
			let [error, chooseImageRes] = await uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: imgType //从相册选择
			})
			// 临时文件列表
			const tempFilePaths = chooseImageRes.tempFiles;
			console.log('tempFilePaths', tempFilePaths)
			// 上传的路径
			let changeImgUrl = tempFilePaths[0].path;
			let imgSize = (tempFilePaths[0].size / 1048576).toFixed(2);
			let data = {
				banquetTaskGUID: this.taskDetail.id, //宴会任务GUID(YH_BanquetTask)
				// clueFileUrl:"",//文件路径(上传文件)
				uploadRoleType: 1, //上传人角色(1,客服经理;2,客户)
				clueFileSize: imgSize, //文件大小M
				clueFileType: 1, //文件类型(1,图片;2,文件)
				createdName: this.userName, //登陆人
				createGUID: this.userId, //登陆人id
				createdRemark: `IMG_${new Date().getFullYear()}_${Math.ceil(Math.random()*100)}`, //上传人文件描述 名字
			}
			let [err, res] = await uni.uploadFile({
				url: 'https://pic.cwyyt.cn', //仅为示例，非真实的接口地址
				fileType: 'image',
				filePath: changeImgUrl,
				name: 'file'
			})
			let path = JSON.parse(res.data).path;
			changeImgUrl = `https://pic.cwyyt.cn${path}`;
			data.clueFileUrl = changeImgUrl;
			//创建记录
			this.createByDto(data);
			this.$refs.projPopupRef.close();
		},
		previewImage(img) { //放大图片
			uni.previewImage({
				current: img,
				urls: this.imageList,
				indicator: 'default'
			})
		},
		async getViewDto() { //获取任务详情
			let res = await YHBanquetTask.GetViewDto({
				id: this.id
			},null,null,this.isFiststShow)
			res = this.$util.null2str(res);
			let imgArr = [];
			this.taskDetail = res;
			this.viewYHClueFileManages = res.viewYHClueFileManages;
			let str = this.taskDetail.banquetTaskExecutorNames;
			str = this.taskDetail.banquetTaskExecutorNames == null ? '' : str.length > 20 ? str.slice(0, 20) + '...' : str, //更改执行人
				this.taskDetail.banquetTaskExecutorNames = str;
			//更新图片列表 用于放大图片
			this._(this.viewYHClueFileManages).forEach(item => {
				if (item.clueFileType == 1) {
					imgArr.push(item.clueFileUrl)
				}
			})
			this.imageList = imgArr;
		},
		//创建操作日志=删除图片
		async createLogByDto(str) {
			let logData = {
				banquetOrderGUID: this.taskDetail.banquetOrderGUID, //宴会单GUID(YH_BanquetOrder)
				operatorName: this.userName, //操作人
				orderHistoryLogContent: str, //描述
			}
			await YHBanquetHistoryLog.CreateByDto(logData);
		},
		//创建图片文件记录
		async createByDto(data) {
			let res = await YHClueFileManage.CreateByDto(data);
			this.getViewDto();
		}
	}
}
