export default {
  data() {
    return {
      memberRules: {
        title: '注册即可成为双湖园会员，获得电子会员卡一张。会员可参加互动活动或购物获取会员积分并根据会员积分升级会员级别',
        content: '内容区域'
      }
    };
  },

  components: {},
  props: {},
  onLoad(options) {},
  onShow() {},
  methods: {
    setData(obj) {
      let that = this;
      let keys = [];
      let val, data;
      Object.keys(obj).forEach(key=>{
        keys = key.split('.');
        val = obj[key];
        data = that.$data;
        keys.forEach((key2, index)=>{
          if (index + 1 == keys.length) {
            that.$set(data, key2, val);
          } else {
            if (!data[key2]) {
              that.$set(data, key2, {});
            }
          }

          data = data[key2];
        });
      });
    }
  }
};