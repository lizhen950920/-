// pages/Aiqilin/Search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude:"",
    latitude:""
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length -2];  //上一个页面
     
    //直接调用上一个页面的data方法，把数据显示到页面上
    if (prevPage && prevPage.route == "pages/change/Homepage/Honepage") {
      that.setData({
        prevPage: prevPage,
        // selectedAddress: prevPage.data.selectedAddress,
        longitude: prevPage.data.searchCondition.longitude,
        latitude: prevPage.data.searchCondition.latitude,
      })

    }
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
  //目的地地图选择
  chooseDest: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.data.prevPage.setData({
          selectedAddress: res.address,
        });
       
        that.setData({
          selectedAddress: res.address,

          longitude: res.longitude,
          latitude: res.latitude,

        });
     
      }
    })

  },
  formSubmit: function (e) {
    var that = this;
    var data = e.detail.value;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面

    //直接调用上一个页面的data方法，把数据显示到页面上
    if (prevPage && prevPage.route == "pages/change/Homepage/Honepage") {
      prevPage.setData({
        needReload: true,
        search: true,
        searchCondition: {
          keyword: that.data.selectedAddress,
          longitude: that.data.longitude,
          latitude: that.data.latitude,
          type: 2,
        },
      });
    }

    wx.switchTab({
      url: '/pages/change/Homepage/Honepage',
    })
  },

  formReset: function () {
    var that = this;
    that.setData({
      keyword: "",
      selectedAddress: "",
    });
  },







})