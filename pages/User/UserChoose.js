var httpUtil = require("../../common/httpUtil.js");
// pages/User/UserChoose.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [
      { name: '1', value: '我是新人，来找室友和房子共建梦想之家', checked: 'true' },
      { name: '2', value: '我是来转租房子的，给新人助力' },
      { name: '3', value: '我是地地道道的房东，我想提供房子给新人创美家' },

    ],
    choose:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var choose = 1;
    if (options.choose == 0){
      choose = 1
    }else{
      choose = options.choose || 1;
    }
    this.setData({
      choose: choose,
    });
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
  listenerRadioGroup:function(e){
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      choose: e.detail.value,
    });
  },
  //下一步
  nextStep:function(e){
    var that = this;

    //保存是否已点击过
    wx.setStorageSync("userIdChoose", that.data.choose);
    var uid = wx.getStorageSync("uid");
    //更新用户逇身份类型
    httpUtil.userEdit({id:uid,choose:that.data.choose}, function (res) {
      if (res.code != 200){
        wx.showModal({
          title: '提示',
          content: '服务器内部错误,请联系客服.',
          showCancel:false
        })
        return;
      }
      if (that.data.choose == 1){
          //用户选择这个则跳转到新人个人资料编辑页面
          wx.navigateTo({
            url: '/pages/User/MyHome/personaldata/personaldata?id=' + uid,
          })
      } else if (that.data.choose == 2){
          //选择这个点击下一步后跳转到新人转租客个人资料编辑页
          wx.navigateTo({
            url: '/pages/User/MyHome/personaldata/personaldata?id=' + uid,
          })
      } else if (that.data.choose == 3){
          //跳转到房东个人资料编辑页面
          wx.navigateTo({
            url: '/pages/User/HouseOwner/InfoEdit?id=' + uid,
          })
      }
    });
  }
})