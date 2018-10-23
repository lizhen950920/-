// pages/Xinxin/list.js
var util = require('../../../../common/httpUtil.js');
var loading = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList: [],
    searchCondition: {},
    needReload: true,
    areaName: "",
    lonlat: {},
    user:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var searchCondition = JSON.parse(options.searchCondition);
    console.log('searchCondition',searchCondition)
  this.setData({
    searchCondition: searchCondition
  })
  },

  //用户详情
  touserdetail: function (e) {
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '/pages/Xinxin/detail?uid=' + uid,
    })
  },

  //点击搜索输入框
  searchCondition: function () {
    wx.navigateTo({
      url: '/pages/Xinxin/search',
    })
  },

  //获取经纬度
  getLonLat: function (cb) {
    var that = this;
    if (JSON.stringify(that.data.lonlat) === "{}") {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          that.setData({
            lonlat: {
              longitude: res.longitude,
              latitude: res.latitude,
            }
          });
          cb(res);
        }
      });
    } else {
      cb(that.data.lonlat);
    }
  },

  //获取用户列表
  getUserList: function (params) {
    var that = this;
    loading = true;
    util.showLoading("加载中...");
    that.getLonLat(function (res) {
      var latitude = res.latitude
      var longitude = res.longitude

      //that.getAddress(longitude, latitude);

      params.longitude = longitude;
      params.latitude = latitude;
      util.getUserList(params, function (userRes) {
        if (userRes.code == 200) {
          var data = userRes.data;
          loading = false;
          that.bindData(params, data);
        } else {
          console.log('fail');
        }
      });
    });

  },
  //绑定数据到页面
  bindData: function (params, data) {
    var that = this;


    //停止加载....
    setTimeout(function () {
      util.hideToast();
      if (loading) {
        loading = false;
      }
      wx.stopPullDownRefresh();
    }, 1000);
    var userList = that.data.userList;
    if (params.p == 1) {
      userList = data;
    } else {
      //todo 双重循环的判断性能可能不好;
      for (var i = 0; i < data.length; i++) {
        var index = userList.findIndex(function (item) {
          return item.id == data[i].id;
        });
        if (index == -1) {
          userList.push(data[i]);
        }
      }
    }

    that.setData({
      userList: userList,
    })
    if (data.length == 0) {
      wx.showToast({
        title: '没有更多数据了.',
        icon: 'success',
        duration: 2000
      })
      return;
    }
  },




  //点击附近推荐
  near: function () {
    var that = this;
    var params = {};
    params.p = 1;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        params.longitude = res.longitude;
        params.latitude = res.latitude;
        that.getUserList(params);
      }
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
    var that = this;
    //从详情页面或搜索页面返回
    if (!that.data.needReload) {
      return;
    }
    //从搜索页面返回或第一次进入
    var params = that.data.searchCondition;
    console.log('params', params)
    params.p = 1;
    that.getUserList(params);

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
    var that = this;
    console.log("onPullDownRefresh");
    var params = that.data.searchCondition;
    params.p = 1;
    that.getUserList(params);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom");
    var that = this;
    var params = that.data.searchCondition;
    params.p = parseInt(params.p) + 1;
    params.longitude = that.data.lonlat.longitude;
    params.latitude = that.data.lonlat.latitude;

    that.getUserList(params);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  homepage: function () {
    wx.navigateTo({
      url: '/pages/change/Homepage/Honepage',
    })
  },
  touserdetail: function (e) {
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '/pages/change/my/humanDetails/humanDetails?uid=' + uid,
    })
  },
})