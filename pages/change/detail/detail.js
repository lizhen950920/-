// pages/change/detail/detail.js
var util = require("../../../common/httpUtil.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  detail:'',
  content:'',
  optionid:''
  },
  //获取输入的值
  Content: function (e) {
    console.log('e',e)
    let value = e.detail.value;
    this.setData({
      "detail": value
    })
  },
  formSubmit:function(e){
    var id = this.data.optionid
    console.log(id)
    console.log(e)
    var detail = e.detail.value.opinion
    console.log(detail)
    console.log(e.detail.value.opinion)
    if (detail == "") {
      wx.showModal({
        title: '提示',
        content: '详情不能为空!',
      })
      return false
    }
     wx.navigateTo({
      //  url: '/pages/change/first/first?infofrominput=' + detail + '&id=' + id ,
       url: '/pages/change/havehouse/havehouse?infofrominput=' + detail + '&id=' + id,
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var content = options.content;
    var id = options.id;
    console.log('id',id)
    this.setData({
      content: content,
      optionid: id
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