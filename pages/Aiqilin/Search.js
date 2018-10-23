// pages/Aiqilin/Search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    priceId:0,
    roomId:0,
    move_start: "",
    move_end: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面

    //直接调用上一个页面的data方法，把数据显示到页面上
    if (prevPage && prevPage.route == "pages/change/futureCity/futurecity") {
      that.setData({
        
        prevPage: prevPage,
        selectedAddress: prevPage.data.selectedAddress,
        // keyword: prevPage.data.searchCondition.keyword,
        roomId: prevPage.data.searchCondition.room||0,
        longitude: prevPage.data.searchCondition.longitude,
        latitude: prevPage.data.searchCondition.latitude,
        priceId: prevPage.data.searchCondition.priceId||0,
        move_start: prevPage.data.searchCondition.move_start || "",
        move_end: prevPage.data.searchCondition.move_end ||""
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
  bindMoveChange: function (e) {
    var that = this;
    var moveDate = e.detail.value;
    var ctype = e.currentTarget.dataset.type
    var user = that.data.user;
    if (ctype == "1") {
      this.setData({
        move_start: moveDate,
      })
    } else {
      if (new Date(that.data.move_start).getTime() > new Date(moveDate).getTime()) {
        wx.showModal({
          title: '错误',
          content: '结束日期不能低于开始日期哦.',
          showCancel: false,
        })
        return;
      }
      this.setData({
        move_end: moveDate,
      })
    }

  },
  //改变房间
  changeRoomId:function(e){
    var id = e.currentTarget.dataset.roomid;
    var that = this;
    that.setData({
      roomId: id,
    });
  },
  //改变价格
  changePriceId: function (e) {
    var id = e.currentTarget.dataset.priceid;
    var that = this;
    that.setData({
      priceId: id,
    });
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
    if (prevPage && prevPage.route == "pages/change/futureCity/futurecity") {
      var priceStart = that.data.priceId == 0 ? 0 : ((parseInt(that.data.priceId) - 1) *1000);
      var priceEnd = that.data.priceId == 6 ? 99999 : parseInt(that.data.priceId) * 1000;
      prevPage.setData({
       newselected:true,
        searchCondition: {
          keyword: data.keyword,
          room: that.data.roomId,
          longitude: that.data.longitude,
          latitude: that.data.latitude,
          // avgpricestart: priceStart,
          // avgpriceend: priceEnd,
          // priceId:that.data.priceId,
          move_start: that.data.move_start,
          // move_end: that.data.move_end,
          type: 3,
        },
      });
    }

    wx.switchTab({
      url: '/pages/change/futureCity/futurecity',
    })
  },

  formReset: function () {
    var that = this;
    that.setData({
      keyword: "",
      selectedAddress:"",
      roomId: 0,
      priceId: 0,
      move_start: "",
      move_end: ""
    });
  },







})