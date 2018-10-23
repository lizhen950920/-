//index.js
var util = require('../../../common/httpUtil.js');
var AreaData = require("../../../common/Area.js");


//获取应用实例
var app = getApp()

Page({
  data: {
    addressName: "",
    areaName: "",
    provId: '',                                                     //省ID
    cityId: '',                                                     //市ID
    areaId: '',                                                     //区ID
    showPickerView: false,                                          //控制省市区三级联动显隐
    value: [0, 0, 0],
    tempValue: [0, 0, 0],
    provArr: AreaData.result,                                       //省数组
    cityArr: AreaData.result[0].city,                               //市数组
    areaArr: AreaData.result[0].city[0].area,                       //区数组
    regionId:0,
    keyword: "",

    priceArray: [
      { 'id': '0', 'name': '不限', 'start': 0, 'end': 0 },
      { 'id': '1', 'name': '0-1000', 'start': 0, 'end': 1000 },
      { 'id': '2', 'name': '1000-2000', 'start': 1000, 'end': 2000 },
      { 'id': '3', 'name': '2000-3000', 'start': 2000, 'end': 3000 },
      { 'id': '4', 'name': '3000-4000', 'start': 3000, 'end': 4000 },
      { 'id': '5', 'name': '4000-5000', 'start': 4000, 'end': 5000 },
      { 'id': '6', 'name': '5000以上', 'start': 5000, 'end': 999999 },
    ],
    priceIndex: 0,
    priceId: 0,
    scoreArray: [
      { 'id': '0', 'name': '不限', 'value': 0 },
      { 'id': '1', 'name': '200以下', 'value': 200 },
      { 'id': '2', 'name': '300以上', 'value': 300 },
      { 'id': '3', 'name': '400以上', 'value': 400 },
    ],
    scoreIndex: 0,
    scoreId: 0,

  },

  //打开省市区三级联动
  openPickerView() {
    this.setData({ showPickerView: true });
  },
  //关闭省市区三级联动
  closePickerView() {
    console.log("closePickerView");
    this.setData({ showPickerView: false });
  },

  //三级联动触发方法
  bindChange: function (e) {
    let val = e.detail.value
    if (val[0] != this.data.tempValue[0]) {
      val = [val[0], 0, 0]
    }
    if (val[1] != this.data.tempValue[1]) {
      val = [val[0], val[1], 0]
    }
    console.log('bindChange:', val);
    this.setData({
      tempValue: val,
      value: val,
      cityArr: AreaData.result[val[0]].city,
      areaArr: AreaData.result[val[0]].city[val[1]].area,
    })
  },
  //省市区三级联动确定
  confirmPickerView() {
    console.log("confirmPickerView");
    let val = this.data.value;
    let provName = AreaData.result[val[0]].name;
    let cityName = AreaData.result[val[0]].city[val[1]].name;
    let areaName = AreaData.result[val[0]].city[val[1]].area[val[2]].name;
    let addressName = provName + cityName + areaName;
    let provId = AreaData.result[val[0]].id;
    let cityId = AreaData.result[val[0]].city[val[1]].id;
    let areaId = AreaData.result[val[0]].city[val[1]].area[val[2]].id;
    this.setData({
      addressName: addressName,
      provId: provId,
      cityId: cityId,
      areaId: areaId,
      regionId: areaId,
      showPickerView: false,
      areaName: areaName,
    })
  },


  onLoad: function () {

  },

  //清除搜索条件
  resetSearch: function () {
    var that = this;
    that.setData({
      scoreIndex: 0,
      priceIndex: 0,
      regionIndex: 0,
      scoreId: 0,
      priceId: 0,
      regionId: 0,
      addressName: "",
      areaName: "",
      keyword: "",
    });

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面

    //直接调用上一个页面的data方法，把数据显示到页面上
    if (prevPage && prevPage.route == "pages/Aiqilin/Aiqilin") {
      prevPage.setData({
        searchCondition: {
          type: 1,
        }
      })
    }
  },
  keywordInput: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  bindPirceChange: function (e) {
    this.setData({
      priceIndex: e.detail.value,
      priceId: this.data.priceArray[e.detail.value].id,
    });
  },
  bindScoreChange: function (e) {
    this.setData({
      scoreIndex: e.detail.value,
      scoreId: this.data.scoreArray[e.detail.value].id,
    });
  },



  onSubmit: function (e) {
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面

    //直接调用上一个页面的data方法，把数据显示到页面上
    if (prevPage && prevPage.route == "pages/Aiqilin/Aiqilin") {
      prevPage.setData({
        needReload: true,
        searchCondition: {
          keyword: that.data.keyword,
          score: that.data.scoreId,
          hobbies: 0,
          avgpricestart: that.data.priceArray[that.data.priceId].start,
          avgpriceend: that.data.priceArray[that.data.priceId].end,
          area: that.data.regionId,
          type: 3,
        },
        searchConditionIndex: {
          scoreIndex: that.data.scoreIndex,
          scoreId: that.data.scoreId,
          priceIndex: that.data.priceIndex,
          priceId: that.data.priceId,
          regionIndex: that.data.regionIndex,
          regionId: that.data.regionId,
          addressName: that.data.addressName,
          areaName: that.data.areaName,
          keyword: that.data.keyword,
        }
      });
    }

    wx.switchTab({
      url: '/pages/Aiqilin/Aiqilin',
    })
  },

  onShow: function () {
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面

    //直接调用上一个页面的data方法，把数据显示到页面上
    if (prevPage && prevPage.route == "pages/Aiqilin/Aiqilin") {
      var data = prevPage.data.searchConditionIndex;
      if (data) {
        that.setData({
          scoreIndex: data.scoreIndex,
          scoreId: data.scoreId,
          priceIndex: data.priceIndex,
          priceId: data.priceId,
          regionId: data.regionId,
          addressName: data.addressName,
          areaName: data.areaName,
          keyword: data.keyword,
        })
      }
    }
  }


});
