var util = require("../../common/httpUtil.js");
var common = require("../../common/common.js");

const AreaData = require("../../common/Area.js");

Page({
  data: {
    uid: "",
    rel_id: 0,
    charm_imgs_ids: [],
    idea_imgs_ids: [],
    cover_id: "",
    idea_imgs: [],
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
    addressName: '请选择',
    start: "",
    end: "",
    apply_end: "",
    foundChecked: "1",

    latitude: "",
    longitude: "",
    markers: "",
    scale: 14,
    address: "",
    isSubmitHome: false,
    imageWidth: "",
    home:"",
    home_id:"",
    homedesc:"",
    showRoomArr: [1],
  },

  addShowRoom: function (e) {

    var showRoomArr = this.data.home.rooms;
    if (showRoomArr.length >= 10) {
      util.alertShow(this, "cancel", "最多只能增加10个房间");
      return
    }
    showRoomArr.push({
      "home_id": this.data.home.id,
      "id": "",
      "room_area": "",
      "room_mark": "",
      "room_name": "",
      "room_price": ""
    });
    var tmpHome = this.data.home;
    tmpHome.rooms = showRoomArr;
    this.setData({
      home: tmpHome,
    })
  },
  homedescinput:function(e){
    this.setData({
      homedesc:e.detail.value,
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

  onUnload: function () {
    console.log("create Home onUnload");
  },
  // onHide: function () {
  //   var that = this;
  //   console.log("create Home onHide");
  //   //隐藏的时候要删除没有提交的图片
  //   if (!that.data.isSubmitHome) {
  //     var allIds = that.data.idea_imgs_ids.concat(that.data.charm_imgs_ids);
  //     var allIdStr = allIds.toString();
  //     console.log("allIdStr:", allIdStr);
  //     if (allIdStr) {
  //       util.delAllImgs({ ids: allIdStr }, function (res) {

  //       });
  //     }
  //   }
  // },
  foundChange: function (e) {
    this.setData({
      foundChecked: e.detail.value,
    });

  },
  startDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      start: e.detail.value
    })
  },
  applyDateChange: function (e) {
    this.setData({
      apply_end: e.detail.value
    })
  },
  endDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var endDate = new Date(e.detail.value).getTime();
    var startDate = new Date(this.data.start).getTime();
    if (endDate < startDate) {
      util.alertShow(this, "cancel", "结束时间必须大于开始时间");
      return;
    }
    this.setData({
      end: e.detail.value
    })
  },
  onShow: function () {
    var uid = wx.getStorageSync('uid');
    if (!uid || uid == "") {
      wx.navigateTo({
        url: '/pages/User/Login/Login',
      })
      return;
    }

    util.getUser({ uid: uid}, function (data) {
      if (data.code === 200) {
        var score = data.data.score;
        if (parseInt(score) < 251) {
          util.alertView("提示", "魅力值不足251，请完善个人信息后再来", function () {
            wx.navigateTo({
              url: '/pages/User/MyHome/personaldata/personaldata?id=' + uid,
            })
          });
          return;
        }
      }
    });
    
  },

  onLoad: function (option) {
    var that = this;
    var uid = wx.getStorageSync('uid');
    var id = option.id; //传递id

    var params = {
      uid: uid,
      id: id,
    };
    util.myhomeDetail(params, function (res) {
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

      var _charm_imgs = [];
      var _charm_imgs_ids = [];
      var _idea_imgs = [];
      var _idea_imgs_ids = [];
      var _cover_id="";
      tmpHome.charm_imgs.map(function(item){
        item.selected = false;
        
        if(item.type == 4){
          if (item.cover == 1) {
            item.selected = true
            _cover_id = item.id;
          }
          _idea_imgs.push(item);
          _idea_imgs_ids.push(item.id);
        }
        if (item.type == 3) {
         
          _charm_imgs.push(item);
          _charm_imgs_ids.push(item.id);
        }
      });

      
    
      that.setData({
        home: tmpHome,
        idea_imgs: _idea_imgs,
        idea_imgs_ids: _idea_imgs_ids,
        charm_imgs: _charm_imgs,
        charm_imgs_ids: _charm_imgs_ids,
        homedesc:tmpHome.desc,
        addressName: tmpHome.pca,
        provId: tmpHome.province,
        cityId: tmpHome.city_id,
        areaId: tmpHome.area_id,
        showPickerView: false,

        address:tmpHome.address,
        foundChecked: tmpHome.found,
        start: tmpHome.start,
        end: tmpHome.end,
        cover_id:_cover_id,
        home_id:id, 
        apply_end: tmpHome.apply_end,

      });
      
    });


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
  // js
  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },

  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },
  //点击预览图片
  previewImg: function (e) {
    if (this.endTime - this.startTime > 350) {
      return;
    }
    var idx = e.currentTarget.dataset.idx;
    var type = e.currentTarget.dataset.type;
    var that = this;
    var urls = [];
    if (type == 3) {
      that.data.charm_imgs.map(function (item) {
        urls.push(item.url);
      });
    } else if (type == 4) {
      that.data.idea_imgs.map(function (item) {
        urls.push(item.url);
      });
    }
    wx.previewImage({
      current: urls[idx], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  //提交表单
  formSubmit: function (e) {
    var that = this;
    var data = e.detail.value;
    console.log("charm_imgs_ids:", that.data.charm_imgs_ids.toString());
    console.log("idea_imgs_ids:", that.data.idea_imgs_ids.toString());
    console.log('创爱家form发生了submit事件，携带数据为：', data);

    //处理房间信息
    var room_arr = [];
    for (var i = 1; i <= that.data.home.rooms.length; i++) {
      
        room_arr.push({
          roomName: data['room_name_' + i],
          roomArea: data['room_area_' + i],
          roomPrice: data['room_price_' + i],
          roomMark: data['room_mark_' + i],
          id: data['room_id_' + i],
        })
      
    }
    console.log("room_arr json:", JSON.stringify(room_arr));

    //data validate
    if (!data.name) {
      util.alertShow(this, "cancel", "名字不能为空");
      return;
    }
    if (!data.declaration) {
      util.alertShow(this, "cancel", "创家宣言不能为空");
      return;
    }
    if (!data.desc) {
      util.alertShow(this, "cancel", "描述不能为空");
      return;
    }
    if (!data.roommate_desc) {
      util.alertShow(this, "cancel", "希望室友不能为空");
      return;
    }
    if (!that.data.address) {
      util.alertShow(this, "cancel", "地址不能为空");
      return;
    }
    // if (!that.data.foundChecked) {
    //   util.alertShow(this, "cancel", "是否有房不能为空");
    //   return;
    // }
    if (!data.avgprice) {
      util.alertShow(this, "cancel", "均价不能为空");
      return;
    }
    if (!data.total_price) {
      util.alertShow(this, "cancel", "总价不能为空");
      return;
    }
    if (!that.data.start) {
      util.alertShow(this, "cancel", "入住开始时间不能为空");
      return;
    }
    if (!that.data.end) {
      util.alertShow(this, "cancel", "入住结束时间不能为空");
      return;
    }
    if (!data.introduction) {
      util.alertShow(this, "cancel", "自我介绍不能为空");
      return;
    }
    if (!data.mobile) {
      util.alertShow(this, "cancel", "手机号不能为空");
      return;
    }
    if (!(/^1[34578]\d{9}$/.test(data.mobile))) {
      util.alertShow(this, "cancel", "请输入正确的手机号码");
      return;
    }
    if (!data.wechat) {
      util.alertShow(this, "cancel", "微信号不能为空");
      return;
    }
    if (that.data.charm_imgs_ids.length < 1 || that.data.charm_imgs_ids.length > 9) {
      util.alertShow(this, "cancel", "个人魅力照只能传1-9张");
      return;
    }
    if (that.data.idea_imgs_ids.length < 1) {
      util.alertShow(this, "cancel", "必须传一张爱家创想图");
      return;
    }
    if (!that.data.cover_id) {
      util.alertShow(this, "cancel", "必须设置某个创想图片为封面");
      return;
    }
    data.apply_end = that.data.apply_end;
    data.rooms = JSON.stringify(room_arr);

    data.latitude = that.data.latitude;
    data.longitude = that.data.longitude;
    data.address = that.data.address;

    data.found = that.data.foundChecked;
    data.start = that.data.start;
    data.end = that.data.end;
    data.uid = that.data.uid;
    data.apply_end = that.data.apply_end;

    //手动设置值
    data.charm_imgs_ids = that.data.charm_imgs_ids.toString();
    data.idea_imgs_ids = that.data.idea_imgs_ids.toString();
    data.cover_id = that.data.cover_id;

    data.id = that.data.home_id;

    util.showLoading("提交中");
    util.addHome(data, function (res) {
      console.log("addHome:", res);
      setTimeout(function () {
        util.hideToast();
        if (res.code == -1) {
          util.alertShow(that, "cancel", res.message);
          return;
        } else {
          util.alertShow(that, "success", res.message);
          that.setData({
            isSubmitHome: true,
          });
          var _home = res.data;
          console.log(_home);
          //跳转到创家成功页面
          wx.navigateTo({
            url: '/pages/CreateHome/CreateSuccess/CreateSuccess?id=' + _home.id + '&homeUid=' + that.data.uid,
          })

          //跳转到首页
          // wx.switchTab({
          //   url: '/pages/Aiqilin/Aiqilin'
          // })
        }
      }, 1000);
    });

  },

  testToSuccess: function () {
    wx.navigateTo({
      url: '/pages/CreateHome/CreateSuccess/CreateSuccess',
    })
  },

  //上传图片
  uploadImg: function (e) {
    var typeInt = e.currentTarget.dataset.type;
    console.log("typeInt:", typeInt);
    var that = this;

    if (typeInt == 3 && that.data.charm_imgs_ids.length >= 9) {
      util.alertShow(this, "cancel", "个人魅力照最多只能传9张");
      return;
    }
    if (typeInt == 4 && that.data.idea_imgs_ids.length >= 9) {
      util.alertShow(this, "cancel", "爱家创想图最多只能传9张");
      return;
    }
    var max = 9;
    var count = 0;
    if (typeInt == 3) {
      count = max - that.data.charm_imgs_ids.length;
    } else if (typeInt == 4) {
      count = max - that.data.idea_imgs_ids.length;
    }
    wx.chooseImage({
      count: count, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        for (var i = 0, lengths = tempFilePaths.length; i < lengths; i++) {
          var charm_imgs_ids = that.data.charm_imgs_ids
          var charm_imgs = that.data.charm_imgs
          var idea_imgs_ids = that.data.idea_imgs_ids
          var idea_imgs = that.data.idea_imgs

          console.log('charm_imgs_ids', charm_imgs_ids)
          console.log('charm_imgs', charm_imgs)
          console.log('idea_imgs_ids', idea_imgs_ids)
          console.log('idea_imgs', idea_imgs)

          wx.uploadFile({
            url: common.constans.domain + '/common/upload', //
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              uid: that.data.uid,
              rel_id: 0,
              'type': typeInt,

            },
            success: function (res) {
              var data = JSON.parse(res.data);
              if (data.code == 200) {
                var img = data.data[0];
                img.from_user_info = false;
                // 上传成功
                //data.data[0].url = "https://api.xxpeople.com" + data.data[0].url
                if (typeInt == 3) {
                  console.log('type4原图数量', charm_imgs)
                  charm_imgs.push(img);
                  charm_imgs_ids.push(img.id);
                  that.setData({ charm_imgs: charm_imgs, charm_imgs_ids: charm_imgs_ids });
                } else if (typeInt == 4) {
                  console.log('type4原图数量', idea_imgs)
                  idea_imgs.push(img)
                  idea_imgs_ids.push(img.id);
                  that.setData({ idea_imgs: idea_imgs, idea_imgs_ids: idea_imgs_ids })
                }
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

  //删除后的回掉处理方法
  handelDeleteImgCallBack: function (that, idx, type, id) {

    util.alertShow(that, "success", "删除成功");
    var cover_id = that.data.cover_id;
    if (id == that.data.cover_id) {
      cover_id = "";
    }
    if (type == 4) { //创想图
      var tmpArr = that.data.idea_imgs;
      var _tmpArr = tmpArr.splice(idx, 1);
      var tmp_idea_imgs = that.data.idea_imgs_ids;

      var index = tmp_idea_imgs.indexOf(id);
      if (index > -1) {
        tmp_idea_imgs.splice(index, 1);
      }

      that.setData({
        idea_imgs: tmpArr,
        idea_imgs_ids: tmp_idea_imgs,
        cover_id: cover_id,
      });
    } else { //魅力照
      var tmpArr = that.data.charm_imgs;
      var _tmpArr = tmpArr.splice(idx, 1);
      var tmp_charm_imgs = that.data.charm_imgs_ids;

      var index = tmp_charm_imgs.indexOf(id);
      if (index > -1) {
        tmp_charm_imgs.splice(index, 1);
      }

      that.setData({
        charm_imgs: tmpArr,
        charm_imgs_ids: tmp_charm_imgs,
        cover_id: cover_id,
      });
    }
  },

  //删除图片
  deleteImg: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var idx = e.currentTarget.dataset.idx;
    var type = e.currentTarget.dataset.type;
    
    //util.alertShow(that, "success", "别急，还没做完");
    wx.showModal({
      title: '提示',
      content: '你确定要删除吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击删除');
          var params = { id: id };
          util.imgDel(params, function (res) {
            if (res.code == 200) {
              that.handelDeleteImgCallBack(that, idx, type, id);
            } else {
              util.alertShow(that, "cancel", "删除失败");
            }
          });
          
        }
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
    if (type == 4) {
      var tmpArr = that.data.idea_imgs;
      tmpArr.map(function (item) {
        if (item.id == id) {
          item.selected = true;
        } else {
          item.selected = false;
        }
      });
      //tmpArr[idx].selected = true
      that.setData({
        idea_imgs: tmpArr
      });
    }
    util.alertShow(that, "success", "设置成功");
  }
})
