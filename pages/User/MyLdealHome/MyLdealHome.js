//index.js
var util = require('../../../common/httpUtil.js');
//获取应用实例
var app = getApp();

Page({
  data: {
    status: ['', '求房源', '一起找', '招室友', '出租', '转租'],
    hiddent: true,
    items: [],
    height: 0,
    uid:"",
  },
  onLoad: function (options) {
    console.log('onLoad')
    var that = this;
    var uid = wx.getStorageSync('uid');
    console.log('uid', uid)
    that.setData({
      uid: wx.getStorageSync('uid'),
    });
   //1表示从我喜欢的连接跳过来的
   //2表示我的理想之家
    var src = options.src || 2;
    
    //获取最新数据
    that.refreshNewData(src);

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
  refreshNewData: function (src) {
    //加载提示框
    util.showLoading();

    var that = this;
    var params = {
      uid: that.data.uid,
    };
    if(src == 2){
      util.myhomeList(params, function (res) {
        that.setNewDataWithRes(res, that);
        setTimeout(function () {
          util.hideToast();
          wx.stopPullDownRefresh();
        }, 1000);
      });
    }else{
      wx.setNavigationBarTitle({
        title: '我喜欢的',
      });
      util.mylikehome(params, function (res) {
        that.setNewDataWithRes(res, that);
        setTimeout(function () {
          util.hideToast();
          wx.stopPullDownRefresh();
        }, 1000);
      });
    }
  },

  //设置新数据
  setNewDataWithRes: function (res, target) {
    console.log("setNewDataWithRes:", res.data);
    
    target.setData({
      items: target.data.items.concat(res.data)
    });
  },
  
  editHome:function(e){
    var id = e.currentTarget.dataset.id;
    console.log("editHome id:",id);
    wx.navigateTo({
      url: '/pages/Home/EditHome?id='+id,
    })
  },

  //隐藏
  showHiddenHome: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    util.showHiddenHome({'id':id},function(res){
      console.log(res)
      if(res.code == 200){
        var items = that.data.items;

        var index = items.findIndex(function (item) {
          if (item.id == id){
            item.status = item.status == 1 ? 0:1;
          }
          return;
        });
      
        that.setData({
          items:items,
        });
      }
    });
  },

  toHomeDetail:function(e){
    console.log(e)
    if(e.target.id == 'edit'){
      return;
    }
    //LdealHome / LdealHome ? id = {{item.id }
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      // url: '/pages/User/MyLdealHome/LdealHome/LdealHome?id=' + id + "&uid=" + uid,
      // url: '/pages/change/idealHome/idealHome?id='+id+"&uid="+uid,
      url: '/pages/change/my/ideeaHome/ideaHome?type=1&home_id=' + id + "&homeuid=" + uid,
    })
  }
  

});
