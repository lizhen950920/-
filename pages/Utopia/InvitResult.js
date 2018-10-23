// pages/Utopia/InvitResult.js
var httpUtil = require("../../common/httpUtil.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var uid = wx.getStorageSync('uid');
    httpUtil.getInvations({uid:uid},function(res){
      console.log("getInvations:"+res.data);
      that.setData({
        users: res.data.users,
        ercode: res.data.ercode == null ? "/img/utopia/u70.jpg" : res.data.ercode,
      })
    })
  },
  onInvation:function(){
    wx.navigateTo({
      url: '/pages/Utopia/Invitation',
    })

  },
  onCopy:function(){
    wx.setClipboardData({
      data: 'qingsongxuexi',
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000,
        })
      }
    })
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
  
  }
})