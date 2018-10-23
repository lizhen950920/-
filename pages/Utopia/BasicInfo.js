// pages/Utopia/BasicInfo.js
// setuserhomepage.js
var httpUtil = require("../../common/httpUtil.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:"",
    marryArray: [
      { 'id': '1', 'name': '单身',  },
      { 'id': '2', 'name': '婚恋',  },
      { 'id': '3', 'name': '保密',  },
    ],
    marryIndex: 0,
    marryId: 1,
    birthday:"",
    constellationArray: [{
      'id': '1',
      'name': '白羊座'
    }, {
      'id': '2',
      'name': '金牛座'
    }, {
      'id': '3',
      'name': '双子座'
    }, {
      'id': '4',
      'name': '巨蟹座'
    }, {
      'id': '5',
      'name': '狮子座'
    }, {
      'id': '6',
      'name': '处女座'
    }, {
      'id': '7',
      'name': '天秤座'
    }, {
      'id': '8',
      'name': '天蝎座'
    }, {
      'id': '9',
      'name': '射手座'
    }, {
      'id': '10',
      'name': '魔羯座'
    }, {
      'id': '11',
      'name': '水瓶座'
    }, {
      'id': '12',
      'name': '双鱼座'
    },],
    constellationIndex: 0,
    constellationId: 1,
  },
  bindFeelChange: function (e) {
    this.setData({
      marryIndex: e.detail.value,
      marryId: this.data.feelArray[e.detail.value].id,
    });
  },

  //时间选择
  bindBirthdayChange: function (e) {
    var that = this;
    //根据生日推算出年龄
    var birth = e.detail.value;
    var birthDate = new Date(birth);
    var age = new Date().getFullYear() - birthDate.getFullYear()

    //计算星座
    var constellation = that.getAstro(birthDate.getMonth() + 1, birthDate.getDate());
    console.log("星座：" + constellation);
    var index = that.data.constellationArray.findIndex(function (item) {
      return item.name.indexOf(constellation) != -1;
    });
    
    var obj = that.data.constellationArray[index];
    this.setData({
      birth: birth,
      age: age,
      constellationIndex: index,
      constellationId: obj.id,
    })
  },
  getAstro: function (m, d) {
    return "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯".substr(m * 2 - (d < "102223444433".charAt(m - 1) - -19) * 2, 2);
  },
  inputMobileText:function(e){
    this.setData({ mobile: e.detail.value})
  },
  inputWechatText: function (e) {
    this.setData({ wechat: e.detail.value })
  },
  inputDream_homeText: function (e) {
    this.setData({ info: e.detail.value })
  },
  inputProfessionText: function (e) {
    this.setData({ profession: e.detail.value })
  },
  inputUniversityStrText: function (e) {
    this.setData({ universityStr: e.detail.value })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let that = this;
    var pid = options.pid;
 
        that.setData({
          userInfo: wx.getStorageSync('userInfo')
        })
      
    that.setData({
      userInfo: getApp().globalData.userInfo,
      pid : pid,
    })
    var uid = wx.getStorageSync('uid');
    if (!uid || uid == "") {
      wx.navigateTo({
        url: '/pages/User/Login/Login',
      })
      return;
    }
    //加载用户数据
    httpUtil.showLoading();
    console.log("uid={}", uid);
    httpUtil.getUser({ uid: uid }, function (data) {
      console.log("getUser:{}", data.data);
      httpUtil.hideToast();
      if (data.code === 200) {
        that.setData({
          user: data.data,
          uid: data.data.id,
          marryIndex: !data.data.marry ? 0 : parseInt(data.data.marry) - 1,
          constellationIndex: !data.data.constellation ? 0 : parseInt(data.data.constellation) - 1,
          constellationId: data.data.constellation,
          birth: data.data.birth,
          age: data.data.age,
          mobile:data.data.mobile,
          wechat:data.data.wechat,
          profession: data.data.profession,
          universityStr: data.data.universityStr,
          info: data.data.info,
        });
      } else {
        console.log(data.message);
      }
    });
  },

  
  onNext:function(){
    var that = this;
    var data = that.data;
    if (!data.birth) {
      httpUtil.alertShow(this, "cancel", "生日不能为空");
      return;
    }
    if (!data.universityStr) {
      httpUtil.alertShow(this, "cancel", "职业不能为空");
      return;
    }
    if (!data.profession) {
      httpUtil.alertShow(this, "cancel", "职业不能为空");
      return;
    }

    if (!data.wechat) {
      httpUtil.alertShow(this, "cancel", "微信号不能为空");
      return;
    }
    // if (!data.mobile) {
    //   httpUtil.alertShow(this, "cancel", "手机号不能为空");
    //   return;
    // }
    // if (!data.info) {
    //   httpUtil.alertShow(this, "cancel", "个人简介不能为空");
    //   return;
    // }

    var userData={};
    userData.id=that.data.uid;
    userData.info = that.data.info;
    userData.mobile = that.data.mobile;
    userData.wechat = that.data.wechat;
    userData.universityStr = that.data.universityStr;
    userData.profession = that.data.profession;
    userData.birth = that.data.birth;
    userData.marry = that.data.marryId;
    userData.constellation = that.data.constellationId;
    userData.age = that.data.age;
    userData.pid = that.data.pid;
    userData.cert = 1; //报名成功

    httpUtil.userEdit(userData, function (res) {
      if (res.code === -1) {
        httpUtil.alertShow(that, "cancel", "美好的新人，你还有必填选项没有填哦");
        return;
      } else {
        httpUtil.alertShow(that, "success", res.message);
        wx.navigateTo({
          url: '/pages/Utopia/Rentstate',
        })
      }
    });


    
  }
})