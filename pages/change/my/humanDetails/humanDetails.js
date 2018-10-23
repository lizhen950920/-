// pages/Xinxin/detail.js
var util = require("../../../../common/httpUtil.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    emotional:['','单身','婚恋','保密']
  },

  //点击预览图片
  previewImg: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var that = this;
    var urls = [];
    that.data.user.charm_imgs.map(function (item) {
      urls.push(item.url);
    });
    wx.previewImage({
      current: urls[idx], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var uid = options.uid;
    util.getUser({ 'uid': uid, "loginUid": wx.getStorageSync('uid') }, function (data) {
      console.log("getUser:{}", data.data);
      if (data.code === 200) {
        var _user = data.data;
        if (_user.apply == 1) {
          _user.isShow = true;
        } else {
          _user.isShow = false;
        }
        that.setData({
          user: _user,
        });
      } else {
        console.log(data.message);
      }
    });
    var type = 2;
    util.getImgs(type, uid, uid, function (data) {
      if (data.code === 200) {
        console.log(data.data.length);
        that.setData({
          imgs: data.data,
          imgsSize: data.data.length,
        });
      } else {
        console.log(data.message);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    if (prevPage && prevPage.route == "pages/Xinxin/list") {
      prevPage.setData({
        needReload: false,
      });
    }
  },

  //交换联系方式 - 申请
  changeConcat: function (e) {
    let that = this;
    var formId = e.detail.formId;
    console.log("交换联系方式formId:" + formId);
    //搜集formid
    util.saveFormId({ uid: that.data.user.id, formId: formId }, function (res) { });

    var loginUid = wx.getStorageSync('uid');
    //发送模板消息
    var paramMsg = {
      uid: that.data.user.id, //发送给对方
      msgType: 5,
      loginUid: loginUid, //登录人uid
      data: "电话 " + that.data.user.mobile,
      title: "互换联系方式申请",
      page: "pages/Xinxin/agreeDetail?uid=" + loginUid
    };
    //发送模板消息
    util.sendTemplateMsg(paramMsg, function (res) {
      console.log("sendTemplateMsg：" + JSON.stringify(res));
      if (res.code == 200) {

      } else {
        //util.alertShow(that, "cancel", "发送消息失败~");
      }
    });

    //发送申请
    util.applyChangeConcat({ "uid": that.data.user.id, "apply_uid": loginUid }, function (res) {
      console.log(res);
      if (res.code == 200) {
        wx.showModal({
          title: '提示',
          content: '提交成功，请耐心等待对方的回音',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })

      } else {
        util.alertShow(that, "cancel", res.message);
        if (res.message == '请不要重复申请') {
          that.setData({
            applyed: 1,
          });
        }
      }
    });

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

  }
})