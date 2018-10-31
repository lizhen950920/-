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
    address:'',
     checked:'false',
    home: "",
    userInfo: "",
    uid: "",
    comment: "",
    type: "",
    loginUid: wx.getStorageSync('uid'),
    selectIndex:"0",
    inputView: false,
    time:[1,2,3],
    liuyan:false,
    room:"",
    replayUser: "",    
    homelength:'',
    hiddent: true,
    items: [],
    loadicon: "",
    loadresult: "",
    inputShowed: true,
    inputVal: "",
    height: 0,
    home_id: "",
    id:'',
    uid: "",
    homeUid:'',
    home_uid: "",
    pid: 0,
    commentUid: "",//某一个评论人uid
    focus: false,
    cursor: 0,
    submit: false,
    replayUser: "", 
    delect:false,
    endDay:'',
    spacelength:'',
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
    var that=this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    var params = {
      type: that.data.type,
      p: 1,
      home_id: that.data.home_id,
    };
    // util.getComment(params, function (res) {

    //   that.setNewDataWithRes(res, that);
    // })
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
  //删除室友
  delHomeApply: function (e) {
    consolo.log(e)
    var that = this;
    wx.showModal({
      title: '提示',
      content: '你确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          var uid = e.currentTarget.dataset.uid;
          var home_id = e.currentTarget.dataset.id;
          consolo.log('home_id')
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
      path: "/pages/change/my/ideeaHome/ideaHome?id=" + that.data.home.id + "&uid=" + that.data.home.uid,
      imageUrl: url
    }
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
      homeUid: homeUid,
      id:id,
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
      var spacelength = tmpHome.rooms[0].imgs.length;
      var homelength = tmpHome.roommates.length;
      console.log('spacelength',spacelength)
      that.setData({
        homelength: homelength,
        spacelength: spacelength
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
        homelength: homelength,
        title: tmpHome.name,
      });
      //设置报名截止时间
      var date1 = new Date();
      var date3 = new Date(tmpHome.apply_end) - date1;
      var days = Math.floor(date3 / (24 * 3600 * 1000))
      console.log(tmpHome)
      that.setData({
        home: tmpHome,
        homelength: homelength,
        endDay: days > 0 ? days : 0,
        roommate_num: tmpHome.roommates.length,
      });      
      setTimeout(function () {

        util.hideToast();
      }, 1000);
    });
