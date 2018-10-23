var httpUtil = require("../../../common/httpUtil.js");
var common = require("../../../common/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    move_end:'',
    live:'true',
    typeArray: [{
      'id': '1',
      'name': '有房找室友'
    }, {
      'id': '2',
      'name': '求房求室友'
    }, {
      'id': '3',
      'name': '爱家生活中'
    },],
    typeIndex: 0,
    typeId: 1,
    Movietype:[
      { value: '有房找室友', checked: false},
      { value: '求房求室友', checked: false},
     
    ],
    Movietype1: [
      { value: '有房出租', click: false},
      { value: '爱家爱生活', click: false},
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    try {
      var res = wx.getSystemInfoSync()
      var sdkverion = res.SDKVersion.replace(/\./g, '');
      if (parseFloat(sdkverion) < 141) {
        wx.showToast({
          title: '微信版本太低，无法使用本页面的功能.',
          icon: 'success',
          duration: 2000
        })
      }
    } catch (e) {
      // Do something when catch error
    }
    //判断是否登录 =》可以去掉
    var uid = wx.getStorageSync('uid');
    if (!uid || uid == "") {
      wx.navigateTo({
        url: '/pages/User/Login/Login',
      })
      return;
    }

 
        that.setData({
          userInfo: wx.getStorageSync('userInfo')
        })
      

    var id = options.id || uid;
    var that = this;
    //加载用户数据
    httpUtil.showLoading();
    console.log("id={}", id);
    httpUtil.getUser({ uid: id }, function (data) {
      console.log("getUser:{}", data.data);
      httpUtil.hideToast();
      if (data.code === 200) {
        that.setData({
          user: data.data,
          uid: data.data.id,
          sexIndex: !data.data.sex ? 0 : parseInt(data.data.sex) - 1,
          marryIndex: !data.data.marry ? 0 : parseInt(data.data.marry) - 1,
          typeIndex: !data.data.type ? 0 : parseInt(data.data.type) - 1,
          constellationIndex: !data.data.constellation ? 0 : parseInt(data.data.constellation) - 1,
          constellationId: data.data.constellation,
          birth: data.data.birth,
          age: data.data.age,
          hope_live: data.data.hope_live,
          hope_roommate: data.data.hope_roommate,
          //userinfo: getApp().globalData.userInfo,

        });
      } else {
        console.log(data.message);
      }
    });
    httpUtil.getImgs("1,2", id, id, function (data) {
      console.log("getImgs:{}", data.data);
      if (data.code === 200) {
        console.log(data.data.length);
        var charmData = [];
        var liveData = [];

        var charm_imgs_ids_tmp = [];
        var live_imgs_ids_tmp = [];

        data.data.map(function (item) {
          if (item.type == 1) {
            charmData.push(item);
            charm_imgs_ids_tmp.push(item.id);
          } else if (item.type == 2) {
            liveData.push(item);
            live_imgs_ids_tmp.push(item.id);
          }
        });


        that.setData({
          charm_imgs: charmData,
          charm_imgs_ids: charm_imgs_ids_tmp,
          live_imgs_ids: live_imgs_ids_tmp,
          live_imgs: liveData,
        });
      } else {
        console.log(data.message);
      }
    });

  },
  bindTypeChange: function (e) {
    this.setData({
      typeIndex: e.detail.value,
      typeId: this.data.typeArray[e.detail.value].id,
    })
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
  select_date:function(e){
    console.log(e)
    var index = e.currentTarget.dataset.key;
    if (this.data.Movietype[index].checked == false) {
      this.data.Movietype[index].checked = true;
    } else if (this.data.Movietype[index].checked == true) {
      this.data.Movietype[index].checked = false;
    }
    this.setData({
      live:true,
      Movietype: this.data.Movietype,
    });
  },
  select_date1: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.key;
    if (this.data.Movietype1[index].click == false) {
      this.data.Movietype1[index].click = true;
      
    } else if (this.data.Movietype1[index].click == true) {
      this.data.Movietype1[index].click = false;
    }
    this.setData({
     
      live:false,
      Movietype1: this.data.Movietype1,
    });
  },
  // bindMoveChange: function (e) {
  //   let move = e.detail.value;
  //   this.setData({
  //     "move_start": move
  //   })
    
  // },
  bindMoveChange: function (e) {
    var that = this;
    var moveDate = e.detail.value;
    var ctype = e.currentTarget.dataset.type
    var user = that.data.user;
    if (ctype == "1") {
      user.move_start = moveDate;
    } else {
      user.move_end = moveDate;
    }
    this.setData({
      user: user,
    })
  },
  bindMoveChange1: function (e) {
    let time = e.detail.value;

    this.setData({
      "move_end": time
    })

  },
  address: function () {
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
            hope_live: res.address,
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
  bindtap1: function (e) {
    var value = e.detail.value
    this.setData({
      hope_roommate: value
    })
  },
  formSubmit:function(e){
   try {
      var that = this;
      var data = e.detail.value;
      console.log("charm_imgs_ids:", that.data.charm_imgs_ids.toString());
      data.rent_start = that.data.user.rent_start;
      data.hope_roommate = that.data.user.hope_roommate;
      data.move_start = that.data.user.move_start;
      data.move_end = that.data.user.move_end;
      data.hope_live = that.data.hope_live;
      //设置用户的uid
      data.id = that.data.user.id;

      //搜集formId
      var formId = e.detail.formId;
      console.log("个人资料编辑formId:" + formId);
      httpUtil.saveFormId({ uid: that.data.user.id, formId: formId }, function (res) { });

      // //判断是否已授权
      var that = this;
      //判断是否已授权

      //设置头像.如果没有头像则设置为默认的头像.
      data.avatar = that.data.userInfo.avatarUrl || "https://api.xxpeople.com/upload/noavatar.png";
      httpUtil.showLoading("提交中");
      console.log("用户编辑：", data);
      //配置
      httpUtil.userEdit(data, function (res) {
        console.log("用户编辑返回结果:", res);
        setTimeout(function () {
          httpUtil.hideToast();
          if (res.code === -1) {
            httpUtil.alertShow(that, "cancel", "美好的新人，你还有必填选项没有填哦");
            return;
          } else {
            httpUtil.alertShow(that, "success", res.message);
            //跳转到首页
            wx.switchTab({
              url: '/pages/User/user'
            })
          }
        }, 1000);
      });
    } catch (e) {
      console.log("出错了:" + e);
      httpUtil.alertShow(this, "cancel", "出错了");
    }
  }
})