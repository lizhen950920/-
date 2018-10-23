// pages/Utopia/Index.js
var httpUtil = require("../../common/httpUtil.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    check:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //parentUid.
    var that = this;
    var parentUid = decodeURIComponent(options.scene);
    console.log("scene:" + parentUid);
    if (parentUid) {
      that.setData({
        pid: parentUid,
      })
    }
    //获取要求人数并解锁相关奖励
    var that = this;
    var uid = wx.getStorageSync('uid');
    httpUtil.signUpNum({ uid: uid }, function (res) {
    
      that.setData({
        num: res.data.num,
        cert: res.data.cert,
      })
    })
  },
  checkbox: function (e) {
    if (e.detail.value == '1') {
      this.setData({
        check: 1,
      });
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  onInvitResult: function(){
    wx.navigateTo({
      url: '/pages/Utopia/InvitResult',
    })
  },
  onInvitResult5: function () {
    var that = this;
    var uid = wx.getStorageSync('uid');
    httpUtil.signUpNum({ uid: uid }, function (res) {
      let num = res.data.num
      if (num > 5) {
        wx.navigateTo({
          url: '/pages/Utopia/InvitResult',
        })
      }
      else {
        wx.showModal({
          title: '提示',
          content: '邀请的好友还没达到五个哦，继续加油',
          showCancel: false,
        })
      }
     
    })
    
  },
  onInvitResult10: function () {
    var that = this;
    var uid = wx.getStorageSync('uid');
    httpUtil.signUpNum({ uid: uid }, function (res) {
      let num = res.data.num
      if (num > 10) {
        wx.navigateTo({
          url: '/pages/Utopia/InvitResult',
        })
      }
      else {
        wx.showModal({
          title: '提示',
          content: '邀请的好友还没达到10个哦，继续加油',
          showCancel: false,
        })
      }

    })

  },
  onInvitResult20: function () {
    var that = this;
    var uid = wx.getStorageSync('uid');
    httpUtil.signUpNum({ uid: uid }, function (res) {
      let num = res.data.num
      if (num > 20) {
        wx.navigateTo({
          url: '/pages/Utopia/InvitResult',
        })
      }
      else {
        wx.showModal({
          title: '提示',
          content: '邀请的好友还没达到20个哦，继续加油',
          showCancel: false,
        })
      }

    })

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 详细规则
   */
  toRule: function(){
    wx.navigateTo({
      url: '/pages/Utopia/Rule',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onBasicInfo:function(){
    var that = this;
    if (that.data.check == 0){
      wx.showToast({
        title: '请详细阅读活动规则',
      })
      return;
    }
    var pid = this.data.pid;
    wx.navigateTo({
      url: '/pages/Utopia/BasicInfo?pid='+pid,
    })
  }
})