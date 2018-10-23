// pages/Utopia/Rentstate.js
var httpUtil = require("../../common/httpUtil.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    live: true,
    state: 1,
  },

  //改变房间
  onState: function (e) {
    var id = e.currentTarget.dataset.state;
    var that = this;
    if (id<3){
      that.setData({
        live:true,
        state: id,
      });
     console.log('id',1)
    }
  
    else{
      that.setData({
        live: false,
        state: id,
      });
      
    }
    
  },

  // inputtext: function (e) {
  //   var value = e.detail.value;
  //   this.setData({
  //     hope_roommate: value
  //   })
  // },
  inputtext2: function (e) {
    var value = e.detail.value;
    this.setData({
      rent_start: value
    })
  },
  inputtext3: function (e) {
    var value = e.detail.value;
    this.setData({
      hope_live: value
    })
  },

  //目的地地图选择
  chooseDest: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log("name:" + res.name);
        that.setData({
          selectedAddress: res.address,
          longitude: res.longitude,
          latitude: res.latitude,
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    httpUtil.showLoading();
    var uid = wx.getStorageSync('uid');
    console.log("uid={}", uid);
    httpUtil.getUser({ uid: uid }, function (data) {
      console.log("getUser:{}", data.data);
      httpUtil.hideToast();
      if (data.code === 200) {
        that.setData({
          user: data.data,
          uid: data.data.id,
          state: data.data.type,
          move_start: that.data.move_start,
          move_end: data.data.move_end,
          hope_roommate: data.data.hope_roommate,
          rent_start: data.data.rent_start,
          hope_live: data.data.hope_live,
          selectedAddress: data.data.address,
        });
      } else {
        console.log(data.message);
      }
    });
  },
  bindMoveChange: function (e) {
    var that = this;
    var moveDate = e.detail.value;
    var ctype = e.currentTarget.dataset.type
    var user = that.data.user;
    if (ctype == "1") {
      user.move_start = moveDate;
    } else {
      user.move_end = moveDate;
    }
    this.setData({
      user: user,
    })
  },
  formSubmit: function (e) {

    var that = this;
    var data = e.detail.value;
    console.log(data)

    if (!that.data.rent_start) {
      wx.showToast({
        title: '房租预算不能为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (!data.hope_roommate) {
      wx.showToast({
        title: '理想之家及室友还没填哦',
        icon: 'none',
        duration: 1000
      })
      return; 
    }
    var userData = {};
    userData.id = that.data.uid;
    userData.state = that.data.state;
    userData.hope_roommate = data.hope_roommate;
    userData.rent_start = that.data.rent_start;
    userData.hope_live = that.data.hope_live;
    // userData.longitude = that.data.longitude;
    // userData.latitude = that.data.latitude;
    userData.move_start = that.data.user.move_start;
    userData.move_end = that.data.user.move_end;
    userData.address = that.data.selectedAddress;
    httpUtil.userEdit(userData, function (res) {
      if (res.code === -1) {
        httpUtil.alertShow(that, "cancel", "美好的新人，你还有必填选项没有填哦");
        return;
      } else {
        httpUtil.alertShow(that, "success", res.message);
        wx.navigateTo({
          url: '/pages/Xinxin/list',
        })
      }
    });

    console.log('userData', userData)
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