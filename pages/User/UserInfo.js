var httpUtil = require("../../common/httpUtil.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: "",
    imgs: [],
    imgsSize: 0,
    uid: "",
    ishow:false,

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
    console.log("用户信息：",options.uid);
    var isShow = options.isShow || false;
    var that = this;
    that.setData({
      uid: options.uid,
      isShow : isShow,
    });
    httpUtil.getUser({ uid: that.data.uid}, function (data) {
      console.log("getUser:{}", data.data);
      if (data.code === 200) {
        var _user = data.data;
        _user.isShow = isShow;
        that.setData({
          user: _user,
        });
      } else {
        console.log(data.message);
      }
    });
    var type = 2;
    httpUtil.getImgs(type, that.data.uid, that.data.uid, function (data) {
      console.log("getImgs:{}", data.data);
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
})