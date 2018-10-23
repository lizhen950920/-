var util = require("../../common/httpUtil.js");
var common = require("../../common/common.js");

const AreaData = require("../../common/Area.js");

Page({
  data: {
    cover_id: "",
    spaceArray: [
      { 'id': '1', 'name': '合租' },
      { 'id': '2', 'name': '整租' }],
    typeArray: [
      { 'id': '1', 'name': '转租' },
      { 'id': '2', 'name': '直租' },
    ],
    scopeArray: [
      { 'id': '1', 'name': '整套' },
      { 'id': '2', 'name': '主卧' },
      { 'id': '3', 'name': '次卧' },
    ],
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
    provId: '',                                                     //省ID
    cityId: '',                                                     //市ID
    areaId: '',                                                     //区ID
    showPickerView: false,                                          //控制省市区三级联动显隐
    value: [0, 0, 0],
    tempValue: [0, 0, 0],
    provArr: AreaData.result,                                       //省数组
    cityArr: AreaData.result[0].city,                               //市数组
    areaArr: AreaData.result[0].city[0].area,                       //区数组

    startDate: '',
    endDate: '',
    addressName: '请选择',
    score: "",

    latitude: "",
    longitude: "",
    markers: "",
    scale: 14,
    address: "",
    imageWidth: "",
    room_id:"",
    room:"",

  },

  bindSpaceChange: function (e) {
    this.setData({
      spaceIndex: e.detail.value,
      spaceId: this.data.spaceArray[e.detail.value].id,
    })
    console.log('picker发送选择改变，携带值为:' + e.detail.value + "," + this.data.spaceId);
  },
  bindScopeChange: function (e) {
    this.setData({
      scopeIndex: e.detail.value,
      scopeId: this.data.scopeArray[e.detail.value].id,
    })
    console.log('picker发送选择改变，携带值为:' + e.detail.value + "," + this.data.spaceId);
  },
  bindTypeChange: function (e) {
    this.setData({
      typeIndex: e.detail.value,
      typeId: this.data.typeArray[e.detail.value].id,
    })
    console.log('picker发送选择改变，携带值为:' + e.detail.value + "," + this.data.typeId);
  },

  onShow: function () {
    var uid = wx.getStorageSync('uid');
    this.setData({
      uid: uid,
    });
    util.getUser({ uid: uid}, function (data) {
      if (data.code === 200) {
        var score = data.data.score;
        if (parseInt(score) < 120) {
          util.alertView("提示", "魅力值不足120，请完善个人信息后再来", function () {
            wx.navigateTo({
              url: '/pages/User/MyHome/personaldata/personaldata?id=' + uid,
            })
          });
          return;
        }
      }
    });
  },

  chooseMap: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
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
            anchor: { x: 1, y: 1 }
          }]
        });
      }
    });
  },

  // js
  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },

  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },

  onLoad: function (option) {
    var that = this;
    var uid = wx.getStorageSync('uid');
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
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
      success: function (res) {
        var width = res.windowHeight / 6 - 10;
        that.setData({
          uid: uid,
          imageWidth: width,
        });
      }
    });


    var _charm_imgs = [];
    var _charm_imgs_ids = [];
    var _cover_id="";
    var params = {
      id: option.id,
      uid: option.uid,
      loginUid:option.uid,//无用
    };
    util.roomDetail(params, function (res) {
      var tmpRoom = res.data;

      wx.setNavigationBarTitle({
        title:tmpRoom.title,
      });
      //设置图片
      tmpRoom.charm_imgs.map(function (item) {
        item.selected = false;
        
        if (item.cover == 1) {
          item.selected = true
          _cover_id = item.id;
        }

        _charm_imgs.push(item);
        _charm_imgs_ids.push(item.id);
        
      });
      
      //设置选项
      var scopeIndex = that.data.scopeArray.findIndex(function (item) {
        return item.id == tmpRoom.scope; 
      });
      var typeIndex = that.data.typeArray.findIndex(function (item) {
        return item.id == tmpRoom.type; 
      });

      that.setData({
        room: tmpRoom,
        charm_imgs: _charm_imgs,
        charm_imgs_ids: _charm_imgs_ids,
        addressName: tmpRoom.pca,
        provId: tmpRoom.province,
        cityId: tmpRoom.city_id,
        areaId: tmpRoom.area_id,
        showPickerView: false,

        address: tmpRoom.address,
        startDate: tmpRoom.start,
        endDate: tmpRoom.end,
        cover_id: _cover_id,
        room_id: option.id,

        scopeId:tmpRoom.scope,
        scopeIndex: scopeIndex,
        typeIndex: typeIndex,
        typeId:tmpRoom.type,

      });
      setTimeout(function () {

        util.hideToast();
      }, 1000);
    });

  },
  //点击预览图片
  previewImg: function (e) {
    if (this.endTime - this.startTime > 350) {
      return;
    }
    var idx = e.currentTarget.dataset.idx;
    var that = this;
    var urls = [];
    that.data.charm_imgs.map(function (item) {
      urls.push(item.url);
    });
    wx.previewImage({
      current: urls[idx], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },


  //打开省市区三级联动
  openPickerView() {
    this.setData({ showPickerView: true });
  },
  //关闭省市区三级联动
  closePickerView() {
    console.log("closePickerView");
    this.setData({ showPickerView: false });
  },

  //三级联动触发方法
  bindChange: function (e) {
    let val = e.detail.value
    if (val[0] != this.data.tempValue[0]) {
      val = [val[0], 0, 0]
    }
    if (val[1] != this.data.tempValue[1]) {
      val = [val[0], val[1], 0]
    }
    console.log('bindChange:', val);
    this.setData({
      tempValue: val,
      value: val,
      cityArr: AreaData.result[val[0]].city,
      areaArr: AreaData.result[val[0]].city[val[1]].area,
    })
  },
  //省市区三级联动确定
  confirmPickerView() {
    console.log("confirmPickerView");
    let val = this.data.value;
    let provName = AreaData.result[val[0]].name;
    let cityName = AreaData.result[val[0]].city[val[1]].name;
    let areaName = AreaData.result[val[0]].city[val[1]].area[val[2]].name;
    let addressName = provName + cityName + areaName;
    let provId = AreaData.result[val[0]].id;
    let cityId = AreaData.result[val[0]].city[val[1]].id;
    let areaId = AreaData.result[val[0]].city[val[1]].area[val[2]].id;
    this.setData({
      addressName: addressName,
      provId: provId,
      cityId: cityId,
      areaId: areaId,
      showPickerView: false,
    })
  },
  //时间选择
  bindStartDateChange: function (e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  //时间选择
  bindEndDateChange: function (e) {
    var endDate = new Date(e.detail.value).getTime();
    var startDate = new Date(this.data.startDate).getTime();
    if (endDate < startDate) {
      util.alertShow(this, "cancel", "结束时间必须大于开始时间");
      return;
    }
    this.setData({
      endDate: e.detail.value
    })
  },
  
  //提交表单
  formSubmit: function (e) {
    var that = this;
    var data = e.detail.value;
    console.log("charm_imgs_ids:", that.data.charm_imgs_ids.toString());
    console.log('我要租房form发生了submit事件，携带数据为：', data);

    //data validate
    if (that.data.charm_imgs_ids.length < 1 || that.data.charm_imgs_ids.length > 9) {
      util.alertShow(this, "cancel", "房屋图片只能传1-9张");
      return;
    }
    if (!data.room) {
      util.alertShow(this, "cancel", "几室不能为空");
      return;
    }
    if (!data.area) {
      util.alertShow(this, "cancel", "面积不能为空");
      return;
    }
    if (!data.price) {
      util.alertShow(this, "cancel", "租金不能为空");
      return;
    }
    if (!data.desc) {
      util.alertShow(this, "cancel", "优势不能为空");
      return;
    }
    if (!that.data.address) {
      util.alertShow(this, "cancel", "地址不能为空");
      return;
    }
    if (!data.room_config) {
      util.alertShow(this, "cancel", "配置不能为空");
      return;
    }
    if (!data.title) {
      util.alertShow(this, "cancel", "标题不能为空");
      return;
    }
    if (!that.data.startDate) {
      util.alertShow(this, "cancel", "入住开始时间不能为空");
      return;
    }
    if (!that.data.endDate) {
      util.alertShow(this, "cancel", "入住结束时间不能为空");
      return;
    }
    if (!data.reason) {
      util.alertShow(this, "cancel", "出租原因不能为空");
      return;
    }
    if (!data.mobile) {
      util.alertShow(this, "cancel", "手机号不能为空");
      return;
    }
    if (!data.require) {
      util.alertShow(this, "cancel", "对租客要求不能为空");
      return;
    }
    if (!data.think_talk) {
      util.alertShow(this, "cancel", "对新新人类说的话不能为空");
      return;
    }
    if (!that.data.cover_id) {
      util.alertShow(this, "cancel", "必须设置某一个图片为封面");
      return;
    }

    data.latitude = that.data.latitude;
    data.longitude = that.data.longitude;
    data.address = that.data.address;

    data.scope = that.data.scopeId;
    data.type = that.data.typeId;
    data.space = that.data.spaceId;
    data.uid = that.data.uid;//todo
    //手动设置值
    data.imgs_ids = that.data.charm_imgs_ids.toString();
    data.cover_id = that.data.cover_id;
    data.id = that.data.room_id;
    data.start = that.data.startDate;
    data.end = that.data.endDate;

    util.showLoading("提交中");
    console.log("租房：", data);
    util.addRoom(data, function (res) {
      console.log("addHome:", res);
      setTimeout(function () {
        util.hideToast();
        if (res.code == -1) {
          util.alertShow(that, "cancel", res.message);
          return;
        } else {
          util.alertShow(that, "success", res.message);
          //跳转到列表页
          wx.navigateTo({
            url: '/pages/User/MyRoomList/MyRoomList'
          })
        }
      }, 1000);
    });

  },

  //上传图片
  //上传图片
  uploadImg: function (e) {
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
      success: function (res) {
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
            success: function (res) {
              var charm_imgs_ids = that.data.charm_imgs_ids
              var charm_imgs = that.data.charm_imgs
              var data = JSON.parse(res.data);
              if (data.code == 200) {
                var img = data.data[0];
                img.from_user_info = false;
                // 上传成功
                charm_imgs.push(img);
                charm_imgs_ids.push(img.id);
                that.setData({ charm_imgs: charm_imgs, charm_imgs_ids: charm_imgs_ids });

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

  //删除图片
  deleteImg: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var idx = e.currentTarget.dataset.idx;
    //util.alertShow(that, "success", "别急，还没做完");
    var params = { id: id };
    util.imgDel(params, function (res) {
      if (res.code == 200) {
        util.alertShow(that, "success", "删除成功");
        var cover_id = that.data.cover_id;
        if (id == that.data.cover_id) {
          cover_id = "";
        }
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
  setCover: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var idx = e.currentTarget.dataset.idx;
    var type = e.currentTarget.dataset.type;
    console.log(id);
    that.setData({
      cover_id: id,
    });

    var tmpArr = that.data.charm_imgs;
    //tmpArr[idx].selected = true
    tmpArr.map(function (item) {
      if (item.id == id) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
    that.setData({
      charm_imgs: tmpArr
    });

    util.alertShow(that, "success", "设置成功");
  }
})
