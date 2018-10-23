// pages/Xinxin/detail.js
var util = require("../../common/httpUtil.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    agree:0,
    buttontext: "同意互换联系方式",
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
    //todo 这里要交互一下位置
    util.getUser({ "uid": wx.getStorageSync('uid'), 'loginUid': uid}, function (data) {
      console.log("getUser:{}", data.data);
      if (data.code === 200) {
        var _user = data.data;
        that.setData({
          user: _user,
          agree: _user.apply,
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

  //交换联系方式 - 同意申请
  agreeConcat: function (e) {
    let that = this;
    var formId = e.detail.formId;
    console.log("交换联系方式formId:" + formId);
    //搜集formid
    util.saveFormId({ uid: that.data.user.id, formId: formId }, function (res) { });

    var loginUid = wx.getStorageSync('uid');
    //发送模板消息
    var paramMsg = {
      uid: that.data.user.id, //发送给对方
      msgType: 6,
      loginUid: loginUid, //登录人uid
      data: "电话 " + that.data.user.mobile,
      title: "同意联系方式申请",
      page: "pages/User/UserInfo?uid=" + loginUid
    };
    //同意申请
    util.agreeChangeConcat({ "uid": loginUid, "apply_uid": that.data.user.id }, function (res) {
      console.log(res);
      that.setData({
        disabledState: false,
      });
      if (res.code == 200) {
        wx.showModal({
          title: '提示',
          content: '同意成功，已通知申请者，你们接下来可以互加微信，祝你们聊的开心^O^',
          showCancel: false,
          success: function (res) {
            that.setData({
              agree: 1,
            });
          }
        })
      } else {
        util.alertShow(that, "cancel", res.message);
      }
    });
    util.sendTemplateMsg(paramMsg, function (res) {
      console.log("sendTemplateMsg：" + res);
      if(res.code == 200){
        //util.alertShow(that, "cancel", "发送信息成功");   
        console.log("发送信息成功");     
      }else{
        //util.alertShow(that, "cancel", "发送信息失败");
        console.log("发送信息失败");
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