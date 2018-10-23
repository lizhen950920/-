// pages/change/havehouse/havehouse.js
var util = require("../../../../../common/httpUtil.js");
var common = require("../../../../../common/common.js");
const AreaData = require("../../../../../common/Area.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cover_id: "",
    spaceIndex: 0,
    typeIndex: 0,
    scopeIndex: 0,
    typeId: 1,
    spaceId: 1,
    scopeId: 1,
    uid: "",
    rel_id: 0,
    charm_imgs_ids: [], //房屋图片
    charm_imgs: [],
    startDate: '',
    endDate: '',
    addressName: '请选择',
    score: "",
    latitude: "",
    longitude: "",
    markers: "",
    scale: 14,
    address: "",
    index: "",
    charm_imgs: '',
    end: '',
    imageWidth: "",
    selectTimeIndex: "",
    tmpRoom: "",
    array: ['1天 9.9元', '3天 27元', '7天 56元', '15天 100元', '30天 188元', '60天 360元'],
    timeArr: [{
        "id": "1",
        "time": "1天 9.9元"
      },
      {
        "id": "2",
        "time": "3天 27元"
      },
      {
        "id": "3",
        "time": "7天 56元"
      },
      {
        "id": "4",
        "time": "15天 100元"
      },
      {
        "id": "5",
        "time": "30天 188元"
      },
      {
        "id": "6",
        "time": "60天 360元"
      },






    ],
    date: '',
    selectIndex: '3',
    content: '',
    oppen: 'false',
    address: '',
    top: '',
    todate: '',
    select_time: false,
    select: false,
  },
  bindPickerChange: function(e) {
    var todate = [1, 3, 7, 15, 30, 60];
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(e)
    var index = e.detail.value;
    this.setData({
      index: index,
      todate: todate[index]
    })

    // wx.navigateTo({
    //   url: '/pages/change/public/public',
    // })
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      end: e.detail.value

    })
  },
  bindinput1: function(e) {
    var title = e.detail.value
    this.setData({
      title: title
    });
  },
  switchSlider(e) {
    var selectIndex = e.currentTarget.dataset.index;
    this.setData({
      'selectIndex': selectIndex
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var id = options.id;
    var uid = options.uid;
    var that = this;
    var params = {
      id: id,
      uid: uid,
    };
    util.roomDetail(params, function(res) {
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
      var cover_id = "";
      for (var i in tmpRoom.charm_imgs){
        var _data = tmpRoom.charm_imgs[i];
        if(_data.cover == 1){
          cover_id = _data.id;
        }
      }
      that.setData({
        item: tmpRoom,
        charm_imgs: tmpRoom.charm_imgs,
        end: tmpRoom.end,
        desc: tmpRoom.desc,
        selectIndex: tmpRoom.state,
        cover_id: cover_id,
        title: tmpRoom.title,
        desc:tmpRoom.desc,
      });
      setTimeout(function() {

        util.hideToast();
      }, 1000);
    });

    var that = this;
    var uid = wx.getStorageSync('uid');
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
      }
    })
    wx.getSystemInfo({
      success: function(res) {
        var width = res.windowHeight / 6 - 10;
        that.setData({
          uid: uid,
          imageWidth: width,
        });
      }
    });

  },
  chooseMap: function() {
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        console.log("name", res.name);
        console.log("address", res.address);
        console.log("latitude", res.latitude);
        console.log("longitude", res.longitude);

        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          address: res.address,
          scale: 16,
          markers: [{
            id: 1,
            latitude: res.latitude,
            longitude: res.longitude,
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
          }]
        });
      }
    });
  },
  //点击预览图片
  previewImg: function(e) {
    if (this.endTime - this.startTime > 350) {
      return;
    }
    var idx = e.currentTarget.dataset.idx;
    var that = this;
    var urls = [];
    that.data.charm_imgs.map(function(item) {
      urls.push(item.url);
    });
    wx.previewImage({
      current: urls[idx], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  // 防止触发2次点击
  bindTouchStart: function(e) {
    this.startTime = e.timeStamp;
  },

  bindTouchEnd: function(e) {
    this.endTime = e.timeStamp;
  },

  switch2Change: function(e) {
    var wrong = e.detail.value;
    console.log('switch2 发生 change 事件，携带值为', e)
    console.log('wrong', wrong)
    if (wrong) {
      this.setData({
        top: 1,
        select: true,
      })
    } else {
      this.setData({
        top: 0,
        select: false,
      })
    }
  },
  //上传图片
  uploadImg: function(e) {
    var typeInt = e.currentTarget.dataset.type;
    console.log("typeInt:", typeInt);
    var that = this;
    if (that.data.charm_imgs_ids.length >= 9) {
      util.alertShow(this, "cancel", "房屋图片最多只能传9张");
      return;
    }
    var max = 9;
    var count = 0;
    count = max - that.data.charm_imgs_ids.length;

    wx.chooseImage({
      count: count, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        console.log("选取图片：", tempFilePaths);
        for (var i = 0, lengths = tempFilePaths.length; i < lengths; i++) {
          wx.uploadFile({
            url: common.constans.domain + '/common/upload', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              uid: that.data.uid,
              rel_id: 0,
              'type': typeInt,
            },
            success: function(res) {
              var charm_imgs_ids = that.data.charm_imgs_ids
              var charm_imgs = that.data.charm_imgs
              var data = JSON.parse(res.data);
              if (data.code == 200) {
                var img = data.data[0];
                img.from_user_info = false;
                // 上传成功
                charm_imgs.push(img);
                charm_imgs_ids.push(img.id);
                that.setData({
                  charm_imgs: charm_imgs,
                  charm_imgs_ids: charm_imgs_ids
                });
              } else {
                // 上传失败
                util.alertShow(that, "cancel", "上传失败");
              }
            }
          })
        }
      }
    })
  },
  //提交表单
  formSubmit: function(e) {
    console.log('e', e)
    var that = this;

    var data = e.detail.value;
    console.log('e', that.data.uid)
    var content = this.data.desc;
    // console.log("charm_imgs_ids:", that.data.charm_imgs_ids.toString());
    console.log('我有房form发生了submit事件，携带数据为：', data);
    if (!data.title) {
      wx.showToast({
        title: '标题不能为空',
        icon: 'none',
        duration: 1000
      })
      console.log("进来了 没有标题")
      return;
    }
    if (!data.price) {
      wx.showToast({
        title: '租金不能为空',
        icon: 'none',
        duration: 1000
      })
      console.log("进来了 没有租金")
      return;
    }
    if (!that.data.address) {
      wx.showToast({
        title: '位置不能为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (!that.data.cover_id) {
      wx.showToast({
        title: '必须设置某张创想图片为封面',
        icon: 'none',
        duration: 1000
      })

      return;
    }
    if (that.data.charm_imgs.length < 1 || that.data.charm_imgs.length > 9) {
      wx.showToast({
        title: '图片只能传1-9张',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    data.latitude = that.data.latitude;
    data.longitude = that.data.longitude;
    data.address = that.data.address;
    data.scope = that.data.scopeId;
    data.type = that.data.typeId;
    data.space = that.data.spaceId;
    data.uid = that.data.uid; //todo
    data.id = that.data.item.id;

    //手动设置值
    data.imgs_ids = that.data.charm_imgs_ids.toString();
    data.cover_id = that.data.cover_id;
    data.start = that.data.startDate;
    data.end = that.data.end;
    data.desc = that.data.desc;
    data.state = that.data.selectIndex;
    data.title = that.data.title;
    data.todate = that.data.todate;
    data.top = that.data.top;
    util.showLoading("提交中");
    //搜集formid
    var formId = e.detail.formId;
    console.log("创建房源formId:" + formId);
    util.saveFormId({
      uid: that.data.uid,
      formId: formId
    }, function(res) {});
    console.log("租房：", data);
    util.addRoom(data, function(res) {
      console.log('res.data', res.data);
      console.log("addHome:", res);
      setTimeout(function() {
        util.hideToast();
        if (res.code == -1) {
          util.alertShow(that, "cancel", res.message);
          return;
        } else {
          util.alertShow(that, "success", res.message);
          wx.removeStorageSync("roomDetail");
          //跳转到首页
          wx.switchTab({
            url: '/pages/change/Homepage/Honepage'
          })
        }
        // var _rome = res.data;
        // console.log(_rome);
        // //跳转到创家详情页面
        // wx.redirectTo({
        //   //url: '/pages/CreateHome/CreateSuccess/CreateSuccess?id=' + _home.id + '&homeUid=' + that.data.uid,
        //   url: "/pages/change/housDetails/housDetails?id=" + _rome.id + "&uid=" + that.data.uid,
        // });
      }, 1000);
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var uid = wx.getStorageSync('uid');
    this.setData({
      uid: uid,
    });
    util.getUser({
      uid: uid
    }, function(data) {
      if (data.code === 200) {
        var score = data.data.score;
        if (parseInt(score) < 120) {
          util.alertView("提示", "魅力值不足120，请完善个人信息后再来", function() {
            wx.navigateTo({
              url: '/pages/User/MyHome/personaldata/personaldata?id=' + uid,
            })
          });
          return;
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  Content: function(e) {
    console.log('e', e)
    let value = e.detail.value;
    this.setData({
      "desc": value
    })
  },
  detail: function(e) {
    var that = this;
    that.setData({
      oppen: (!that.data.oppen)
    })
  },
  //删除图片
  deleteImg: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var idx = e.currentTarget.dataset.idx;
    //util.alertShow(that, "success", "别急，还没做完");
    var params = {
      id: id
    };
    util.imgDel(params, function(res) {
      if (res.code == 200) {
        var cover_id = that.data.cover_id;
        if (id == that.data.cover_id) {
          cover_id = "";
        }
        util.alertShow(that, "success", "删除成功");

        var tmpArr = that.data.charm_imgs;
        var _tmpArr = tmpArr.splice(idx, 1);
        var tmp_charm_imgs = that.data.charm_imgs;

        var _charm_imgs_ids = that.data.charm_imgs_ids;
        var index = _charm_imgs_ids.indexOf(id);
        if (index > -1) {
          _charm_imgs_ids.splice(index, 1);
        }

        that.setData({
          charm_imgs: tmpArr,
          charm_imgs_ids: _charm_imgs_ids,
          cover_id: cover_id,
        });

      } else {
        util.alertShow(that, "cancel", "删除失败");
      }
    });
  },

  //设置封面图片
  setCover: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var idx = e.currentTarget.dataset.idx;
    var type = e.currentTarget.dataset.type;
    console.log(id);
    that.setData({
      cover_id: id,
    });

    var tmpArr = that.data.charm_imgs;
    tmpArr.map(function(item) {
      if (item.id == id) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
    //tmpArr[idx].selected = true
    that.setData({
      imageWidth: parseInt(that.data.imageWidth) - 1,
      charm_imgs: tmpArr
    });

    wx.showToast({
      title: '设置成功',
      icon: 'none',
      duration: 1000
    })
  },
  select_time: function(e) {
    this.setData({
      select_time: true
    })
  },
  Selecttime: function(e) {
    var todate = [1, 3, 7, 15, 30, 60];
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(e)
    var selectTimeIndex = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.id - 1;
    console.log(index)
    this.setData({
      'selectTimeIndex': selectTimeIndex,
      index: index
    })
    console.log('todate', todate)
    console.log('selectTimeIndex', selectTimeIndex)

  },
  s_cancel: function(e) {
    this.setData({
      select_time: false
    })
  },
  s_comfirm: function(e) {
    var selectTimeIndex = e.currentTarget.dataset.id;
    wx.requestPayment({
      'timeStamp': '',
      'nonceStr': '',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success': function(res) {
        cons.log("支付消息:" + JSON.stringify(res))
      },
      'fail': function(res) {}
    })
    this.setData({
      'selectTimeIndex': this.data.selectTimeIndex,

      select_time: false
    })
    var openId = {
      'openId': 'o_d8b0ZfhBZDWXknTXMRmqeb6ezM'
    }
    util.WeChatpay(openId, function(res) {
      if (res.code == 200) {

      }
    })
  },
})