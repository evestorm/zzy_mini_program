import YHBanquetTask from '@/service/YH/YHBanquetTaskAppService.js';

export default {
	data() {
		return {
			title: '填写' ,// 页面的title
			data:{
				id:'E21E5103-BFE8-4CF4-47D0-08D7959ABA81',
				cstRemark:''
			}
		};
	},
	// 页面加载事件
	onLoad(option) {
        if(option.id)
          {
          	 this.data.id=option.id;
			 this.data.cstRemark=option.banquetTaskRemark;
          }
         	//this.getdata();
	},
	methods: {
	async getdata(){
		let res=await YHBanquetTask.GetViewDto(this.data)
		 if(res){
		 res= this.$util.null2str(res);
		 this.data=res;
		 this.data.cstRemark=res.banquetTaskRemark;
		 }
	},
	async updateFile(){
		let res=await YHBanquetTask.UpdateByDto(this.data);
		 if(res){
		 		uni.navigateBack({
		 			delta:1
		 		});	
		 }
		
	 }
	},
	filters: {
		//parseScene: function (value) {
		// return value+'123';
		//}
	},
	watch: {
		//"currentStore.storeId": {
		//    handler: function (val, oldval) {
		//        if (val) {
		//            vmDivItem1.$options.methods.getMonthSummaryData.bind(vmDivItem1)(1, val);
		//            vmDivItem3.$options.methods.getTodyBookData.bind(vmDivItem3)(1, val);
		//        }
		//    }
		//}
	}
	// ## 方法
};
