// LdealHome.js
var util = require('../../common/httpUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lh_lv_image: '/img/ldealhome/ilike.png',
    lh_dz_image: '/img/ldealhome/idea.png',
    lh_pl_image: '/img/ldealhome/comment.png',
    lh_bj_image: '/img/ldealhome/make.png',
    lh_lvoe: 0,

    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,

    room: "",
    loginUid: wx.getStorageSync('uid'),

    isViewMobile:false,
    viewText:"显示",



  },

  //投票
  voteClick:function(e){
    var that = this;
    if (that.data.room.isVoted){
      wx.showToast({
        title: '你已投过票',
        icon: 'success',
        duration: 2000
      })
      return;
    }
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;

    var params = {
      id:id,
      uid: that.data.loginUid,
      type:type,
    };

    util.roomVote(params,function(res){
      console.log(res);
      if (res.code == 201) {
        wx.showToast({
          title: '你已投过票',
          icon: 'success',
          duration: 2000
        })
        return;
      }
      if(res.code == 200){
        var _room = that.data.room;
        if(type == 1){
          _room.voteTrue = parseInt(_room.voteTrue) + 1;
        }else if(type==2){
          _room.voteFalse = parseInt(_room.voteFalse) + 1;
        } else if (type == 3) {
          _room.voteAgent = parseInt(_room.voteAgent) + 1;
        }
        that.setData({
          room: _room,
        });
        wx.showToast({
          title: '投票成功',
          icon: 'success',
          duration: 2000
        });

      }else{
        wx.showToast({
          title: '投票失败',
          icon: 'success',
          duration: 2000
        })
      }
    });

  },

  viewMobile:function(){
    this.setData({
      isViewMobile: !this.data.isViewMobile,
      viewText: !this.data.isViewMobile?"隐藏":"查看",
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var uid = options.uid;

    var that = this;

    
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面

    //直接调用上一个页面的data方法，把数据显示到页面上
    if (prevPage && prevPage.route == "pages/FindHome/FindHome") {
      prevPage.setData({
        needLoad:false,
      });
    }

    console.log(id);
    //加载提示框
    util.showLoading();
    var params = {
      id: id,
      uid: uid,
      loginUid: that.data.loginUid,
    };
    util.roomDetail(params, function (res) {
      var tmpRoom = res.data;
      //标记地图
      if ((tmpRoom.latitude || tmpRoom.latitude != null) && (tmpRoom.longitude || tmpRoom.longitude != null)){
        tmpRoom.markers = [{
          id: 1,
          latitude: tmpRoom.latitude,
          longitude: tmpRoom.longitude,
          callout: {
            content: "房屋位置",
            color: "#FFFFFF",
            fontSize: 14,
            borderRadius: 5,
            bgColor: '#82C435',
            padding: 5,
            display: 'ALWAYS'
          },
          anchor: { x: 1, y: 1 }
        }];
      }
      that.setData({
        room: tmpRoom,

      });
      setTimeout(function () {

        util.hideToast();
      }, 1000);
    });
  },
  onShow:function(){
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    if (prevPage && prevPage.route == "pages/FindHome/FindHome") {
      prevPage.setData({
        needReload: false,
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '【' + that.data.room.station + '】我有好房，用它造美家啊',
      path: '/pages/Room/RoomDetail?id=' + that.data.room.id + "&uid=" + that.data.room.uid,
    }
  },
  //点赞
  navLike: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var param = {
      uid: wx.getStorageSync('uid'),
      id: id,
      type: 3,
    };
    util.like(param, function (res) {
      
      console.log(res);
      if(res.code == 200){
        console.log('点赞成功');
        var data = that.data.room;
        data.like= parseInt(data.like) + 1;
        that.setData({
          room: data,
        });
        wx.showToast({
          title: '点赞成功',
          icon: 'success',
          duration: 2000
        })
      }else{
        wx.showToast({
          title: '点赞失败',
          icon: 'success',
          duration: 2000
        })
      }
    });
  },
  //申请加入
  applyJoin: function (e) {
    var id = e.currentTarget.dataset.id;

  },
  //查看评论
  comment: function (e) {
    var id = e.currentTarget.dataset.id;

  },
  //导航到目标地址
  navoToDes: function () {
    var that = this
    if (that.data.room.longitude == null){
      wx.showToast({
        title: '查看地址错误.',
      })
      return;
    }
    wx.openLocation({
      latitude: Number(that.data.room.latitude),
      longitude: Number(that.data.room.longitude),
      name: that.data.room.name,
      address: that.data.room.address,
      scale: 18
    })
  },
  //点击预览图片
  previewImg: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var urls = [];
    var that = this;
    that.data.room.charm_imgs.map(function (item) {
      urls.push(item.url);
    });

    wx.previewImage({
      current: urls[idx], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  first:function(){
    wx.switchTab({
      url: '/pages/FindHome/FindHome'
    })
  }
})