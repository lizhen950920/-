// pages/Xinxin/search.js
var util = require('../../common/httpUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    priceArray: [
      { 'id': '0', 'name': '不限', 'start': 0, 'end': 0 },
      { 'id': '1', 'name': '1K以下', 'start': 0, 'end': 1000 },
      { 'id': '2', 'name': '1k-2k', 'start': 1000, 'end': 2000 },
      { 'id': '3', 'name': '2k-3k', 'start': 2000, 'end': 3000 },
      { 'id': '4', 'name': '3k-4k', 'start': 3000, 'end': 4000 },
      { 'id': '5', 'name': '4k-5k', 'start': 4000, 'end': 5000 },
      { 'id': '6', 'name': '5k以上', 'start': 5000, 'end': 999999 },
    ],
    priceIndex: 0,
    priceId: 0,
    selecttype:0,
    selectprice:0,
    typeArray: [
      { 'id': '0', 'name': '不限'},
      { 'id': '1', 'name': '有房找室友' },
      { 'id': '2', 'name': '求房求室友' },
      { 'id': '3', 'name': '爱家生活中' },
    ],
    typeIndex: 0,
    typeId: 0,
    move_start:"",
    move_end:"",
    rent_start:"",
    rent_end:"",
    needReload:"",
    searchCondition:"",

  },

  bindPirceChange: function (e) {
    this.setData({
      priceIndex: e.detail.value,
      priceId: this.data.priceArray[e.detail.value].id,
    });
  },
  typeChange:function(e){
   
    var selecttype=e.currentTarget.dataset.idx;
    var typeIndex=e.currentTarget.dataset.value;
    var typeId = e.currentTarget.dataset.idx;
    this.setData({
      selecttype: selecttype,
      typeIndex: typeIndex,
      typeId: typeId,
    })
  },
  //改变价格
  changePriceId: function (e) {
    console.log(e)
    var priceIndex = e.currentTarget.dataset.priceid;
    var rent_start = e.currentTarget.dataset.start;
    var rent_end = e.currentTarget.dataset.end;
    console.log(e)
    var that = this;
    that.setData({
      priceIndex: priceIndex,
      rent_start: rent_start,
      rent_end: rent_end,
    });
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
      if (new Date(that.data.move_start).getTime() > new Date(moveDate).getTime()){
        wx.showModal({
          title: '错误',
          content:'结束日期不能低于开始日期哦.',
          showCancel:false,
        })
        return;
      }
      this.setData({
        move_end: moveDate,
      })
    }
    
  },

  ////调用第三方的api获取地理位置
  getAddress: function (longitude, latitude) {
    var that = this;
    if (that.data.areaName) {
      return;
    }
    util.latlng2City(latitude, longitude, function (response) {
      console.log("获取当前位置地址：" + response.result.address);
      console.log("获取当前位置城市：" + response.result.ad_info.city);

      var areaName = response.result.ad_info.city;
      if (areaName.length > 3) {
        areaName = areaName.substr(0, 2) + ".."
      }
      that.setData({
        areaName: areaName,
        selectedAddress: response.result.address,
        longitude: longitude,
        latitude: latitude,
      });
    });
  },

  //目的地地图选择
  chooseDest: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
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
    //console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var data = e.detail.value;
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    var searchCondition = {
      keyword: data.keyword,
      type: that.data.typeId,
      rent_start: that.data.rent_start,
      rend_end: that.data.rent_end,
      move_start: that.data.move_start,
      move_end: that.data.move_end,
      priceIndex: that.data.priceIndex,
      longitude: that.data.longitude,
      latitude: that.data.latitude,
    }
   
   that.setData({
     searchCondition: searchCondition,
     needReload:true
   })
    var searchCondition = JSON.stringify(that.data.searchCondition);
    console.log(searchCondition)
    //回到列表页面
    wx.navigateTo({
      url: '/pages/change/my/newMankind/newMankind?needReload=' +that.data.needReload + '&searchCondition=' + searchCondition,
    }) 
  },
  formReset: function () {
    var that = this;
    that.setData({
      keyword:"",
      typeIndex:0,
      typeId:0,
      priceIndex: 0,
      priceId: 0,
      move_start:"",
      move_end:""
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.getAddress(res.longitude, res.latitude)
      }
    });
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
    var that = this;





    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面

    //直接调用上一个页面的data方法，把数据显示到页面上
    if (prevPage && prevPage.route == "/pages/change/my/newMankind/newMankind") {
      var data = prevPage.data.searchCondition;
      if(data){
        that.setData({
          keyword: data.keyword,
          typeIndex: data.type ? data.type:0,
          typeId: data.type ? data.type:0,
          priceIndex: data.priceIndex ? data.priceIndex:0,
          priceId: data.priceIndex ? data.priceIndex:0,
          move_start: data.move_start ? data.move_start:'',
          move_end: data.move_end ? data.move_end:'',
        });
      }
    }
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