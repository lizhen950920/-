// pages/change/create/createSenHome/createSenHome.js
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
    found:'',
  },
  // 更改返回按钮出现的返回页面错误
  navback:function(){
    wx.navigateBack({
      delta:1
    })
  },
  bindinput1: function (e) {
    // 输入的值都能获取到，那么让这个值字符串化并且获取字符串的长度就有了我需要的那个长度了，
    // 有了长度就可以赋值给那个length了，实时的就可以了
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.male = e.detail.value
    var value = e.detail.value + "";
    wx.setStorageSync('homeDetail', homeDetail)

  },
  bindinput2: function (e) {
    // 输入的值都能获取到，那么让这个值字符串化并且获取字符串的长度就有了我需要的那个长度了，
    // 有了长度就可以赋值给那个length了，实时的就可以了
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.female = e.detail.value
    var value = e.detail.value + "";
    wx.setStorageSync('homeDetail', homeDetail)

  },
  bindinput3: function (e) {
    // 输入的值都能获取到，那么让这个值字符串化并且获取字符串的长度就有了我需要的那个长度了，
    // 有了长度就可以赋值给那个length了，实时的就可以了
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.old = e.detail.value
    var value = e.detail.value + "";
    wx.setStorageSync('homeDetail', homeDetail)

  },
  bindinput4: function (e) {
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.room = e.detail.value
    var value = e.detail.value + "";
    wx.setStorageSync('homeDetail', homeDetail)
  },
  bindinput5: function (e) {
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.hall = e.detail.value
    var value = e.detail.value + "";
    wx.setStorageSync('homeDetail', homeDetail)
  },
  bindinput6: function (e) {
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.toilet = e.detail.value
    var value = e.detail.value + "";
    wx.setStorageSync('homeDetail', homeDetail)
  },
  bindinput7: function (e) {
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.kitchen = e.detail.value
    var value = e.detail.value + "";
    wx.setStorageSync('homeDetail', homeDetail)
  },
  bindinput8: function (e) {
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.area = e.detail.value
    var value = e.detail.value + "";
    wx.setStorageSync('homeDetail', homeDetail)
  },
  bindinput9: function (e) {
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.total_price = e.detail.value
    var value = e.detail.value + "";
    wx.setStorageSync('homeDetail', homeDetail)
  },
  bindinput10: function (e) {
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.avgprice = e.detail.value
    var value = e.detail.value + "";
    wx.setStorageSync('homeDetail', homeDetail)
  },
  bindinput11: function (e) {
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.deposit = e.detail.value
    var value = e.detail.value + "";
    wx.setStorageSync('homeDetail', homeDetail)
  },
  bindinput12: function (e) {
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.pay = e.detail.value
    var value = e.detail.value + "";
    wx.setStorageSync('homeDetail', homeDetail)
  },

  foundChange: function (e) {
    var homeDetail = wx.getStorageSync('homeDetail')
     homeDetail.found = e.detail.value,
       console.log(e.detail.value)
    this.setData({
      foundChecked: e.detail.value,
      
    });
    wx.setStorageSync('homeDetail', homeDetail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    var that = this
    var uid = wx.getStorageSync('uid');
    if (!uid || uid == "") {
      wx.switchTab({
        url: '/pages/User/user',
      })
      return;
    }
    that.setData({
      uid: uid,
    });
    if (!that.data.user) {
      util.getUser({ uid: uid }, function (data) {
        if (data.code === 200) {
          var score = data.data.score;
          that.setData({
            user: data.data,

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
          male:"",
          female:"",
          old:"",
          room:"",
          hall:"",
          toilet:"",
          kitchen:"",
          area:"",
          total_price:"",
          deposit:"",
          found:"",
          address:"",
          pay:'',
        }
        wx.setStorageSync('homeDetail', homeDetail);
      } else {
        console.log('有缓存')
        if (homeDetail.address){that.setData({
          address: homeDetail.address
        })

        }
        that.setData({
          items: homeDetail,
         
        })
      }
    }
  },
  formSubmit: function (e) {
    var that = this;
    var data = e.detail.value;
    console.log("charm_imgs_ids:", that.data.charm_imgs_ids);
    console.log("idea_imgs_ids:", that.data.idea_imgs_ids);
    console.log('创爱家form发生了submit事件，携带数据为：', data);
   
    if (!data.avgprice) {
      wx.showToast({
        title: '均价不能为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (!data.total_price) {
      wx.showToast({
        title: '总价不能为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
 

    wx.navigateTo({
      url: '/pages/change/create/createThrHome/createThrHome',
    })
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
  chooseMap: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log("name", res.name);
        console.log("address", res.address);
        console.log("latitude", res.latitude);
        console.log("longitude", res.longitude);
        var homeDetail = wx.getStorageSync('homeDetail')
          homeDetail.address = res.address;
        homeDetail.latitude = res.latitude;
        homeDetail.longitude = res.longitude;
        wx.setStorageSync('homeDetail', homeDetail)
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
})