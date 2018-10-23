var util = require("../../../common/httpUtil.js");


var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    items: [],
    tabs: ["爱家", "租房", "新人类", "系统"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    detailUnexpand: "detail-unexpand",
    expandText: "",
    p: 1,
  },

  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    //this.loadData("1,2,4,5,6,7");
    that.loadData("2,4,6,7");
  },
  tabClick: function (e) {

    var that = this;
    that.setData({
      p:1
    })
    var id = e.currentTarget.dataset.id;
    console.log("tabClick:" + id);
    if (id == 0) {
      that.loadData("2,4,6,7");
    } else if (id == 1) {
      that.loadData("3,5");
    } else if (id == 2) {
      that.loadData("99");
    } else if (id == 3) {
      that.loadData("1");
    }
    
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: id,
    });
    
  },

  //展开
  expandClick: function (e) {
    if (this.data.detailUnexpand) {
      this.setData({
        detailUnexpand: "",
        expandText: "收起",

      });
    } else {
      this.setData({
        detailUnexpand: "detail-unexpand",
        expandText: "展开",

      });
    }
  },

  loadData(option) {
    //加载提示框
    util.showLoading();

    var that = this;
    var params = {
      uid: wx.getStorageSync('uid'),
      types: option,
      p: that.data.p,
     
    };
    console.log('params',params)
    util.getMessages(params, function (res) {
      util.hideToast();
      if (res.code == 200) {
        var data = res.data;

        var msgList = that.data.items;
        if (that.data.p != 1 && that.data.activeIndex == 0) {
          for (var i = 0; i < data.length; i++) {
            var index = msgList.findIndex(function (item) {
              return item.id == data[i].id;
            });
            if (index == -1) {
              msgList.push(data[i]);
            }
          }
        } else {
          var msgList = data
        }

        that.setData({
          items: msgList,
          p: parseInt(that.data.p) + 1,
        });
        if (data.length == 0) {
          wx.showToast({
            title: '无更多数据.',
          })
          return;
        }
      }
      var ids = [];
      res.data.map(function (item) {
        if (item.read == 0) {
          ids.push(item.id);
        }
      });
      var idsStr = ids.toString();
      console.log("read message idsStr", idsStr);
      if (idsStr) {
        util.readMsg({ ids: idsStr }, function (e) {
          if (e.code != 200) {
            console.log("已读评论失败");
          }
        });
      }


    });
  },

  onShow: function (option) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight);
        that.setData({
          height: res.windowHeight
        });
      }
    });
    // this.loadData("2,4,6,7");
  },

  //点击操作
  clickToDetail: function (e) {
    var type = e.currentTarget.dataset.type;
    var url = "";
    if (type == 2) {//申请理想之家
      var id = e.currentTarget.dataset.id;//id
      var uid = e.currentTarget.dataset.uid;//接受人uid
      var sendUid = e.currentTarget.dataset.senduid; //发送人uid
      var rel_id = e.currentTarget.dataset.rel_id; //homeid
      var content = e.currentTarget.dataset.content; //content
      var status = e.currentTarget.dataset.status; //status

      url = '/pages/Home/Apply?id=' + id + '&applyuid=' + sendUid
        + '&home_id=' + rel_id
        + '&homeuid=' + uid
        + '&status=' + status
        + '&content=' + content;
      console.log("redirectTo Apply:", url);

    } else if (type == 6 || type == 4 || type == 7) {//4.理想之家评论,6.同意理想之家申请,7爱家提供点子
      var sendUid = e.currentTarget.dataset.senduid; //发送人uid
      var uid = e.currentTarget.dataset.uid;//接受人uid
      var rel_id = e.currentTarget.dataset.rel_id; //homeid
      var homeuid = sendUid;
      if (type == 4 || type == 7) {
        homeuid = uid
      }
      url = "/pages/change/my/ideeaHome/ideaHome?id=" + rel_id + "&uid=" + homeuid
      console.log("redirectTo home:", url);

    } else if (type == 3 || type == 5) {//租房
      var sendUid = e.currentTarget.dataset.senduid; //发送人uid
      var rel_id = e.currentTarget.dataset.rel_id; //homeid
      url = '/pages/Room/RoomDetail?id=' + rel_id + "&uid=" + sendUid
      console.log("redirectTo home:", url);

    }

    if (url) {
      wx.navigateTo({
        url: url,
      });
    }
  },
  touserDetail: function (e) {
    var uid = e.currentTarget.dataset.senduid;
    wx.navigateTo({
      url: '/pages/Xinxin/detail?uid=' + uid,
    })
  },

  //底部加载更多
  onReachBottom: function () {
    var that = this;
    console.log("onReachBottom:" + that.data.p);
    var id = that.data.activeIndex;
    console.log("tabClick:" + id);
    if (id == 0) {
      that.loadData("2,4,6,7");
    }
  }


})
