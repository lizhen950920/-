// pages/Xinxin/list.js
var util = require('../../common/httpUtil.js');
var loading = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomList: [],
    searchCondition: {},
    needReload: true,
    areaName: "",
    lonlat: {},
    isNoData: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    disselected: 'navi-selected',
    indicatorDots: false,
  },

  //距离最近
  // distancenear: function () {
  //   var that = this;
  //   console.log("distancenear");
  //   var params = that.data.searchCondition;
  //   params.p = 1;
  //   params.catagroy = 1;
  //   that.getroomList(params);
  //   this.setData({
  //     disselected: 'navi-selected',
  //     newselected: '',
  //   })
  // },
  //最新
  // newest: function () {
  //   var that = this;
  //   console.log("newest");
  //   var params = that.data.searchCondition;
  //   params.p = 1;
  //   params.catagroy = 2;
  //   that.getroomList(params);
  //   this.setData({
  //     disselected: '',
  //     newselected: 'navi-selected',
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight);
        that.setData({
          height: res.windowHeight
        });
      }
    });
  },
  location: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        var name = res.name
        var address = res.address
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          areaName: name
        })
        wx.setStorageSync("city", name)
        that.getAddress();
      }
    })
  },

  //点击搜索输入框
  searchCondition: function () {
    wx.navigateTo({
      url: '/pages/Room/Search',
    })
  },

  //调用第三方的api获取地理位置
  getAddress: function (longitude, latitude) {
    var that = this;
    if (that.data.areaName) {
      return;
    }

    util.latlng2City(latitude, longitude, function (response) {
      var areaName = response.result.ad_info.city;
      wx.setStorageSync("city", areaName)
      if (areaName.length > 3) {
        areaName = areaName.substr(0, 2) + ".."
      }
      that.setData({
        areaName: areaName,
        selectedAddress: response.result.address,
      });

    });
  },

  //获取列表
  getroomList: function (params) {
    var that = this;
    loading = true;
    util.showLoading("加载中...");
    util.getIamges(1, function (res) {
      that.setData({ imgUrls: res.data })
    });
    that.getLonLat(function (res) {
      var latitude = res.latitude
      var longitude = res.longitude

      that.getAddress(longitude, latitude);

      params.longitude = params.longitude || longitude;
      params.latitude = params.latitude || latitude;
      util.searchRoomList(params, function (userRes) {
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
    var roomList = that.data.roomList;
   
    // console.log(roomList)
    if (params.p == 1) {
      roomList = data;
    } else {
      //todo 双重循环的判断性能可能不好;
      for (var i = 0; i < data.length; i++) {
        var index = roomList.findIndex(function (item) {
          return item.id == data[i].id;
        });
        if (index == -1) {
          roomList.push(data[i]);
        }
      }
    }

    that.setData({
      roomList: roomList,
    })
    console.log(roomList)
    //控制是否有数据
    var isNoData = true;
    if (that.data.roomList.length == 0) {
      isNoData = false;
    }
    that.setData({
      isNoData: isNoData,
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
    params.p = 1;

    that.getroomList(params);

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    console.log("onPullDownRefresh");
    var params = that.data.searchCondition;
    params.p = 1;
    that.getroomList(params);
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

    that.getroomList(params);
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  roomDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    console.log("room detail");
    wx.navigateTo({
      url: '/pages/Room/RoomDetail?id=' + id + "&uid=" + uid,
    })
  }
})