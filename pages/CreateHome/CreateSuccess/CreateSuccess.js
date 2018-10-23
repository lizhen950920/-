// CreateSuccess.js
var util = require("../../../common/httpUtil.js");
var app = getApp();

var timestamp = Date.parse(new Date()) / 1000;


Page({
  /**
   * 页面的初始数据
   */
  data: {
    home: "",
    userInfo: "",
    uid: "",
    homeUid:"",
    id: "",
    img: "",
    show:true,
    time:0,
  },
  // 这里是代码
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
   
    
    var id = options.id || 534;
    var homeUid = options.homeUid||3;
    // var that = this;
    that.setData({
      userInfo: getApp().globalData.userInfo,
      uid: wx.getStorageSync('uid'),
      homeUid: homeUid,
      id:id,
    });
    console.log(id);
    //加载提示框
    // util.showLoading();
    var params = {
      uid: homeUid,
      id: id,
    };
    util.myhomeDetail(params, function (res) {
      var tmpHome = res.data;
      tmpHome.creatSuccess = true;
      that.setData({
        home: tmpHome,
      });
      setTimeout(function () {
        util.hideToast();
      }, 1000);
    });
  },

  onShow:function(e){
    console.log(e.timeStamp,this.data.time);
    if(e.timeStamp - this.data.time > 2000){
      this.setData({
        show:false,
      });
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    this.setData({
      time : e.timeStamp,
    });
  },  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that =this;
    return {
      title: "新新人类乐园，创我想要的世界",
      path: "/pages/User/MyLdealHome/LdealHome/LdealHome?id=" + that.data.id + "&uid=" + that.data.homeUid,
    }
  },
})