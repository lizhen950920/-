//index.js
var util = require('../../../common/httpUtil.js');
//获取应用实例
var app = getApp();

Page({
  data: {
    hiddent: true,
    items: [],
    height: 0,
  },
  onLoad: function (options) {
    console.log('onLoad')
    var that = this;

    //获取最新数据
    this.refreshNewData();

    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight);
        that.setData({
          height: res.windowHeight
        });
      }
    });

  },
  //刷新数据
  refreshNewData: function () {
    //加载提示框
    util.showLoading();

    var that = this;
    var params = {
      uid: wx.getStorageSync('uid'),
    };

    util.myroomlist(params, function (res) {
      that.setNewDataWithRes(res, that);
      setTimeout(function () {
        util.hideToast();
        wx.stopPullDownRefresh();
      }, 1000);
    });

  },

  //设置新数据
  setNewDataWithRes: function (res, target) {
    console.log("setNewDataWithRes:", res.data);

    target.setData({
      items: target.data.items.concat(res.data)
    });
  },

  roomdel: function (e) {
    var id = e.target.dataset.id;

  },

  roomedit: function (e) {
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    console.log("roomEdit:" , id);
    wx.navigateTo({
      url: '/pages/Room/EditRoom?id='+ id + "&uid="+uid,
    })
  },

  roomDetail: function(e){
    if(e.target.id == 'edit'){
      return;
    }
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    console.log("room detail");
    wx.navigateTo({
      url: '/pages/Room/RoomDetail?id='+id + "&uid="+uid,
    })
  }

});
