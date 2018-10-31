var util = require('../../../common/httpUtil.js');
var page = 1; //页码
const app = getApp
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hidden:true,
    status: ['', '求房源', '无房一起找', '招室友', '出租', '转租'],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    room: "",
    items: [],
    home_id: "",
    home_uid: "",
    id: '',
    uid: "",
    address: '',
    loginUid: wx.getStorageSync('uid'),
    isViewMobile: false,
    viewText: "显示",
    contact: false,
    liuyan: false,
    share: false,
    hiddent: true,
    loadicon: "",
    loadresult: "",
    inputShowed: true,
    inputVal: "",
    height: 0,
    comment: "",
    type: "",
    pid: 0,
    commentUid: "", //某一个评论人uid
    focus: true,
    cursor: 0,
    submit: false,
    replayUser: "",
    selectIndex: '',
    gather:'',
    submit:false
  },
  showshare: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  //投票
  voteClick: function(e) {
    var that = this;
    if (that.data.home_uid == that.data.loginUid) {
      console.log()
      wx.showToast({
        title: '不能给自己投票',
        icon: 'success',
        duration: 2000
      })
      return;
    }
    console.log(e)
    var id = e.currentTarget.dataset.id;
    var selectIndex = e.currentTarget.dataset.type;
    var type = e.currentTarget.dataset.type;
    that.setData({
      selectIndex: selectIndex
    })
    var params = {
      id: id,
      uid: that.data.loginUid,
      type: type,
    };
    util.roomVote(params, function(res) {
      console.log(res);
      if (res.code == 201) {

        wx.showToast({
          title: '你已投过票',
          icon: 'success',
          duration: 2000
        })

        return;
      }

      if (res.code == 200) {
        var _room = that.data.room;
        if (type == 1) {
          _room.voteTrue = parseInt(_room.voteTrue) + 1;
        } else if (type == 2) {
          _room.voteFalse = parseInt(_room.voteFalse) + 1;
        } else if (type == 3) {
          _room.voteAgent = parseInt(_room.voteAgent) + 1;
        } else if (type == 4) {
          _room.voteSecond = parseInt(_room.voteSecond) + 1;
        }
        that.setData({
          room: _room,
        });
        wx.showToast({
          title: '投票成功',
          icon: 'success',
          duration: 2000
        });


      } else {

        // 更改未登录时投票显示问题
        wx.showToast({
          title: '登陆后才能投票哟，亲~',
          icon:'none',
          duration:2000
        })
      }
    });

  },

  viewMobile: function() {
    this.setData({
      isViewMobile: !this.data.isViewMobile,
      viewText: !this.data.isViewMobile ? "隐藏" : "查看",
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // /* 创建 canvas 画布 */
    // const ctx = wx.createCanvasContext('shareImg')

    // /* 绘制图像到画布  图片的位置你自己计算好就行 参数的含义看文档 */
    // /* ps: 网络图片的话 就不用加../../路径了 反正我这里路径得加 */

    // ctx.drawImage('/img/1.jpg', 0, 0, 545, 771)

    // /* 绘制文字 位置自己计算 参数自己看文档 */
    // ctx.setTextAlign('center')                        //  位置
    // ctx.setFillStyle('#ffffff')                       //  颜色
    // ctx.setFontSize(22)                               //  字号
    // ctx.fillText('新新人类共建美家', 545 / 2, 130)         //  内容  不会自己换行 需手动换行
    // ctx.fillText('分享自新新人类小程序', 545 / 2, 160)    //  内容


    // /* 绘制 */
    // ctx.stroke()
    // ctx.draw()

    var id = options.id;
    var uid = options.uid;
    var scene = options.scene;

    console.log("scene:" + scene);
    var roomUid = options.uid;
    if (scene && scene) {
      let sceneArr = decodeURIComponent(scene).split(",");
      roomUid = sceneArr[0];
      id = sceneArr[1];
    }
    //获取最新数据
    this.setData({
      home_id: options.id,
      home_uid: options.uid,
      id: id,
      uid: options.uid,
      // uid: wx.getStorageSync('uid'),
      type: 4,
    })

    var that = this;

    // var uid = wx.getStorageSync('uid');
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        that.setData({
          longitude: longitude,
          latitude: latitude,
        });

        //加载成功后再去获取数据
        console.log(id);
        //加载提示框
        util.showLoading();
        var params = {
          id: id,
          uid: uid,
          loginUid: that.data.loginUid,
        };
        that.setData({
          // userInfo: getApp().globalData.userInfo,
          uid: uid,
        });
        if (!uid) {
          console.log("未登录");
          return;
        }
        util.getUser({
          uid: uid
        }, function (data) {
          if (data.code === 200) {
            that.setData({
              user: data.data,
            });
            console.log('user', data.data)
          } else {
            console.log(data.message);
          }
        });
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面

        //直接调用上一个页面的data方法，把数据显示到页面上
        if (prevPage && prevPage.route == "pages/FindHome/FindHome") {
          prevPage.setData({
            needLoad: false,
          });
        }
        console.log(id);
        //加载提示框
        util.showLoading();
        var params = {
          id: id,
          uid: uid,
          loginUid: that.data.loginUid,
          longitude: longitude,
          latitude: latitude,
        };
        util.roomDetail(params, function (res) {
          var tmpRoom = res.data;
          console.log('tmpRoom', tmpRoom)
          var address = tmpRoom.address;
          that.setData({
            address: address,
            title: tmpRoom.title,
          })
          console.log(address)
          //标记地图
          if ((tmpRoom.latitude || tmpRoom.latitude != null) && (tmpRoom.longitude || tmpRoom.longitude != null)) {
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
              anchor: {
                x: 1,
                y: 1
              }
            }];
          }
          that.setData({
            room: tmpRoom,

          });
          setTimeout(function () {

            util.hideToast();
          }, 1000);
        });
      }
    })
    
  },
  //刷新数据
  refreshNewData: function(parameter) {
    console.log('parameter', parameter)
    //加载提示框
    util.showLoading();
    var that = this;
    var params = {
      type: 4,
      p: page,
      home_id: that.data.id,
    };
    util.getComment(params, function(res) {
      page = 1;
      that.setNewDataWithRes(res, that);
      setTimeout(function() {
        util.hideToast();
        wx.stopPullDownRefresh();
      }, 1000);
    });
  },
  //设置新数据
  setNewDataWithRes: function(res, target) {
    page = 1;
    var that=this;
    console.log('target', target)
    console.log("setNewDataWithRes:", res.data);
    that.setData({
      // items: that.data.items.concat(res.data)
      items:res.data
    });
  },
  onShow: function() {
    var parameter = {
      home_id: this.data.home_id,
      home_uid: this.data.home_uid,
    }
    console.log('parameter', parameter)
    this.refreshNewData(parameter);

  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;

    var url = that.data.room.charm_imgs[0].url;
    console.log(url)
    return {
      title: '【 ' + that.data.room.l_street + that.data.status[that.data.room.state]+'】' + that.data.room.title +' ',
      path: '/pages/change/housDetails/housDetails?id=' + that.data.room.id + "&uid=" + that.data.room.uid,
      imageUrl: url
    }
  },

  //点赞
  navLike: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var param = {
      uid: wx.getStorageSync('uid'),
      id: id,
      type: 3,
    };
    util.like(param, function(res) {
      console.log(res);
      if (res.code == 200) {
        console.log('点赞成功');
        var data = that.data.room;
        // data.like = parseInt(data.like) + 1;
        if (res.message == '点赞成功') {
          data.like = parseInt(data.like) + 1;

        } else if (res.message == '取消点赞成功') {
          data.like = parseInt(data.like) - 1;

        }
        that.setData({
          room: data,
        });
        wx.showToast({
          title: res.message,
          icon: 'success',
          duration: 2000
        })
      } else {
    
        // 更改未登录情况下点赞失败的弹窗显示
       wx.showToast({
         title: '登录后才能点赞哟，亲~',
         icon:'none',
         duration:2000
       })
      }
    });
  },
  //申请加入
  applyJoin: function(e) {
    var id = e.currentTarget.dataset.id;
  },
  //查看评论
  // comment: function(e) {
  //   var id = e.currentTarget.dataset.id;
  // },
  //导航到目标地址
  navoToDes: function() {
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
      name: that.data.room.name,
      address: that.data.room.address,
      scale: 18
    })
  },
  sharecar:function(){
    wx.showToast({
      title:'正在努力开发中',
      icon:'none',
      duration:2000,
    })
    // var that = this
    // wx.canvasToTempFilePath({
    //   x: 0,
    //   y: 0,
    //   width: 545,
    //   height: 771,
    //   destWidth: 545,
    //   destHeight: 771,
    //   canvasId: 'shareImg',
    //   success: function (res) {
    //     console.log('+++' + res.tempFilePath);
    //     /* 这里 就可以显示之前写的 预览区域了 把生成的图片url给image的src */
    //     that.setData({
    //       prurl: res.tempFilePath,
    //       hidden: false,
         
    //     })
     
    //   },
    //   fail: function (res) {
    //     console.log(res)
    //   }
    // })
    
  },
  // save: function () {
  //   var that = this
  //   wx.saveImageToPhotosAlbum({
  //     filePath: that.data.prurl,
  //     success(res) {
  //       wx.showModal({
  //         content: '图片已保存到相册，赶紧晒一下吧~',
  //         showCancel: false,
  //         confirmText: '好的',
  //         confirmColor: '#333',
  //         success: function (res) {
  //           if (res.confirm) {
  //             console.log('用户点击确定');
  //             /* 该隐藏的隐藏 */
  //             that.setData({
  //               hidden: true
  //             })
  //           }
  //         }
  //       })
  //     }
  //   })
  // },  


  //点击预览图片
  previewImg: function(e) {
    var idx = e.currentTarget.dataset.id - this.data.room.charm_imgs[0].id;
    var urls = [];

    console.log(idx)
    var that = this;
    that.data.room.charm_imgs.map(function(item) {
      urls.push(item.url);
    });
    console.log(that.data.room.charm_imgs)
    wx.previewImage({
      current: urls[idx], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  
  contact: function() {
    this.setData({
      contact: true
    })
  },
  shutDown: function() {
    this.setData({
      contact: false
    })
  },

  //一键复制
  copyFormSubmit: function(e) {
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
    util.saveFormId({ uid: uid, formId: formId }, function (res) { });
    var that = this
    var wechat = that.data.user.wechat;
    console.log(wechat);
    if (!wechat) {
      return;
    }
    wx.setClipboardData({
      data: wechat,
      success: function(res) {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
  //一键call
  callFormSubmit: function(e) {
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
    } var formId = e.detail.formId;
    console.log("留言或回复formId:" + formId);
    util.saveFormId({ uid: uid, formId: formId }, function (res) { });
    console.log('e',e)
    var that =this
    var mobile = that.data.user.mobile;
    console.log(mobile);
    if (mobile) {
      wx.makePhoneCall({
        phoneNumber: mobile,
      })
    }
  },
  navag: function() {
    wx.switchTab({
      url: '/pages/change/Homepage/Honepage',
    })
  },
  click: function(e) {
    var address = this.data.address;
    wx.openLocation({
      latitude: 23.362490,
      longitude: 116.715790,
      scale: 18,
      name: '',
    })
  },
  navClick: function(e) {

    this.setData({
      liuyan: true
    })
    
  },
  /**获取输入的内容 */
  commentInput: function(e) {

    var pos = e.detail.cursor;
    var _comment = e.detail.value;

    this.setData({
      comment: _comment,
      cursor: _comment.length,
      focus: true,
    });

  },
  //提交评论
  commentFormSubmit: function(e) {
    var that = this;
    var uid = wx.getStorageSync('uid');
    if (!uid || uid == "") {
      wx.showModal({
        title: '提示',
        content: '登录后才能评论',
        success: function(res) {
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
    util.saveFormId({
      uid: wx.getStorageSync('uid'),
      formId: formId
    }, function(res) {});
    this.addComment(that, e);

  },
  //提交评论到后台
  addComment: function(that, e) {
    var data = e.detail.value;
    var uid = wx.getStorageSync('uid');
    console.log('that.data', that.data)
    var param = {
      home_id: that.data.home_id,
      home_uid: that.data.home_uid,
      comment: that.data.replayUser + that.data.comment,
      // content: that.data.replayUser + that.data.comment,
      uid: wx.getStorageSync('uid'),
      pid: that.data.pid,
      type: that.data.type,
    };

    //发送模板消息
    var paramMsg = {};
    if (!that.data.replayUser.startsWith("@")) { //留言
      paramMsg = {
        uid: that.data.home_uid,
        loginUid: uid,
        msgType: 1,
        data: that.data.comment,
        title: that.data.title,
        page: 'pages/change/housDetails/housDetails?type=' + that.data.type + '&home_id=' + that.data.home_id + '&homeuid=' + that.data.home_uid + "&title=" + that.data.title,
      };
    } else { //回复
      paramMsg = {
        uid: that.data.commentUid,
        loginUid: uid,
        msgType: 2,
        data: that.data.replayUser + that.data.comment,
        title: that.data.title,
        page: 'pages/change/housDetails/housDetails?type=' + that.data.type + '&home_id=' + that.data.room_id + '&homeuid=' + that.data.home_uid + "&title=" + that.data.title,
      };
    }
    //添加留言
    util.addComment(param, function(res) {
      console.log('数据', res);
      that.setData({
        submit: false,
      })
      if (res.code == 200) {
        util.showSuccess();
        var comment = that.data.room.comment + 1;
        console.log('ccomment', comment)
        wx.showToast({
          title: "提交成功",
          icon: 'success',
          duration: 2000,
        });
        that.refreshPage();
        var tempItmes = that.data.items;
        tempItmes.unshift(res.data);

        that.setData({
          liuyan: false,
          items: tempItmes,
          comment: "",
          replayUser: "",
        });
        console.log("tempItmes", tempItmes);
        //添加留言成功后才能发送模板消息，否则会出现点开模板消息后无法查看留言
        util.sendTemplateMsg(paramMsg, function(res) {
          console.log("sendTemplateMsg：" + res);
        });
      } else {
        util.alertShow(that, "cancel", res.message);
      }
    });
  },
  //回复评论
  replayClick: function(e) {
    var that = this;
    that.setData({
      pid: e.currentTarget.dataset.id,
      commentUid: e.currentTarget.dataset.uid,
      //comment: "@"+ e.currentTarget.dataset.username + ":",
      replayUser: "@" + e.currentTarget.dataset.username + ":",
    liuyan: true,
    });

  },
  searchCondition: function(e) {

  },
 


  share: function(e) {
    var that = this;
    console.log('data', that.data)
    var uid = {
      uid: that.data.room.uid
    }
    var id = {
      id: that.data.room.id
    }
    var shareUrl = {
      shareUrl: 'pages/change/housDetails/housDetails'
    }

    var newSearchData = Object.assign({}, uid, id, shareUrl); //新的筛选条件is  OK!

    wx.request({
      url: 'https://api.xxpeople.com/common/getErCode',
      header: {
        'content-type': "application/x-www-form-urlencoded",
      },
      data: newSearchData,
      method: 'POST',
      success: function(res) {
        console.log('res', res.data)
        var ercode = res.data.data || [];
        var size = ercode.length;
        that.setData({
          code: ercode,
        
        })
      }
    })
    this.setData({
      share: true
    })
  },
  shutdown: function(e) {
    this.setData({
      share: false
    })
  },
  fenx: function(e) {

  },
  kap: function() {
    var that = this;
    var id = this.data.room.id;
    var uid = this.data.room.uid
    wx.navigateTo({
      url: '/pages/Home/ShareHome?uid=' + uid + "&id=" + id,
    })
  },
  h_shareFormSubmit: function(e) {
    console.log('e',e)
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
    // var formId = e.detail.formId;
    // console.log("留言或回复formId:" + formId);
    // util.saveFormId({ uid: uid, formId: formId }, function (res) { });

    // wx.showToast({
    //   title: '正在努力开发中',
    //   icon: 'none',
    //   duration: 1000
    // })
    // var that = this;
    // wx.navigateTo({
    //   url: '/pages/change/houseDetail/share/share?uid=' + that.data.uid + "&id=" + that.data.id,
    // })
  },

  closeMessage: function() {
    this.setData({
      liuyan: false
    })
  },
  bindfocus:function(e){
    console.log(e)
    this.setData({
      gather:1
    })
  },
  bindblur:function(e){
    this.setData({
      gather: 0
    })
  },
  refreshPage:function(){
    var that = this
    var uid = that.data.uid
    var params = {
      id: that.data.id,
      uid: that.data.uid,
      loginUid: that.data.loginUid,
    };
    util.roomDetail(params, function (res) {
      var tmpRoom = res.data;
      console.log('tmpRoom', tmpRoom)
      var address = tmpRoom.address;
      that.setData({
        address: address
      })
      console.log(address)
      //标记地图
      if ((tmpRoom.latitude || tmpRoom.latitude != null) && (tmpRoom.longitude || tmpRoom.longitude != null)) {
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
          anchor: {
            x: 1,
            y: 1
          }
        }];
      }
      that.setData({
        room: tmpRoom,

      });
      setTimeout(function () {

        util.hideToast();
      }, 1000);
    });
  }

})
