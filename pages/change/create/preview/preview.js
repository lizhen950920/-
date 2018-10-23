// LdealHome.js
var util = require('../../../../common/httpUtil.js');
var itemId, itemUid;
var page = 1;//页码
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lh_lv_image: '/img/ldealhome/like-11.png',
    lh_dz_image: '/img/ldealhome/idea.png',
    lh_pl_image: '/img/share6.png',
    lh_joinin_image: '/img/ldealhome/joinin.png',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    address: '',
    checked: 'false',
    home: "",
    userInfo: "",
    uid: "",
    comment: "",
    type: "",
    loginUid: wx.getStorageSync('uid'),
    selectIndex: "0",
    inputView: false,
    time: [1, 2, 3],
    liuyan: false,
    room: "",
    replayUser: "",
    homelength: '',
    hiddent: true,
   
    loadicon: "",
    loadresult: "",
    inputShowed: true,
    inputVal: "",
    height: 0,
    home_id: "",
    id: '',
    uid: "",
    homeUid: '',
    home_uid: "",
    pid: 0,
    commentUid: "",//某一个评论人uid
    focus: false,
    cursor: 0,
    submit: false,
    replayUser: "",
    delect: false,
    endDay: '',
    user:''
  },
  //邀请好友创家理想之家
  invite: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/CreateHome/CreateSuccess/CreateSuccess?id=' + id + '&homeUid=' + that.data.uid,
    })
  },
  onShow: function () {
  
  },
  // 导航到目的地
  navoToDes: function () {
    var that = this
    if (that.data.room.longitude == null) {
      wx.showToast({
        title: '查看地址错误.',
      })
      return;
    }
    wx.openLocation({
      latitude: Number(that.data.room.latitude),
      longitude: Number(that.data.room.longitude),
      name: that.data.home.name,
      address: that.data.home.address,
      scale: 18
    })
  },
 
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function (res) {
    var title = "";
    var that = this;
    if (res.from === 'button') {
      title = "【诚邀共建爱家】" + that.data.home.introduction + "--" + that.data.home.name
      console.log("button");


    } else {
      console.log("right top");
      title = "新新人类乐园，创我想要的世界";
    }
    var url = that.data.home.charm_imgs[0].url
    that.data.home.charm_imgs.map(function (item) {
      if (item.type == 4 && item.cover == 1) {
        url = item.url;
      }
    });
    return {
      title: title,
      //path: "/pages/CreateHome/CreateSuccess/CreateSuccess?id=" + that.data.home.id + "&uid=" + that.data.home.uid,
      path: "/pages/User/MyLdealHome/LdealHome/LdealHome?id=" + that.data.home.id + "&uid=" + that.data.home.uid,
      imageUrl: url
    }
  },

  //点击预览图片
  previewImg: function (e) {


    var idx = e.currentTarget.dataset.id - this.data.home.charm_imgs[0].id;
    var urls = [];

    console.log(idx)
    var that = this;
    that.data.home.charm_imgs.map(function (item) {
      urls.push(item.url);
    });
    wx.previewImage({
      current: urls[idx], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    var uid = wx.getStorageSync('uid');
    var that = this;
    console.log(uid)
    that.setData({
     
      uid: uid,
    });
    util.getUser({ uid: uid }, function (data) {
      if (data.code === 200) {
        var score = data.data.score;
        that.setData({
          user: data.data,

        });
      }
    })
    util.showLoading();
    if (!that.data.items) {
      var homeDetail = wx.getStorageSync('homeDetail')
      console.log(homeDetail);

      if (!homeDetail) {
        console.log('无缓存');
        var homeDetail = {
          name: "",
          declaration: "",
          dream_home: "",
          hope_roommate: "",
          introduction: "",
        }
        wx.setStorageSync('homeDetail', homeDetail);
      } else {
        console.log('有缓存')
        that.setData({
          items: homeDetail,
        })
      }
    }  
   
  },
 
 


  //导航到目标地址
  navoToDes: function () {
    var that = this
    wx.openLocation({
      latitude: Number(that.data.home.latitude),
      longitude: Number(that.data.home.longitude),

      address: that.data.home.address,
      scale: 18
    })
  },
  first: function () {
    wx.switchTab({
      url: '/pages/change/Homepage/Honepage'
    })
  },
  switchSlider(e) {
    var that = this;
    var selectIndex = e.currentTarget.dataset.index;
    that.setData({
      'selectIndex': selectIndex
    })

  },
  navClick1: function (e) {
    this.setData({
      liuyan: true
    })
  },
  showdown: function () {
    this.setData({
      liuyan: false,
      share: false,
    })
  },
 
 
   
  delect: function () {
    this.setData({
      delect: true
    })
  },
  aplay: function (e) {
    var that = this;
    console.log(e)
    util.showLoading();
    var id = e.currentTarget.dataset.id;
    var homeName = e.currentTarget.dataset.name;
    var homeuid = e.currentTarget.dataset.homeuid;
    var idx = e.currentTarget.dataset.idx;
    if (that.data.uid == homeuid) {
      util.hideToast();
      wx.showToast({
        title: '您不能申请自己作为自己的室友',
        icon: 'success',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '/pages/Home/Joinin?type=1&home_id=' + id + '&homeuid=' + homeuid + '&homeName=' + homeName + '&idx=' + idx,
      })
    }
  },
  shutDown: function () {
    this.setData({
      share: false
    })
  },
  close: function () {
    this.setData({
      delect: false
    })
  },
  //删除室友
  delHomeApply: function (e) {
    console.log(e)
    var that = this;
    wx.showModal({
      title: '提示',
      content: '你确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          var uid = e.currentTarget.dataset.uid;
          var home_id = e.currentTarget.dataset.id;
          util.delHomeApply({ uid: uid, homeId: home_id }, function (res) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            });
            var home = that.data.home;
            var roommates = home.roommates;
            roommates.map(function (item, index) {
              if (item.uid == uid) {
                roommates.splice(index, 1);
              }
            });
            home.roommates = roommates;
            that.setData({
              home: home
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  refreshPage: function () {
    var that = this
    var uid = that.data.uid
    var params = {
      uid: that.data.homeUid,
      id: that.data.id,
      loginUid: that.data.uid,
    };
    util.myhomeDetail(params, function (res) {
      console.log("res:" + res);
      var tmpHome = res.data;
      wx.setNavigationBarTitle({
        title: tmpHome.name,
      })
      //标记地图
      tmpHome.markers = [{
        id: 1,
        latitude: tmpHome.latitude,
        longitude: tmpHome.longitude,
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

      //判断是否点亮点赞按钮
      if (tmpHome.isLiked == 1) {
        that.setData({
          lh_lv_image: "/img/ldealhome/like-22.png",
        });
      }

      //室友
      var roommates = tmpHome.roommates;
      var homelength = tmpHome.roommates.length;
      that.setData({
        homelength: homelength
      })
      roommates.map(function (item) {
        if (item.id == uid) {
          tmpHome.isShow = true;
        }
      });
      //自己发布的要能显示
      if (uid == tmpHome.uid) {
        tmpHome.isShow = true;
      }

      console.log(tmpHome)
      that.setData({
        home: tmpHome,
        homelength: homelength
      });

      setTimeout(function () {

        util.hideToast();
      }, 1000);
    });
    // 获取评论的信息
    that.setData({
      home_id: that.data.id,
      home_uid: that.data.uid,
      type: 1,
      uid: wx.getStorageSync('uid'),
    });
    //获取最新数据
    // this.refreshNewData(options);
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight);
        that.setData({
          height: res.windowHeight
        });
      }
    });

  },
  toShare: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/Home/ShareHome?uid=' + that.data.home.uid + "&id=" + that.data.home.id + "&ercode=" + that.data.home.ercode,
    })
  },
})