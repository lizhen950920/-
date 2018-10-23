//app.js
var util = require("common/httpUtil.js");
App({
  onLaunch: function () {
    console.log("onLaunch..........");
    //新版本更新
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新新人类乐园有更新了，为了更好的体验，需重启以使用最新的功能？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })

    // this.getUserInfo();
    var uid = wx.getStorageSync("uid")
    if (uid){
      util.getUser({ uid: uid }, function (data) {
        if (data.code === 200) {
          var js_code = data.data.js_code;
          if (!js_code){
            wx.login({
              success: function (loginRes){
                //保存openid
                wx.request({
                  url: "https://api.xxpeople.com/common/saveOpenid",
                  data: {
                    uid: uid,
                    js_code: loginRes.code
                  },
                  header: { "Content-Type": "application/json" },
                  method: 'get',
                  success: function (res) {
                    console.log("save openid:" + res);
                  }
                })
              },
            })
          }
        }
      })
    }
  },

  getUserInfo: function () {
    var that = this;
    //获取定位信息
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
      },
      fail: function (res) {
        that.isAuth();
      }
    });

    
  },

  isAuth: function () {
    var that = this;
    //判断是否已授权

    wx.getSetting({
      success(res) {
        console.log("获取授权列表：" + res);
        if (!res.authSetting['scope.userLocation'] ) {
          var content = "新人，只有获得您的微信地理位置授权，才能给您提供更妥帖的服务喔"
          wx.showModal({
            title: '提示',
            content: content,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户重新授权..')
                wx.openSetting({
                  success: (res) => {
                    console.log(res)
                    if (!res.authSetting['scope.userLocation']) {
                      that.isAuth();
                    } else {
                      getApp().globalData.userLocation = true;
                    }

                  
                  }
                })
              }
            }
          });
        }
      }
    });
  },
  isLogin:function(){
    var loginUid = wx.getStorageSync("uid");
    if (!loginUid) {
      wx.showModal({
        title: '提示',
        content: '为了给您带来更好的体验，请先登录.',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/User/Login/Login',
            })
          }
        }
      })
    }
  },
  getWindowHeight: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight);
        that.globalData.height = res.windowHeight;
      }
    });
  },
  globalData: {
    userInfo: null,

    uid: 1,//only only for test
    js_code: "",
    height: 0,
    userLocation: false,
    userInfoFlag: false,
    loginUser: {
    }
  },
})