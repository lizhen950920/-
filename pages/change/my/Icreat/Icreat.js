//index.js
// var util = require('../../../../../common/httpUtil.js');
//获取应用实例
var app = getApp();
Page({
  data: {
    hiddent: true,
    items: [],
    height: 0,
    wrong: '',
    id: '',
    uid: '',  
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
    console.log("roomEdit:", id);
    wx.navigateTo({
      url: '/pages/Room/EditRoom?id=' + id + "&uid=" + uid,
    })
  },

  roomDetail: function (e) {
    if (e.target.id == 'edit') {
      return;
    }
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    console.log("room detail");
    wx.navigateTo({
      url: '/pages/Room/RoomDetail?id=' + id + "&uid=" + uid,
    })
  },
  switch2Change: function (e) {

    var wrong = e.detail.value;
    console.log('switch2 发生 change 事件，携带值为', e)
    console.log('wrong', wrong)
    if (wrong) {
      this.setData({
        wrong: wrong
      })
    } else {
      this.setData({
        wrong: wrong
      })
    }
    wx.request({
      url: 'https://api.xxpeople.com/apihome/showHiddenHome',
      header: {
        'content-type': "application/x-www-form-urlencoded",
      },
      data: newSearchData,
      method: 'POST',
      success: function (res) {
        console.log('res', res.data)
        var roomList = res.data.data || [];
        var size = roomList.length;
        that.setData({
          roomList: roomList
        })
      }
    })
  },
  delete: function (e) {
    console.log(e)
    var that = this;
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    that.setData({
      id: id,
      uid: uid,
    })
    var params = {
      id: id,
      uid: uid
    }
    wx.showModal({
      title: '',
      content: '你确定要删除吗？',
      success: function (res) {
        if (res.confirm) {

          util.houseDel(params, function (res) {
            if (res.code == 200) {
              var id = that.data.id;
              if (id == that.data.id) {
                id = "";
              }
              console.log('删除成功')
              util.alertShow(that, "success", "删除成功");
              var items = that.data.items;
              var _items = items.splice(id, 1);
              that.setData({
                items: items,
              });
            }
            else {
              util.alertShow(that, "cancel", "删除失败");
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  }
});
