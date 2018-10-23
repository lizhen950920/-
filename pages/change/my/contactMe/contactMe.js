// pages/change/my/contactMe/contactMe.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wechat:"qinsongxuexi",
    ecro:"http://admin.xxpeople.com/upload/12.jpg"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  previewImg: function (e) {
   
    var current = "http://admin.xxpeople.com/upload/12.jpg"
    var urls = "http://admin.xxpeople.com/upload/12.jpg"
    wx.previewImage({
      current: "", // 当前显示图片的http链接
      urls: [this.data.ecro], // 需要预览的图片http链接列表
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
  
  },
  //一键复制
  copy: function (e) {
    var wechat = "qinsongxuexi";
    wx.setClipboardData({
      data: wechat,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
})