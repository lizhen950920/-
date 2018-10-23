
var util = require("../../../common/httpUtil.js");

Page({
  data: {
    mobile: "",
    id:"",
    username: "",
    code:"",
    send_text: '获取验证码',
    send_disabled: false,
    send_time: null,
    show:true,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log("onload");
    var that = this;
    
  },
  onReady: function () {
    // 页面渲染完成
  },

  sendSMSCode: function () {
    var that = this;
    if(!that.data.mobile){
      util.alertShow(that, "cancel", '请输入手机号');
      return;
    }

    this.setData({
      send_disabled: true
    })
    

    util.sendSms({mobile:that.data.mobile},function(res){
      console.log("res:",res);
      if(res.code == 200){
        // success
        // 开始倒计时
        that.setData({
          send_time: Math.round(+new Date() / 1000),
          username: res.data.username,
          id:res.data.id,
        });
        //wx.setStorageSync('uid', res.data.id);
        that.sendCountDown();
      }else{
        that.setData({
          send_disabled: false
        });
        util.alertShow(that, "cancel", res.message);
      }
    })
  },
  sendCountDown: function () {
    if (!this.data.send_time) {
      return
    }
    var seconds = this.data.send_time + 60 - Math.round(+new Date() / 1000)
    if (seconds > 0) {
      this.setData({
        send_text: `${seconds}s`
      })
      setTimeout(this.sendCountDown, 1000)
    } else {
      this.setData({
        send_text: '获取验证码',
        send_disabled: false,
        send_time: null
      })
    }
  },

  inputMobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  inputCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  
  saveOpenId:function(uid){
    var that = this;
    wx.login({
      success: function (loginRes) {
        getApp().globalData.js_code = loginRes.code;
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
  },

  loginOk: function (e) {
    var that = this;
    var params = {
      mobile: that.data.mobile,
      code: that.data.code,
    };
    util.validateCode(params,function(res){
      if(res.code == 200){
        var choose = res.data.choose;
        var id = res.data.id;
        wx.setStorageSync('uid', res.data.id);
        that.saveOpenId(id);

        var formId = e.detail.formId;
        console.log("登录formId:" + formId);
        util.saveFormId({ uid: res.data.id, formId: formId }, function (res) { });
        //登录成功去判定身份
        // if (choose == 0) {
        //   //去身份选择
        //   wx.redirectTo({
        //     url: '/pages/User/UserChoose?choose=0',
        //   })
        //   return;
        // } else { //个人资料主页
          if (!that.data.username || that.data.username == null) { //不存在跳转到用户编辑页面
            var url = '/pages/User/MyHome/personaldata/personaldata?id=' + id;
            //房东页面
            // if (choose == 3) {
            //   url = '/pages/User/HouseOwner/InfoView?id=' + id;
            // }
            wx.navigateTo({
              url: url,
            })
          } else {
            wx.switchTab({
              url: '/pages/User/user',
            })
          }
          
        //}

        
      }else{
        util.alertShow(that, "cancel", res.message);
        return;
      }
    });

  },
  mobileLogin:function(e){
    var that = this;
    that.setData({
      show:!that.data.show,
    });
  },

  //获取手机号码 微信登录
  getPhoneNumber: function (e) {
    var that =this;
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    wx.login({
      success: function (loginRes) {
        util.decodeUserInfo({ code: loginRes.code, iv: e.detail.iv, encryptedData: e.detail.encryptedData }, function (res) {
          console.log(res);
          if(res.code == 200){
            var phoneNumber = res.data.userInfo.phoneNumber;
            util.wechatLogin({ mobile: phoneNumber},function(res){
              if(res.code == 200){
                var id = res.data.id;
                var username = res.data.username;
                var choose = res.data.choose;
                //缓存uid
                wx.setStorageSync('uid', res.data.id);
                that.saveOpenId(id);
                wx.showModal({
                  title: '提示',
                  content:'登录成功',
                  showCancel:false,
                  success: function (res) {
                    if (res.confirm) {
                      
                      if (!username || username == 'undefined'){
                        //去个人资料编辑
                        wx.redirectTo({
                          url: '/pages/User/MyHome/personaldata/personaldata?id='+id,
                        })
                      
                      }else{
                        wx.switchTab({
                          url: '/pages/User/user',
                        })
                      }
                    }
                  }
                })
              }
            });
            
          }else{
            wx.showModal({
              title: '提示',
              content: '登录失败，请重新登录.',
            })
          }
        });
      }
    });

  }

  

});