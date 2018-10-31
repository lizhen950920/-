var httpUtil = require("../../common/httpUtil.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: "",
    uid: "",
    user: "",
    code: "http://api.xxpeople.com/upload/13.jpg",
    count: 0, //count数据的准备，一开始是0，不显示
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onShow: function() {

    var userInfo = wx.getStorageSync('userInfo');
    var uid = wx.getStorageSync('uid');
    var that = this;
    that.setData({
      userInfo: userInfo,
      uid: uid,
    });
    if (!uid) {
      console.log("未登录");
      return;
    }
    //this.toLogin(uid);
    //获取未读消息
    httpUtil.getWeiReadMessages(uid, function(data) {
      var count = data.data;
      that.setData({
        count: count
      });
    });
    //获取用户信息
    httpUtil.getUser({
      uid: uid
    }, function(data) {
      if (data.code === 200) {
        that.setData({
          user: data.data
        });

      } else {
        console.log(data.message);
      }
    });
    //授权

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    })
  },
  logout: function() {
    console.log("logout");
    wx.removeStorageSync("uid")
    wx.navigateTo({
      url: '/pages/User/Login/Login',
    })
  },
  rent: function() {
    // wx.navigateTo({
    //   url: '/pages/Utopia/Rentstate',
    // }
wx.showToast({
  title: '正在努力开发中',
  icon:'none',
  duration:2000,
})
  },
  new: function() {

    // wx.navigateTo({
    //   url: '/pages/Xinxin/list',
    // })
   wx.showToast({
     title: '正在努力开发中',
     icon:'none',
     duration:2000,
   })
  },

  //获取用户信息
  bindGetUserInfo: function(e) {
    var that = this
    var userInfo = e.detail.userInfo;
    console.log("userInfo:" + userInfo)
    wx.setStorageSync('userInfo', userInfo)
    that.setData({
      userInfo: e.detail.userInfo
    })
    if (e.detail.userInfo) {
      wx.navigateTo({
        url: '/pages/User/Login/Login',
      })
      //用户按了允许授权按钮
      // that.getPhoneNumber(e);
    } else {

    }

  },
  previewImg: function(e) {
    var current = "http://api.xxpeople.com/upload/13.jpg"
    var urls = "http://api.xxpeople.com/upload/13.jpg"
    wx.previewImage({
      current: "", // 当前显示图片的http链接
      urls: [this.data.code], // 需要预览的图片http链接列表
    })
    wx.getImageInfo({
      src: urls,
      success: function(res) {
        console.log(res.width)
        console.log(res.height)
      }
    })
  },
  //去用户的个人主页
  toUserInfoPage: function() {
    var that = this;
    var url = '/pages/User/MyHome/personaldata/personaldata?id=' + that.data.uid;
    wx.navigateTo({
      url: url,
    })
  },

})