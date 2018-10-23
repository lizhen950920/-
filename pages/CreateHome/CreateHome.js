var util = require("../../common/httpUtil.js");
var common = require("../../common/common.js");

const AreaData = require("../../common/Area.js");

Page({
  data: {
    uid: "",
    none_value: "",
    rel_id: 0,
    charm_imgs_ids:[],
    idea_imgs_ids:[],
    cover_id:"",
    idea_imgs:[],
    charm_imgs:[],
    provId: '',                                                     //省ID
    cityId: '',                                                     //市ID
    areaId: '',                                                     //区ID
    showPickerView: false,                                          //控制省市区三级联动显隐
    value: [0, 0, 0],
    tempValue: [0, 0, 0],
    provArr: AreaData.result,                                       //省数组
    cityArr: AreaData.result[0].city,                               //市数组
    areaArr: AreaData.result[0].city[0].area,                       //区数组
    addressName:'请选择',
    start:"",
    end:"",
    apply_end:"",
    foundChecked:"1",

    latitude: "",
    longitude: "",
    markers: "",
    scale: 14,
    address:"",
    isSubmitHome:false,
    imageWidth: "",
    user:"",
    showRoomArr:[1],
    
  },
  addShowRoom:function(e){
    
    var showRoomArr = this.data.showRoomArr
    if (showRoomArr.length>=10){
      util.alertShow(this, "cancel", "最多只能增加10个房间");
      return
    }
    showRoomArr.push(showRoomArr.length + 1);
    this.setData({
      showRoomArr: showRoomArr,
    })
  },
  // 实时监测输入的数据长度
  bindinput1:function(e){
    // 输入的值都能获取到，那么让这个值字符串化并且获取字符串的长度就有了我需要的那个长度了，
    // 有了长度就可以赋值给那个length了，实时的就可以了
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.name = e.detail.value
    var value = e.detail.value + "";
    this.setData({
       homename_length: value.length,
    });
    wx.setStorageSync('homeDetail', homeDetail)
   
  },
  bindinput2:function(e) {
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.declaration = e.detail.value
    var value = e.detail.value + "";
    this.setData({ declaration_length: value.length });
    wx.setStorageSync('homeDetail', homeDetail)
  },
  bindinput3: function (e) {
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.dream_home = e.detail.value
    var value = e.detail.value + "";
    this.setData({ desc_length: value.length });
    wx.setStorageSync('homeDetail', homeDetail)
  },
  bindinput4: function (e) {
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.hope_roommate = e.detail.value
    var value = e.detail.value + "";
    this.setData({ roommate_desc_length: value.length, })
    wx.setStorageSync('homeDetail', homeDetail)
  },
  bindinput5: function (e) {
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.introduction = e.detail.value
    var value = e.detail.value + "";
    this.setData({ introduction_length: value.length });
    wx.setStorageSync('homeDetail', homeDetail)
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
  onReady:function(){
    console.log("sssss");
  },
  onUnload:function(){
    console.log("create Home onUnload");
  },
 
  foundChange: function(e){
    this.setData({
      foundChecked : e.detail.value,
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
  onLoad: function (){
    
    /*wx.showModal({
      title: '提示',
      content: '厉害的爱家发起人，你在个人资料页编辑的“个人魅力照、理想空间、理想室友、联系信息”已经同步到这里，你可以对它们继续编辑',
      showCancel: false
    })*/
  },
  onShow:function(){
    var that = this
    var uid = wx.getStorageSync('uid');
    if (!uid || uid == "") {
      wx.switchTab({
        url: '/pages/User/user',
      })
      return;
    }
    that.setData({
      uid:uid,
    });
    if (!that.data.user){
      util.getUser({ uid: uid}, function (data) {
        if (data.code === 200) {
          var score = data.data.score;
          that.setData({
            user:data.data,
            
          });
          if (parseInt(score) < 251) {
            util.alertView("提示", "魅力值不足251，请完善个人信息后再来", function () {
              wx.navigateTo({
                // url: '/pages/User/MyHome/UserDataEditor/UserDataEditor?uid=' + uid,
                url: '/pages/User/MyHome/personaldata/personaldata?uid=' + uid,
              })
            });
            return;
          }
        }
      });
    }
    // 读取缓存
    if (!that.data.items){
      var homeDetail = wx.getStorageSync('homeDetail')
      console.log(homeDetail);
      
      if (!homeDetail) {
        console.log('无缓存');
        var homeDetail = {
          name:"",
          declaration: "",
          dream_home:"",
          hope_roommate: "",
          introduction:"",
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
        var width = res.windowHeight / 5 - 10;
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
    if(type == 3){
      that.data.charm_imgs.map(function (item) {
        urls.push(item.url);
      });
    }else if(type ==4){
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
    //处理房间信息
    var room_arr = [];
    for (var i = 1; i <= that.data.showRoomArr.length; i++) {
      room_arr.push({
        roomName: data['room_name_' + i],
        roomArea: data['room_area_' + i],
        roomPrice: data['room_price_' + i],
        roomMark: data['room_mark_' + i],
      })
    }
    console.log("room_arr json:", JSON.stringify(room_arr));


    console.log("charm_imgs_ids:",that.data.charm_imgs_ids);
    console.log("idea_imgs_ids:",that.data.idea_imgs_ids);
    console.log('创爱家form发生了submit事件，携带数据为：', data);
    //data validate
    if(!data.name){
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
    if (that.data.charm_imgs.length < 1 || that.data.charm_imgs.length>9) {
      util.alertShow(this, "cancel", "个人魅力照只能传1-9张");
      return;
    }

    data.apply_end = that.data.apply_end;
    data.rooms = JSON.stringify(room_arr);
    var idea_imgs_ids = that.data.idea_imgs_ids
    console.log('11111', idea_imgs_ids)
    if (idea_imgs_ids.length < 1) {
      util.alertShow(this, "cancel", "必须传一张爱家创想图");
      return;
    }
    if (!that.data.cover_id) {
      util.alertShow(this, "cancel", "必须设置某张创想图片为封面");
      return;
    }
    data.latitude = that.data.latitude;
    data.longitude = that.data.longitude;
    data.address = that.data.address;

    data.found = that.data.foundChecked;
    data.start = that.data.start;
    data.apply_end= that.data.apply_end;
    data.end=that.data.end;
    data.uid=that.data.uid;
    //手动设置值
    data.charm_imgs_ids = that.data.charm_imgs_ids.toString();
    data.idea_imgs_ids = that.data.idea_imgs_ids.toString();
    data.cover_id = that.data.cover_id;

    
    util.showLoading("提交中");
    //搜集formid
    var formId = e.detail.formId;
    console.log("创建爱家formId:" + formId);
    util.saveFormId({ uid: that.data.uid, formId: formId }, function (res) { });

    util.addHome(data, function (res) {
      console.log("addHome:", res);
      setTimeout(function () {
        util.hideToast();
        if(res.code == -1){
          util.alertShow(that, "cancel", res.message);
          return;
        }else{
          util.alertShow(that, "success", res.message);
          that.setData({
            isSubmitHome:true,
          });
          //清除缓存
          wx.removeStorageSync("homeDetail");
          //清除已经存储的数据
          that.setData({
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
            foundChecked: "1",
            latitude: "",
            longitude: "",
            markers: "",
            scale: 14,
            address: "",
            isSubmitHome: false,
            items:"",
            homename_length	: 0,
            declaration_length	: 0, 
            desc_length	: 0,
            roommate_desc_length	: 0,
            introduction_length:0,
            none_value:"",
          });

          var _home = res.data;
          console.log(_home);
          //跳转到创家详情页面
          wx.redirectTo({
            //url: '/pages/CreateHome/CreateSuccess/CreateSuccess?id=' + _home.id + '&homeUid=' + that.data.uid,
            url: "/pages/User/MyLdealHome/LdealHome/LdealHome?id=" + _home.id + "&uid=" + that.data.uid,
          });
        }
      }, 1000);
    });

  },

  testToSuccess:function(){
    wx.navigateTo({
      url: '/pages/CreateHome/CreateSuccess/CreateSuccess',
    })
  },
  
  //上传图片
  uploadImg:function(e){
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
              console.log("upload res:" + res);
              try{
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
                    var cover_id = that.data.cover_id || img.id;
                    that.setData({
                      idea_imgs: idea_imgs, 
                      idea_imgs_ids: idea_imgs_ids,
                      cover_id:cover_id,
                    })
                  }
                } else {
                  // 上传失败
                  util.alertShow(that, "cancel", "上传失败");
                }
              }catch(e){
                console.log(e)
                util.alertShow(that, "cancel", "啊哦，上传失败了");
              }
            }
          })
        }
      }
    })
  },

  //删除后的回掉处理方法
  handelDeleteImgCallBack: function (that, idx,type,id){

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
  deleteImg:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var idx = e.currentTarget.dataset.idx;
    var type = e.currentTarget.dataset.type;
    var from_user_info = e.currentTarget.dataset.fromuserinfo;
    //util.alertShow(that, "success", "别急，还没做完");
    wx.showModal({
      title: '提示',
      content: '你确定要删除吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击删除');
          var params = { id: id };
          if (from_user_info){ //来至于用户资料的图片不可以从数据库中删除.
            that.handelDeleteImgCallBack(that, idx, type, id);
          }else{//自己上传的可以从数据库真正删除
            util.imgDel(params, function (res) {
              if (res.code == 200) {
                that.handelDeleteImgCallBack(that, idx,type,id);
                /*
                util.alertShow(that, "success", "删除成功");
                
                var cover_id = that.data.cover_id;
                if (id == that.data.cover_id) {
                  cover_id = "";
                }
                if (type == 4) {
                  var tmpArr = that.data.idea_imgs;
                  var _tmpArr = tmpArr.splice(idx, 1);
                  var tmp_idea_imgs = that.data.idea_imgs_ids;

                  var index = tmp_idea_imgs.indexOf(id);
                  if (index > -1) {
                    tmp_idea_imgs.splice(index, 1);
                  }

                  that.setData({
                    idea_imgs: _tmpArr,
                    idea_imgs_ids: tmp_idea_imgs,
                    cover_id: cover_id,
                  });
                } else {
                  var tmpArr = that.data.charm_imgs;
                  var _tmpArr = tmpArr.splice(idx, 1);
                  var tmp_charm_imgs = that.data.charm_imgs;

                  var index = tmp_charm_imgs.indexOf(id);
                  if (index > -1) {
                    tmp_charm_imgs.splice(index, 1);
                  }

                  that.setData({
                    charm_imgs: _tmpArr,
                    charm_imgs_ids: tmp_charm_imgs,
                    cover_id: cover_id,
                  });
                }*/
              } else {
                util.alertShow(that, "cancel", "删除失败");
              }
            });
          }
        }
      }
    });

    
  },

  //设置封面图片
  setCover: function(e){
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
        imageWidth: parseInt(that.data.imageWidth)-1,
        idea_imgs : tmpArr
      });
    }
    util.alertShow(that, "success", "设置成功");
  }
})
