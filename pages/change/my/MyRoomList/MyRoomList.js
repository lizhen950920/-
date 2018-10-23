//index.js
var util = require('../../../../common/httpUtil.js');
//获取应用实例
var app = getApp();
Page({ 
  data: {
    state: ['', '求房源', '无房一起找', '招室友', '出租', '转租'],
    onoff: [false, true],
    hiddent: true,
    items: [],
    idealHome:[],
    height: 0,
    wrong:'',
    id:'',
    uid:'',
    status:'',
    state1:'',
    selectIndex:0,
  },
  onLoad: function (options) {
    console.log('onLoad')
    var that = this;
    var src = options.src || 2;
    var uid=wx.getStorageSync('uid');
    console.log('uid',uid)
    that.setData({
      uid:uid
    })
   
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
  
 
      util.myhomeList(params, function (res) {
        that.setNewData(res, that);
        setTimeout(function () {
          util.hideToast();
          wx.stopPullDownRefresh();
        }, 1000);
      });
  

  },
  setNewData: function(res, target) {
    console.log("setNewDataWithRes:", res.data);

    target.setData({
      idealHome: target.data.idealHome.concat(res.data)
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
    console.log(e)
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    var state1 = e.currentTarget.dataset.state;
    var that=this;
    that.setData({
      state1: state1
    })
    console.log("roomEdit:", id);
    if (state1>2){
    wx.navigateTo({
      url: '/pages/change/my/preview/Roompreview/Roompreview?id=' + id + "&uid=" + uid,
    })
    }else{
      wx.navigateTo({
        url: '/pages/change/my/preview/noRoompreview/noRoompreview?id=' + id + "&uid=" + uid,
      })
      
    }
  },

  roomDetail: function (e) {
    if (e.target.id == 'edit') {
      return;
    }
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    console.log("room detail");
    wx.navigateTo({
      url: '/pages/change/housDetails/housDetails?id=' + id + "&uid=" + uid,
    })
  },
  
switch2Change: function (e) {
  console.log('id',e)
    var wrong = e.detail.value;
    console.log('switch2 发生 change 事件，携带值为', e)
    console.log('wrong', wrong)
    if (wrong){   
      this.setData({
        wrong: wrong
      })
    } else {
      this.setData({
       
        wrong: wrong
      })
    }
    var that=this;
  var uid = that.data.uid;
  var id = e.currentTarget.dataset.id;
  var idx = e.currentTarget.dataset.idx;
  var status = that.data.items[idx].status;
    util.showHiddenreserve({ 'id': id, 'uid': uid, 'status': status}, function (res) {
    console.log(res)
    if (res.code == 200) {
      var items = that.data.items;
      var index = items.findIndex(function (item) {
        console.log('item', item)
        if (item.id == id) {
          item.status = item.status == 1 ? 0 : 1;
        }
        return;
      });
      that.setData({
        items: items,
      });
    }
  });
  },
  // 理想之家显示与隐藏
  real: function (e) {
    console.log('id', e)
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
    var that=this;
    var uid = that.data.uid;
    var id = e.currentTarget.dataset.id;
    var idx = e.currentTarget.dataset.idx;
    var status = that.data.idealHome[idx].status;
    util.showHiddenHome({ 'id': id ,'uid': uid, 'status': status}, function (res) {
     
      if (res.code == 200) {
        var idealHome = that.data.idealHome;
        var index = idealHome.findIndex(function (item) {
          console.log('item',item)
          if (item.id == id) {
            item.status = item.status == 1 ? 0 : 1;
           
          }
          return;
        });
        that.setData({
          idealHome: idealHome,
        });
        console.log('idealHome', idealHome)
      }
    });
  },
  delete:function(e){
    console.log(e)
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    that.setData({
      id: id,
      uid: uid,
    })
    console.log('删除id',id)
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
       var items =that.data.items;
       var _items = items.splice(idx, 1);
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

  },
  deleteHome:function(e) {
    console.log(e)
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    that.setData({
      id: id,
      uid: uid,
    })
    console.log('删除id', id)
    var params = {
      id: id,
      uid: uid
    }
    wx.showModal({
      title: '',
      content: '你确定要删除吗？',
      success: function (res) {
        if (res.confirm) {

          util.ideHomeDel(params, function (res) {
            if (res.code == 200) {
              var id = that.data.id;
              if (id == that.data.id) {
                id = "";
              }
              console.log('删除成功')
              util.alertShow(that, "success", "删除成功");
              var idealHome = that.data.idealHome;
              var _idealHome = idealHome.splice(idx, 1);
              that.setData({
                idealHome: idealHome,
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

  },
  toHomeDetail: function (e) {
    console.log(e)
    if (e.target.id == 'edit') {
      return;
    }
    //LdealHome / LdealHome ? id = {{item.id }
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    
    wx.navigateTo({
      url: '/pages/change/my/ideeaHome/ideaHome?id=' + id + "&uid=" + uid,
      // url: '/pages/change/idealHome/idealHome?id='+id+"&uid="+uid,
    })
  },
  //理想之家编辑
  editHome: function (e) {
    var t = e.currentTarget.dataset.id;
    console.log("editHome id:", t), wx.navigateTo({
      url: "/pages/change/my/modifyHome/editFirHome/editFirHome?id=" + t
    });
  },
  switchSlider(e) {
    this.setData({
      'selectIndex': e.target.dataset.index
    })
  },
});
