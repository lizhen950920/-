// pages/change/create/createFourthHome/createFourthHome.js
var util = require("../../../../common/httpUtil.js");
var common = require("../../../../common/common.js");

const AreaData = require("../../../../common/Area.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: "",
    none_value: "",
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
    user: "",
    showRoomArr: [1],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uid = wx.getStorageSync('uid');
    var that = this;
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
  startDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.start = e.detail.value,
    this.setData({
      start: e.detail.value
    })
    wx.setStorageSync('homeDetail', homeDetail)
  },
  endDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var endDate = new Date(e.detail.value).getTime();
    var startDate = new Date(this.data.start).getTime();
   
    if (endDate < startDate) {
      wx.showToast({
        title: '结束时间必须大于开始时间',
        icon: 'none',
        duration: 1000
      })

      return;
    }
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.end = e.detail.value;
    this.setData({
      end: e.detail.value
    })
    wx.setStorageSync('homeDetail', homeDetail)
  },

  // 申请截止时间
  applyDateChange: function (e) {
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.apply_end = e.detail.value;
    this.setData({
      apply_end: e.detail.value
    })
    wx.setStorageSync('homeDetail', homeDetail)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;

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
          male: "",
          female: "",
          old: "",
          room: "",
          hall: "",
          toilet: "",
          kitchen: "",
          area: "",
          total_price: "",
          deposit: "",
          found: "",
          address: "",
          pay:"",
          start:"",
          end:"",
          apply_end:"",
        }
        wx.setStorageSync('homeDetail', homeDetail);

      } else {
        console.log('有缓存')
        if (homeDetail.start){
          that.setData({
            start: homeDetail.start,
            end: homeDetail.end,
            apply_end: homeDetail.apply_end,
          })
        }
        that.setData({
          items: homeDetail,
          address: homeDetail.address,
         
         
          latitude: homeDetail.latitude,
          longitude: homeDetail.longitude,
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  bindinput5: function (e) {
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.introduction = e.detail.value
    var value = e.detail.value + "";
    this.setData({ introduction_length: value.length });
    wx.setStorageSync('homeDetail', homeDetail)
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
              console.log("upload res:" + res);
              try {
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
                      cover_id: cover_id,
                    })
                  }
                } else {
                  // 上传失败
                  util.alertShow(that, "cancel", "上传失败");
                }
              } catch (e) {
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
    var from_user_info = e.currentTarget.dataset.fromuserinfo;
    //util.alertShow(that, "success", "别急，还没做完");
    wx.showModal({
      title: '提示',
      content: '你确定要删除吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击删除');
          var params = { id: id };
          if (from_user_info) { //来至于用户资料的图片不可以从数据库中删除.
            that.handelDeleteImgCallBack(that, idx, type, id);
          } else {//自己上传的可以从数据库真正删除
            util.imgDel(params, function (res) {
              if (res.code == 200) {
                that.handelDeleteImgCallBack(that, idx, type, id);
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
        imageWidth: parseInt(that.data.imageWidth) - 1,
        idea_imgs: tmpArr
      });
    }
    util.alertShow(that, "success", "设置成功");
  },
  formSubmit: function (e) {
    var that = this;
    var data = e.detail.value;

    if (!that.data.start) {
      wx.showToast({
        title: '入住时间不能为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (!that.data.end) {
      wx.showToast({
        title: '结束时间不能为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (!data.introduction) {
      wx.showToast({
        title: '自我介绍不能为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    var homeDetail = wx.getStorageSync('homeDetail')
    console.log('homeDetail', homeDetail)
    var cover_id = wx.getStorageSync('cover_id')
    var idea_imgs_ids = wx.getStorageSync('idea_imgs_ids')
   data.desc=homeDetail.dream_home,
    data.name = homeDetail.name;
    data.latitude = homeDetail.latitude;
    console.log(data.latitude)
    data.longitude = homeDetail.longitude;
    data.declaration = homeDetail.declaration;
    // data.hope_roommate = homeDetail.hope_roommate;
    data.introduction = homeDetail.introduction;
    data.male = homeDetail.male;
    data.female = homeDetail.female;
    data.old = homeDetail.old;
    data.room = homeDetail.room;
    data.hall = homeDetail.hall;
    data.toilet = homeDetail.toilet;
    data.kitchen = homeDetail.kitchen;
    data.area = homeDetail.area;
    data.total_price = homeDetail.total_price;
    data.avgprice = homeDetail.avgprice;
    data.deposit = homeDetail.deposit;
    data.pay = homeDetail.pay;
    data.found = homeDetail.found;
    data.apply_end = homeDetail.apply_end;
    data.rooms = JSON.stringify(homeDetail.room_arr);
    var idea_imgs_ids = that.data.idea_imgs_ids;
  //  data.desc = homeDetail.dream_home;
    data.latitude = that.data.latitude;
    data.longitude = that.data.longitude;
    data.address = homeDetail.address;
    data.label = homeDetail.label;
    
    data.start = homeDetail.start;
    data.apply_end = homeDetail.apply_end;
    data.end = homeDetail.end;
    data.uid = that.data.uid;
    //手动设置值
    var idea_imgs_ids = wx.getStorageSync('idea_imgs_ids')
    data.charm_imgs_ids = that.data.charm_imgs_ids.toString();
    data.idea_imgs_ids = idea_imgs_ids.toString();
    data.cover_id = wx.getStorageSync('cover_id') ;
    var formId = e.detail.formId;
    console.log("创建爱家formId:" + formId);
    util.saveFormId({ uid: that.data.uid, formId: formId }, function (res) { });

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
          //清除缓存
          wx.removeStorageSync("homeDetail");
          wx.removeStorageSync("space_imgs");
          wx.removeStorageSync("idea_imgs");
          wx.removeStorageSync("idea_imgs_ids");
          wx.removeStorageSync("cover_id");

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
            items: "",
            homename_length: 0,
            declaration_length: 0,
            desc_length: 0,
            roommate_desc_length: 0,
            introduction_length: 0,
            none_value: "",
          });

          var _home = res.data;
          console.log(_home);
          //跳转到创家详情页面
          wx.reLaunch({
            //url: '/pages/CreateHome/CreateSuccess/CreateSuccess?id=' + _home.id + '&homeUid=' + that.data.uid,
            url: "/pages/change/my/ideeaHome/ideaHome?id=" + _home.id + "&uid=" + that.data.uid,
          });
        }
      }, 1000);
    });

  }
})