
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var uid = wx.getStorageSync('uid');
    wx.getSystemInfo({
      success: function (res) {
        var width = res.windowHeight / 6 - 10;
        that.setData({
          uid: uid,
          imageWidth: width,
        });
      }
    });
  },
  switchSlider(e) {
    this.setData({
      'selectIndex': e.target.dataset.index
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
  house: function () {
    wx.navigateTo({
      // url: '/pages/change/first/first',
      url:'/pages/change/havehouse/havehouse'
    })
  },
  nohouse: function () {
    wx.navigateTo({
      url: '/pages/change/nohouse/nohouse',
    })
  },
})