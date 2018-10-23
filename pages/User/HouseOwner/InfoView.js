var httpUtil = require("../../../common/httpUtil.js");
// userhomepage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: "",
    imgs: [],
    imgsSize: 0,
    charm_imgs_ids: [], //魅力照图片
    charm_imgs: [],
    live_imgs_ids: [], //理想居住空间
    live_imgs: [],
    id: "",
    mobile: "",
    uid: "",
    userInfo: "",
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

    var userInfo = getApp().globalData.userInfo;

    var id = options.id;
    var that = this;
    console.log("MyHome id={}", id);
    httpUtil.getUser({ uid: id}, function (data) {
      console.log("getUser:{}", data.data);
      if (data.code === 200) {
        that.setData({
          user: data.data,
          uid: id,
          userInfo: userInfo
        });

      } else {
        console.log(data.message);
      }
    });
    httpUtil.getImgs(1, id, id, function (data) {
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

  zmxyAuth: function () {
    console.log("zmxyAuth");
    var param = {
      id: "",//省份证号
      name: ""//姓名
    };
    httpUtil.zhimaAuthInfoAuth(param, function (res) {
      console.log(res.message);
      //todo 后台返回芝麻信用h5页面.

    });
  }


})