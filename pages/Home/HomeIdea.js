//index.js
var util = require('../../common/httpUtil.js');
//获取应用实例
var app = getApp()
var page = 1;//页码
var loading = false;
Page({
  data: {
    hiddent: true,
    items: [],
    loadicon: "",
    loadresult: "",
    inputShowed: true,
    inputVal: "",
    height: 0,
    home_id: "",
    uid: "",
    home_uid: "",
    comment: "",
    type: "1",
    pid: 0,
    commentUid: "",//某一个评论人uid
    focus: true,
    cursor: 0,
    submit: false,
  },
  commentInput: function (e) {

    var pos = e.detail.cursor;
    var _comment = e.detail.value;

    this.setData({
      comment: _comment,
      cursor: _comment.length,
      focus: true,
    });

  },
  //提交评论
  commentFormSubmit: function (e) {
    var that = this;


    var uid = wx.getStorageSync('uid');
    if (!uid || uid == "") {
      wx.showModal({
        title: '提示',
        content: '登录后才能评论',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/User/Login/Login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }
    var formId = e.detail.formId;
    console.log("留言或回复formId:" + formId);
    if (!that.data.comment) {
      wx.showToast({
        title: "内容不能为空",
        icon: 'success',
        duration: 2000,
      });
      return;
    }
    that.setData({
      submit: true,
    });
    //搜集formid
    util.saveFormId({ uid: uid, formId: formId }, function (res) { });
    this.addComment(that, e);

  },


  //回复评论
  replayClick: function (e) {
    var that = this;
    that.setData({
      pid: e.currentTarget.dataset.id,
      commentUid: e.currentTarget.dataset.uid,
      comment: "@" + e.currentTarget.dataset.username + ":",

    });

  },


  //提交评论到后台
  addComment: function (that, e) {

    var data = e.detail.value;
    var param = {
      home_id: that.data.home_id,
      home_uid: that.data.home_uid,
      comment: that.data.comment,
      uid: that.data.uid,
      pid: that.data.pid,
      type: that.data.type,
    };

    //发送模板消息
    var paramMsg = {};

    if (!that.data.comment.startsWith("@")) { //留言
      paramMsg = {
        uid: that.data.home_uid,
        loginUid: that.data.uid,
        msgType: 1,
        data: that.data.comment,
        title: that.data.title,
        page: 'pages/Comment/Comment?type=' + that.data.type + '&home_id=' + that.data.home_id + '&homeuid=' + that.data.home_uid + "&title=" + that.data.title,
      };
    } else {//回复

      paramMsg = {
        uid: that.data.commentUid,
        loginUid: that.data.uid,
        msgType: 2,
        data: that.data.comment,
        title: that.data.title,
        page: 'pages/Comment/Comment?type=' + that.data.type + '&home_id=' + that.data.home_id + '&homeuid=' + that.data.home_uid + "&title=" + that.data.title,
      };
    }

    util.sendTemplateMsg(paramMsg, function (res) {
      console.log("sendTemplateMsg：" + res);
    });

    //添加留言
    util.homeComment(param, function (res) {
      console.log(res);
      that.setData({
        submit: false,
      })
      if (res.code == 200) {
        util.showSuccess();
        wx.showToast({
          title: "提交成功",
          icon: 'success',
          duration: 2000,
        });
        var tempItmes = that.data.items;
        tempItmes.unshift(res.data);
        //console.log("tempItmes", tempItmes);
        that.setData({
          items: tempItmes,
          comment: "",
        });

      } else {
        util.alertShow(that, "cancel", res.message);
      }
    });
  },

  onLoad: function (options) {
    page = 1;
    console.log('onLoad')
    var that = this;

    wx.setNavigationBarTitle({
      title: options.type == 1 ? '留言' : '点子',
    });

    //加载数据
    that.setData({
      home_id: options.home_id,
      home_uid: options.homeuid,
      type: options.type,
      title: options.title,
      uid: wx.getStorageSync('uid'),
    });
    //获取最新数据
    this.refreshNewData(options);
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight);
        that.setData({
          height: res.windowHeight
        });
      }
    });
  },
  //刷新数据
  refreshNewData: function (options) {
    //加载提示框
    util.showLoading();

    var that = this;
    var params = {
      type: that.data.type,
      p: page,
      home_id: that.data.home_id,
    };

    util.getComment(params, function (res) {
      page = 1;
      that.setNewDataWithRes(res, that);
      setTimeout(function () {
        util.hideToast();
        wx.stopPullDownRefresh();
      }, 1000);
    });
  },

  //设置新数据
  setNewDataWithRes: function (res, target) {
    page += 1;
    console.log("setNewDataWithRes:", res.data);
    target.setData({
      items: target.data.items.concat(res.data)
    });
  },
  //监听用户下拉动作
  onPullDownRefresh: function () {
    this.refreshNewData();
  },
  //加载更多操作
  loadMoreData: function () {
    if (loading) {
      return;
    }
    loading = true;
    console.log("加载更多");
    //加载提示框
    util.showLoading();
    var that = this;

    var params = {
      type: that.data.type,
      p: page,
      home_id: that.data.home_id,
    };
    util.getComment(params, function (res) {

      that.setNewDataWithRes(res, that);
      setTimeout(function () {
        util.hideToast();
        wx.stopPullDownRefresh();
        loading = false;
      }, 1000);
    });
  },

});
