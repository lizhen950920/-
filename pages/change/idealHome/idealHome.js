// LdealHome.js
var util = require('../../../common/httpUtil.js');
var itemId, itemUid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lh_lv_image: '/img/ldealhome/like-11.png',
    lh_dz_image: '/img/ldealhome/idea.png',
    lh_pl_image: '/img/ldealhome/comment.png',
    lh_joinin_image: '/img/ldealhome/joinin.png',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    home: "",
    userInfo: "",
    uid: "",
    inputView: false,

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
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    if (prevPage && prevPage.route == "pages/Aiqilin/Aiqilin") {
      prevPage.setData({
        needReload: false,
      })
    }
  },

  //删除室友
  delHomeApply: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '你确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          var uid = e.currentTarget.dataset.uid;
          var home_id = e.currentTarget.dataset.homeid;
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
    var idx = e.currentTarget.dataset.idx;
    var type = e.currentTarget.dataset.type;
    var urls = [];
    var that = this;
    that.data.home.charm_imgs.map(function (item) {
      if (item.type == type)
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
    var scene = options.scene;
    console.log("scene:" + scene);
    var id = options.id;
    var homeUid = options.uid;
    if (scene && scene) {
      let sceneArr = decodeURIComponent(scene).split(",");
      homeUid = sceneArr[0];
      id = sceneArr[1];
    }

    var uid = wx.getStorageSync('uid');
    var that = this;
    that.setData({
      userInfo: getApp().globalData.userInfo,
      uid: uid,
    });

    console.log(id);
    //加载提示框
    util.showLoading();
    var params = {
      uid: homeUid,
      id: id,
      loginUid: uid,
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
      roommates.map(function (item) {
        if (item.id == uid) {
          tmpHome.isShow = true;
        }
      });
      //自己发布的要能显示
      if (uid == tmpHome.uid) {
        tmpHome.isShow = true;
      }

      that.setData({
        home: tmpHome,
      });
      setTimeout(function () {

        util.hideToast();
      }, 1000);
    });
  },
  //入家申请
  join: function (e) {
    var that = this;
    util.showLoading();
    var id = e.currentTarget.dataset.id;
    // console.log(id);此处id是房屋的信息id 
    var homeuid = e.currentTarget.dataset.homeuid;

    // console.log(homeuid); //此处homeuid是房屋主的信息
    // console.log(that.data.uid);//that.data.uid应该是当前用户

    // 以上是数据准备
    if (that.data.uid == homeuid) {
      util.hideToast();
      // 给一个提示 您不能申请自己作为自己的室友
      wx.showToast({
        title: '您不能申请自己作为自己的室友',
        icon: 'success',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '/pages/Home/Joinin?type=1&home_id=' + id + '&homeuid=' + homeuid,
      })
    }
  },
  navClick: function (e) {
    var clickID = e.currentTarget.id;
    var that = this;
    var id = e.currentTarget.dataset.id;
    var homeuid = e.currentTarget.dataset.homeuid;

    //未登录需跳转到登录页面
    if (!that.data.uid) {
      var confirm = function () {
        wx.switchTab({
          url: '/pages/User/user',
        })
      }
      util.alertViewWithCancel("提示", "请登录后再来评论", confirm, "true");
      return;
    }

    switch (clickID) {
      case 'nav_like':

        var param = {
          uid: that.data.uid,
          id: id,
          type: 1,
        };
        util.like(param, function (res) {
          console.log(res);
          if (res.code == 200) {
            console.log('点赞成功');
            var data = that.data.home;
            var image = "";
            if (res.message == '点赞成功') {
              data.like = parseInt(data.like) + 1;
              image = "/img/ldealhome/like-22.png";
            } else if (res.message == '取消点赞成功') {
              data.like = parseInt(data.like) - 1;
              image = "/img/ldealhome/like-11.png";
            }
            that.setData({
              home: data,
              lh_lv_image: image,
            });
            wx.showToast({
              title: res.message,
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: res.message,
              icon: 'success',
              duration: 2000
            })
          }
        });
        break;
      case 'nav_dz':
        wx.switchTab({
          url: '/pages/Aiqilin/Aiqilin',
        })
        // wx.navigateTo({
        //   url: '/pages/Comment/Comment?type=3&home_id=' + id + '&homeuid=' + homeuid + "&title=" + that.data.home.name,
        // })

        break;
      case 'nav_pl':

        wx.navigateTo({
          url: '/pages/Comment/Comment?type=1&home_id=' + id + '&homeuid=' + homeuid + "&title=" + that.data.home.name,
        })

        break;

      default:
        break;
    }
  },
  //分享二维码
  toShare: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/Home/ShareHome?uid=' + that.data.home.uid + "&id=" + that.data.home.id + "&ercode=" + that.data.home.ercode,
    })
  },

  //导航到目标地址
  navoToDes: function () {
    var that = this
    wx.openLocation({
      latitude: Number(that.data.home.latitude),
      longitude: Number(that.data.home.longitude),
      name: that.data.home.name,
      address: that.data.home.address,
      scale: 18
    })
  },
  first: function () {
    wx.switchTab({
      url: '/pages/Aiqilin/Aiqilin'
    })
  }


})