// 获取评论的信息
    that.setData({
      home_id: options.id,
      home_uid: options.uid,
      type: 1,
      uid: wx.getStorageSync('uid'),
    });
    var params = {
      type: that.data.type,
      p: 1,
      home_id: that.data.home_id,
    };
    util.getComment(params, function (res) {

      that.setNewDataWithRes(res, that);
    })
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
  //点击预览图片
  previewImg: function (e) {
    var idx = e.currentTarget.dataset.id - this.data.home.charm_imgs[0].id;
    var type = e.currentTarget.dataset.type;
    var urls = [];
    var that = this;
    that.data.home.charm_imgs.map(function (item) {
      if (item.type == type)
        urls.push(item.url);
    });
console.log(idx)
    wx.previewImage({
      current: urls[idx], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  refreshNewData: function (options) {
    //加载提示框
    util.showLoading();

    var that = this;
    var params = {
      type: that.data.type,
      p: page,
      home_id: that.data.home_id,
    };

    util.getComment(params, function (res) {
      page = 1;
  
      that.setNewDataWithRes(res, that);
      setTimeout(function () {
        util.hideToast();
        wx.stopPullDownRefresh();
      }, 1000);
    });
  },

  //设置新数据
  setNewDataWithRes: function (res, target) {
    page += 1;
    console.log("setNewDataWithRes:", res.data);
    console.log(target.data.items)
    target.setData({
      items: target.data.items.concat(res.data)
      // items: res.data
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
     title: '您不能申请自己为自己的室友',
     icon:'none',
     deaution:2000
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
              image = "/img/my/like-1.png";
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
          url: '/pages/change/Homepage/Honepage',
        })
   
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
      var that=this;
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
  showdown:function(){
    this.setData({
      liuyan:false,
      share:false,
    })
  },
  shutdown: function () {
    this.setData({
      share: false
    })
  },
  share:function(){
    var that = this;
    console.log('data', that.data)
    var uid = {
      uid: that.data.home.uid
    }
    var id = {
      id: that.data.home.id
    }
    var shareUrl = {
      shareUrl: 'pages/change/my/ideeaHome/ideaHome'
    }
    var newSearchData = Object.assign({}, uid, id, shareUrl); //新的筛选条件is  OK!
    wx.request({
      url: 'https://api.xxpeople.com/common/getErCode',
      header: {
        'content-type': "application/x-www-form-urlencoded",
      },
      data: newSearchData,
      method: 'POST',
      success: function (res) {
        console.log('res', res.data)
        var ercode = res.data.data || [];
        var size = ercode.length;
        that.setData({
          code: ercode
        })
      }
    })
    this.setData({
      share: true
    })
  },
  commentInput: function (e) {
    var pos = e.detail.cursor;
    var _comment = e.detail.value;

    this.setData({
      comment: _comment,
      cursor: _comment.length,
      focus: true,
    });

  },
  //提交评论
  commentFormSubmit: function (e) {
    var that = this;
    var uid = wx.getStorageSync('uid');
    if (!uid || uid == "") {
      wx.showModal({
        title: '提示',
        content: '登录后才能评论',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/User/Login/Login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }
    var formId = e.detail.formId;
    console.log("留言或回复formId:" + formId);
    if (!that.data.comment) {
      wx.showToast({
        title: "内容不能为空",
        icon: 'success',
        duration: 2000,
      });
      return;
    }
    that.setData({
      submit: true,
    });
    //搜集formid
    util.saveFormId({ uid: uid, formId: formId }, function (res) { });
    this.addComment(that, e);

  },
  //回复评论
  replayClick: function (e) {
    var that = this;
    console.log(e)
    that.setData({
      liuyan:true,
      pid: e.currentTarget.dataset.id,
      commentUid: e.currentTarget.dataset.uid,
      //comment: "@"+ e.currentTarget.dataset.username + ":",
      replayUser: "@" + e.currentTarget.dataset.username + ":"

    });

  },
  // 提交评论到后台
  addComment: function (that, e) {

    var data = e.detail.value;
    var param = {
      home_id: that.data.home_id,
      home_uid: that.data.home_uid,
      comment: that.data.replayUser + that.data.comment,
      uid: that.data.uid,
      pid: that.data.pid,
      type: that.data.type,
    };
    //发送模板消息
    var paramMsg = {};

    if (!that.data.replayUser.startsWith("@")) { //留言
      paramMsg = {
        uid: that.data.home_uid,
        loginUid: that.data.uid,
        msgType: 1,
        data: that.data.comment,
        title: that.data.home.name,
        page: 'pages/change/my/ideeaHome/ideaHome?type=' + that.data.type + '&home_id=' + that.data.home_id + '&homeuid=' + that.data.home_uid + "&title=" + that.data.home.name,
      };
    } else {//回复

      paramMsg = {
        uid: that.data.commentUid,
        loginUid: that.data.uid,
        msgType: 2,
        data: that.data.replayUser + that.data.comment,
        title: that.data.home.name,
        page: 'pages/change/my/ideeaHome/ideaHome?type=' + that.data.type + '&home_id=' + that.data.home_id + '&homeuid=' + that.data.home_uid + "&title=" + that.data.home.name,
      };
    }
    //添加留言
    util.addComment(param, function (res) {
      console.log(res);
      that.setData({
        submit: false,
      })
      if (res.code == 200) {
        util.showSuccess();
        wx.showToast({
          title: "提交成功",
          icon: 'success',
          duration: 2000,
        });
        that.refreshPage();
        var tempItmes = that.data.items;
        tempItmes.unshift(res.data);
        //console.log("tempItmes", tempItmes);
        that.setData({
          items: tempItmes,
          comment: "",
          replayUser: "",
          share:false,
        });
        //添加留言成功后才能发送模板消息，否则会出现点开模板消息后无法查看留言
        util.sendTemplateMsg(paramMsg, function (res) {
          console.log("sendTemplateMsg：" + res);
        });

      } else {
        util.alertShow(that, "cancel", res.message);
      }
    });
  },
  delect:function(){
    this.setData({
      delect:true
    })
  },
  aplay:function(e){
    var that = this;
    console.log(e)
    var id = e.currentTarget.dataset.id;
    var homeName = e.currentTarget.dataset.name;
    var room_id = e.currentTarget.dataset.room_id;
    var homeuid = e.currentTarget.dataset.homeuid;
    var idx = e.currentTarget.dataset.idx;
    
    if (that.data.uid == homeuid) {
      wx.showToast({
        title: '您不能申请自己为自己的室友',
        icon: 'none',
        deaution: 2000
      })
    } else {
      wx.navigateTo({
        url: '/pages/Home/Joinin?type=1&home_id=' + id + '&homeuid=' + homeuid + '&homeName=' + homeName + '&idx=' + idx + '&room_id=' + room_id,
      })
    }
  },

  close:function(){
    this.setData({
      delect:false
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
  refreshPage:function(){
    var that=this
    var uid=that.data.uid
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