var util = require("../../../common/httpUtil.js");
var common = require("../../../common/common.js");
const AreaData = require("../../../common/Area.js");
var loading = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:"http://admin.xxpeople.com/upload/images/aqgy/3.jpg",
    hotcity:'',
    sorting1:'',
    loveList:false,
    label:'',
    motif:'',
    height:400,
    avgpricestart:'',
    disselected: 'navi-selected',
    more: false,
    treatmentId: 0,
    showYear: false,
    showTreatment: false,
    showMore: false,
    nodata: false,
    homeList: [],
    searchCondition: {},
    needReload: true,
    areaName: "",
    lonlat: {},
    isNoData: true,
    autoplay: true,
    avgpriceend:'',
    interval: 3000,
    duration: 1000,
    disselected: 'navi-selected',
    indicatorDots: false,
    selectIndex: '0',
    roomList: [],
    residueTime:[],
    loveapartmentList:[],
    city: "",
    yearId: 0,
    moreId: '0100',
    listId: '0101',
    contant: '',
    latitude: '',
    longitude: '',
    rentId: 0,
    sortingId: 1,
    treatmentId: 0,
    showYear: false,
    showTreatment: false,
    selectTime:'',
    showMore: false,
    nodata: false,
    areaArr: AreaData.result[0].city[0].area,
    isNoData: false,
    selectIndex: '0',
    selecttheme:'1',
    selectShow:'',
    selectconditions:'',
    house: 1,
    solicite: 1,
    residue:[],
    selectedAddress:'',
    e: '',
    type: '',
    width:'',
    subject:false,
    loveApartment: false,
    handpick:true,
    time:'',
    Loveresidue:[],
    sift:[],
    idealcityId:'',
    theme: [{
        id: 1,
        name: "小森林",
      checked: false,
      }, {
        id: 2,
        name: "萌萌哒",
        checked: false,
      },
      {
        id: 3,
        name: '智能家',
        checked: false,
      },
      {
        id: 4,
        name: '舌尖味',
        'checked': false,
      }, {
        id: 5,
        name: '学院风',
          checked: false,
      },
      {
        id: 6,
        name: '健身派',
        checked: false,
      },
      {
        id: 7,
        name: '影视人',
        checked: false,
      },
      {
        id: 8,
        name: '音乐族',
        checked: false,
      }, {
        id: 9,
        name: 'loft',
        checked: false,
      },
      {
        id: 10,
        name: '欢乐颂',
        checked: false,
      },

    ],
    distance: [{
        id: 1,
        name: '1Km',
      },
      {
        id: 3,
        name: '3Km',
      },
      {
        id: 5,
        name: '5Km',
      },
      {
        id: 0,
        name: '不限',
      }
    ],
    rent: [{
        "rent": "不限",
        "id": "0"
      },
      {
        "rent": "1000元以下",
        "id": "1"
      },
      {
        "rent": "1000-2000",
        "id": "2"
      },
      {
        "rent": "2000-3000",
        "id": "3"
      },
      {
        "rent": "3000-4000",
        "id": "4"
      },
      {
        "rent": "4000-5000",

        "id": "5"
      },
      {
        "rent": "5000以上",
        "id": "6"
      }
    ],
    treatment: [{
      "treatment": "不限",
      "id": "0"
    }, {
      "treatment": "7天内",
      "id": "1"
    }, {
      "treatment": "7天后",
      "id": "2"
    }, {
      "treatment": "15天后",
      "id": "3"
    }, {
      "treatment": "30天后",
      "id": "4"
    }, {
      "treatment": "45天后",
      "id": "5"
    }],
    sorting: [{
        "sorting": " 时间最新",
        "id": "1"
      }, {
        "sorting": " 价格升序",
        "id": "2"
      },
      {
        "sorting": "价格降序",
        "id": "3"
      },
      {
        "sorting": "距离最近",
        "id": "4"
      }
    ],
  },
  area: function() {
    this.setData({
      showRent: false,
      showTreatment: false,
      showMore: false,
      showsorting: false,
    })
  },

  workRent: function() { // 工作年限
    this.setData({
      showRent: !this.data.showRent,
      showTreatment: false,
      showMore: false,
      showsorting: false
    })
  },

  //区域：区县
  county: function (e) {
    var that = this;

    var area = e.currentTarget.dataset.id;
    var params = that.data.searchCondition;
    params.p = 1;
    params.area = e.currentTarget.dataset.id;
    that.gethomeList(params);
    console.log(e)
    console.log('area', area)
    that.setData({
      area: area,
      showMore: false,
    })
  },
//选择主题
  selectTheme:function(e){
console.log(e)
    var that = this;
    var id = e.currentTarget.dataset.val.id;
    var name = e.currentTarget.dataset.val.name;
    var idx = e.currentTarget.dataset.idx;
    var selecttheme = e.currentTarget.dataset.idx;
    var label = e.currentTarget.dataset.val.id;
    console.log(that.data.theme[idx].checked)
    if (that.data.theme[idx].checked == false) {
      that.data.theme[idx].checked = true;
    } 
    console.log(that.data.theme[idx].checked)
    that.setData({
      loveApartment:false,
      motif:name,
      theme: that.data.theme,
      selecttheme: selecttheme,
      loveList:true,
      subject:true,
    })
    var type = {
      'type': 3
    };
    var p = {
      'page': 1
    };
    wx.request({
      url: 'http://api.xxpeople.com/apihome/search',
      header: {
        'content-type': "application/x-www-form-urlencoded",
      },
      data: {
        label: label,
        type: 3,
     
      },
      method: 'POST',
      success: function (res) {
        console.log('res', res.data)
        var loveapartmentList = res.data.data || [];
        var size = loveapartmentList.length;
        that.setData({
          loveapartmentList: loveapartmentList
        })
        //控制是否有数据
        var isNoData = true;
        if (that.data.loveapartmentList.length == 0) {
          isNoData = false;
        }
        that.setData({
          isNoData: isNoData,
        })

        if (loveapartmentList.length == 0) {
          that.setData({
            nodata: true
          })
          wx.showToast({
            title: '没有更多数据了.',
            icon: 'success',
            duration: 2000
          })
          return;
        }
        //设置报名截止时间
        var Loveresidue = [];
        var date1 = new Date();
        for (var i = 0; i < that.data.loveapartmentList.length; i++) {
        var date3 = new Date(loveapartmentList[i].apply_end) - date1;
        var days = Math.floor(date3 / (24 * 3600 * 1000))
          if (days<0){
            Loveresidue.push([0])
            that.setData({
              Loveresidue: Loveresidue,
              

            }); 
          }else{
         
          Loveresidue.push([days])
        that.setData({
          Loveresidue: Loveresidue,
          endDay: days > 0 ? days : 0,
         
        }); 
          }
          
        }
        console.log('Loveresidue', Loveresidue)
        // var Loveresidue = [];
        // var time = util.formatTime(new Date());
        // var date = new Date(time);
        // var date = new Date(time.replace(/-/g, '/'));
        // var time3 = date.getTime();
        // console.log('timeend', time3)
        // // 再通过setData更改Page()里面的data，动态更新页面的数据
        // // that.setData({
        // //   time: time
        // // });
        // // console.log('time', time)
        // for (var i = 0; i < that.data.loveapartmentList.length; i++) {
        //   var strtime = loveapartmentList[i].end;
        //   var date = new Date(strtime);
        //   var time1 = date.getTime();
        //   console.log('timeend', time1)
        //   //剩余多少时间戳计算
        //   var residueTime = time1 - time3
        //   var date = new Date(residueTime);
        //   var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        //   console.log('M', M)
        //   var D = date.getDate() + ' ';
        //   console.log('D', D)
        //   Loveresidue.push([M + '个月' + D + '日'])
        //   that.setData({
        //     Loveresidue: Loveresidue
        //   })
        // }
      }
    })
  
  },
  // 附近距离
  near: function (e) {
    var that = this;
    var near = e.currentTarget.dataset.id;
    console.log('near', near)
    var near = {
      near: near
    }
    var type = {
      'type': 3
    };
    var p = {
      'page': 1
    };
    that.setData({
      near: near,
      showMore: false,
    })
    var cityId = wx.getStorageSync("cityId");
    var city = {
      city: cityId
    }
    var keyword = {
      'keyword': ''
    };
    var newSearchData = Object.assign({}, city, near, p, keyword, type); //新的筛选条件is  OK!

    wx.request({
      url: 'http://api.xxpeople.com/apihome/search',
      header: {
        'content-type': "application/x-www-form-urlencoded",
      },
      data: newSearchData,
      method: 'POST',
      success: function (res) {
        console.log('res', res.data)
        var homeList = res.data.data || [];
        var size = homeList.length;
        that.setData({
          homeList: homeList
        })
      
        //控制是否有数据
        var isNoData = true;
        if (that.data.homeList.length == 0) {
          isNoData = false;
        }
        that.setData({
          isNoData: isNoData,
        })

        if (homeList.length == 0) {
          that.setData({
            nodata: true
          })
          wx.showToast({
            title: '没有更多数据了.',
            icon: 'success',
            duration: 2000
          })
          return;
        }
      }
    })
  },
  /**入住时间选择 */
  selectTreatment: function (e) {
    var that = this;
    var timeid = e.currentTarget.dataset.id;
    var selectTime = e.currentTarget.dataset.idx;
    console.log(timeid)
    var intime = {
      intime: timeid
    }
    var type = {
      'type':3
    };
    var p = {
      'page': 1
    };
 
    that.setData({
      selectTime: selectTime,
      intime: intime,
      showTreatment: false,
    })
    var keyword = {
      'keyword': ''
    };
    var newSearchData = Object.assign({},  intime, p, keyword, type); //新的筛选条件is  OK!
    wx.request({
      url: 'http://api.xxpeople.com/apihome/search',
      header: {
        'content-type': "application/x-www-form-urlencoded",
      },
      data: newSearchData,
      method: 'POST',
      success: function (res) {
        console.log('res', res.data)
        var homeList = res.data.data || [];
        var size = homeList.length;
        that.setData({
          homeList: homeList
        })
        //控制是否有数据
        var isNoData = true;
        if (that.data.homeList.length == 0) {
          isNoData = false;
        }
        that.setData({
          isNoData: isNoData,
        })

        if (homeList.length == 0) {
          that.setData({
            nodata: true
          })
          wx.showToast({
            title: '没有更多数据了.',
            icon: 'success',
            duration: 2000
          })
          return;
        }
      }
    })
  },
  //薪资待遇
  treatment: function() {
    this.setData({
      showTreatment: !this.data.showTreatment,
      showRent: false,
      showMore: false,
      showsorting: false
    })
  },
  //更多条件
  more: function() {
    this.setData({
      showMore: !this.data.showMore,
      showRent: false,
      showTreatment: false,
      showsorting: false
    })
  },

  sorting: function() {
    this.setData({
      showsorting: !this.data.showsorting,
      showRent: false,
      showTreatment: false,
      showMore: false
    })

  },
  //精选
  distancenear: function() {
    var that = this;
    that.setData({
      more: false,
      handpick:true,
      disselected: 'navi-selected',
      newselected: '',
      love_apartment: '',
      loveList:false,
      loveApartment:false,
      motif:'',
    })
    util.getIamges(1, function(res) {
      that.setData({
        imgUrls: res.data
      })
      var sift = [];
      var date1 = new Date();
      for (var i = 0; i < res.data.length; i++) {
        var date3 = new Date(res.data[i].apply_end) - date1;
        var days = Math.floor(date3 / (24 * 3600 * 1000))
        if (days < 0) {
          sift.push([0])
          that.setData({
            sift: sift,


          });
        } else {

          sift.push([days])
          that.setData({
            sift: sift,
            endDay: days > 0 ? days : 0,

          });
        }
      }
    });
 
    
    // var sift = [];
    // var time = util.formatTime(new Date());
    // var date = new Date(time);
    // var date = new Date(time.replace(/-/g, '/'));
    // var time3 = date.getTime();
    // console.log('timeend', time3)
    // // 再通过setData更改Page()里面的data，动态更新页面的数据
    // that.setData({
    //   time: time
    // });
    // console.log('time', time)
    // for (var i = 0; i < that.data.imgUrls.length; i++) {
    //   var strtime = that.data.imgUrls[i].apply_end;
    //   var date = new Date(strtime);
    //   var time1 = date.getTime();
    //   console.log('timeend', time1)
    //   //剩余多少时间戳计算
    //   var residueTime = time1 - time3
    //   if (residueTime<0){
    //     sift.push(['已到期'])

    //     that.setData({
    //       sift: sift
    //     })
    //   }else{
    //   var date = new Date(residueTime);
    //   var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //   console.log('M', M)
    //   var D = date.getDate() + ' ';
    //   console.log('D', D)
    //   sift.push([M + '个月' + D + '日'])

    //   that.setData({
    //     sift: sift
    //   })
    // }
    // }
  },
  //爱情公寓
  loveApartment: function() {
    var that = this;
    var params = that.data.searchCondition;
    params.p = 1;
    params.city='';
    params.type = 3;
    params.label=0;
    that.gethomeList(params);
    this.setData({
      love_apartment: 'navi-selected1',
      disselected: '',
      newselected: '',
      loveList: true,
      loveApartment: true,
      handpick: false,
      more: false,
     
    })
  },
  //点击跳转爱情公寓十大主题
  Apartment:function(){
    wx.navigateTo({
      url: '/pages/change/futureCity/loveApartment/loveApartment?selecttheme=' + this.data.selecttheme,
    })
  },
  theme:function(){
    wx.navigateTo({
      url: '/pages/change/futureCity/loveApartment/loveApartment?selecttheme=' + this.data.selecttheme +'&selecttheme='+ 0,
    })
  },
  //更多
  newest: function() {
    var that = this;
    console.log("newest");
    var params = that.data.searchCondition;
    params.p = 1;
    params.label='';
    params.city = that.data.idealcityId;
    params.catagroy = 2;
    that.gethomeList(params);
    that.setData({
      more: 'true',
      handpick: false,
      disselected: '',
      newselected: 'navi-selected',
      love_apartment: '',
      loveList:false,
      loveApartment: false,
      motif:'',
    })
  },
  // 获取市区
  getCityArea: function(e) {
    var that = this;
    console.log('市id', e)
    if (!e) {
      var pid = 110000
    } else {
      var pid = e;
    }

    console.log('pid', pid)
    wx.request({
      url: 'https://api.xxpeople.com/common/getCityArea',
      header: {
        'content-type': "application/x-www-form-urlencoded",
      },
      data: {
        pid: pid
      },
      method: 'POST',
      success: function(res) {
        console.log('res', res.data)
        var areaList = res.data.data || [];
        var size = areaList.length;
        that.setData({
          areaList: areaList
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

  
    util.getIamges(1, function(res) {
      that.setData({
        imgUrls: res.data
      })
    });
    
    that.setData({
      more: false,
      disselected: 'navi-selected',
      newselected: '',
    })
 
    wx.getSystemInfo({
      success: function(res) {
        console.log(res.windowHeight);
        that.setData({
          height: res.windowHeight,
          width: res.windowWidth,
        });
      }
    });
  },
  clickAdd: function() {
    wx.navigateTo({
      url: '/pages/CreateHome/CreateHome',
    })
  },
  //点击搜索输入框
  searchCondition: function() {
    wx.navigateTo({
      url: '/pages/Aiqilin/Search',
    })
  },

  //调用第三方的api获取地理位置
  getAddress: function(longitude, latitude) {
    var that = this;
    if (that.data.areaName) {
      return;
    }

    util.latlng2City(latitude, longitude, function(response) {
      var areaName = response.result.ad_info.city;

      if (areaName.length > 3) {
        areaName = areaName.substr(0, 2) + ".."
      }
      that.setData({
        areaName: areaName,
        selectedAddress: response.result.address,
      });
      
    });
  },

  //获取用户列表
  gethomeList: function (params) {
    var that = this;
    loading = true;
    util.showLoading("加载中...");
    util.getIamges(1, function (res) {
      that.setData({ imgUrls: res.data })
      var sift = [];
      var date1 = new Date();
      for (var i = 0; i < res.data.length; i++) {
        var date3 = new Date(res.data[i].apply_end) - date1;
        var days = Math.floor(date3 / (24 * 3600 * 1000))
        if (days < 0) {
          sift.push([0])
          that.setData({
            sift: sift,


          });
        } else {

          sift.push([days])
          that.setData({
            sift: sift,
            endDay: days > 0 ? days : 0,

          });
        }
      }
    });
    that.getLonLat(function (res) {
      var latitude = res.latitude
      var longitude = res.longitude

      that.getAddress(longitude, latitude);

      params.longitude = params.longitude || longitude;
      params.latitude = params.latitude || latitude;
      util.getSearchHomeList(params, function (userRes) {
        if (userRes.code == 200) {
          var data = userRes.data;
          loading = false;
          that.bindData(params, data);
        } else {
          console.log('fail');
        }
      });
    });

  },
  //绑定数据到页面
  bindData: function(params, data) {
    var that = this;


    //停止加载....
    setTimeout(function() {
      util.hideToast();
      if (loading) {
        loading = false;
      }
      wx.stopPullDownRefresh();
    }, 1000);
    var homeList = that.data.homeList;
    if (params.p == 1) {
      homeList = data;
    } else {
      //todo 双重循环的判断性能可能不好;
      for (var i = 0; i < data.length; i++) {
        var index = homeList.findIndex(function(item) {
          return item.id == data[i].id;
        });
        if (index == -1) {
          homeList.push(data[i]);
        }
      }
    }

    that.setData({
      homeList: homeList,
    })
    var residue = [];
    var date1 = new Date();
    for (var i = 0; i < homeList.length; i++) {
      var date3 = new Date(homeList[i].apply_end) - date1;
      var days = Math.floor(date3 / (24 * 3600 * 1000))
      if (days < 0) {
        residue.push([0])
        that.setData({
          residue: residue,
        });
      } else {

        residue.push([days])
        that.setData({
          residue: residue,
          endDay: days > 0 ? days : 0,

        });
      }
    }
    console.log('homeList', residue)
    // var residue = [];
    // var time = util.formatTime(new Date());
    // var date = new Date(time);
    // var date = new Date(time.replace(/-/g, '/'));
    // var time3 = date.getTime();
    // console.log('timeend', time3)
    // // 再通过setData更改Page()里面的data，动态更新页面的数据
    // that.setData({
    //   time: time
    // });
    // console.log('time', time)
    // for (var i = 0; i < that.data.homeList.length; i++) {
    //   var strtime = homeList[i].apply_end;
    //   var date = new Date(strtime);
    //     var time1= date.getTime();
    //   console.log('timeend', time1)
    // //剩余多少时间戳计算
    //   var residueTime = time1 - time3
    //   var date = new Date(residueTime);
    //   var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) ;
    //   console.log('M',M)
    //  var  D = date.getDate() + ' ';
    //  console.log('D',D)
    //   residue.push([M +'个月'+ D+'日'])
     
    //   that.setData({
    //     residue: residue
    //   })
    // }
    console.log('residue',residue)
    //控制是否有数据
    var isNoData = true;
    if (that.data.homeList.length == 0) {
      isNoData = false;
    }
    that.setData({
      isNoData: isNoData,
    })
    if (data.length == 0) {
      wx.showToast({
        title: '没有更多数据了.',
        icon: 'success',
        duration: 2000
      })
      return;
    }

  },
  //获取经纬度
  getLonLat: function(cb) {
    var that = this;
    if (JSON.stringify(that.data.lonlat) === "{}") {
      wx.getLocation({
        type: 'wgs84',
        success: function(res) {
          that.setData({
            lonlat: {
              longitude: res.longitude,
              latitude: res.latitude,
            }
          });
          cb(res);
        }
      });
    } else {
      cb(that.data.lonlat);
    }
  },

  switchSlider(e) {
    this.setData({
      'selectIndex': e.target.dataset.index
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  //排序
  showsorting:function(e){
console.log(e)
    var that = this;
    var selectShow = e.currentTarget.dataset.idx;
    var sorteid = e.currentTarget.dataset.id;
    var cityId = wx.getStorageSync('idealcityId');
     var city = {
      city: cityId
    }
    that.setData({
      showRent: false,
      showTreatment: false,
      showMore: false,
      showsorting: false,
    })
    console.log(sorteid)
    var latitude = that.data.lonlat.latitude;
    var longitude = that.data.lonlat.longitude;
    var latitude = {
      latitude: latitude
    }
    var longitude = {
      longitude: longitude
    }
    var order = {
      order: sorteid
    }
    var type = {
      'type': 3
    };
    var p = {
      'page': 1
    };
    var keyword = {
      'keyword': ''
    };
    var newSearchData = Object.assign({}, latitude, longitude,order, p, type); //新的筛选条件is  OK!

    wx.request({
      url: 'http://api.xxpeople.com/apihome/search',
      header: {
        'content-type': "application/x-www-form-urlencoded",
      },
      data: newSearchData,
      method: 'POST',
      success: function(res) {
        console.log('res', res.data)
        var homeList = res.data.data || [];
        var size = homeList.length;
        that.setData({
          homeList: homeList
        })
        //控制是否有数据
        var isNoData = true;
        if (that.data.homeList.length == 0) {
          isNoData = false;
        }
        that.setData({
          isNoData: isNoData,
        })

        if (homeList.length == 0) {
          that.setData({
            nodata: true
          })
          wx.showToast({
            title: '没有更多数据了.',
            icon: 'success',
            duration: 2000
          })
          return;
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
 
    var that = this;
    var idealcityId = wx.getStorageSync('idealcityId');
  
    console.log('that.data', that.data.searchCondition)
    var city = wx.getStorageSync('idealhotcity');
    that.setData({
      city: city,
      idealcityId: idealcityId,
      showsorting: false,
      showTreatment: false,
      showRent: false,
      showMore: false,
      loveApartment:false,
      posters:false
    })
    if (!city) {
      wx.showModal({
        title: '',
        content: '请点击跳转选择相应的城市',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/change/futureCity/city/city',
            })
          }
        }
      })
    }
    var that = this;
    var e = that.data.idealcityId;
    that.getCityArea(e);
   
    //从详情页面或搜索页面返回
    if (!that.data.needReload) {
      return;
    }
    if (that.data.hotcity){
     
    }
    //从搜索页面返回或第一次进入
    var params = that.data.searchCondition;
    params.p = 1;
    // params.city = idealcityId;
    params.city = idealcityId;
    that.gethomeList(params);
    if (that.data.love_apartment){
      console.log('进来了')
      var params = that.data.searchCondition;
      console.log(params)
      params.p = 1;
      var motif = params.name;
     
      that.loveapartmentList(params);
      that.setData({
        loveApartment: false,
        handpick: false,
        loveList:true,
        more: false,
        motif: motif,
        love_apartment: 'navi-selected1',
        disselected: '',
        newselected: '',
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    that.setData({
      posters:false
    })
    console.log("onPullDownRefresh");
    var params = that.data.searchCondition;
    params.p = 1;
    that.gethomeList(params);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("onReachBottom");
    var that = this;
    var params = that.data.searchCondition;
    params.p = parseInt(params.p) + 1;
    params.longitude = that.data.lonlat.longitude;
    params.latitude = that.data.lonlat.latitude;

    that.gethomeList(params);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  cancel:function(){
    this.setData({
      loveApartment:false
    })
  },
  loveapartmentList: function (params) {
    var that = this;
    loading = true;
    that.getLonLat(function (res) {
      var latitude = res.latitude
      var longitude = res.longitude

      that.getAddress(longitude, latitude);

      params.longitude = params.longitude || longitude;
      params.latitude = params.latitude || latitude;
      util.getSearchHomeList(params, function (userRes) {
        if (userRes.code == 200) {
          var data = userRes.data;
          loading = false;
          that.bindData1(params, data);
        } else {
          console.log('fail');
        }
      });
    });

  },
  //绑定数据到页面
  bindData1: function (params, data) {
    var that = this;


    //停止加载....
    setTimeout(function () {
      util.hideToast();
      if (loading) {
        loading = false;
      }
      wx.stopPullDownRefresh();
    }, 1000);
    var loveapartmentList = that.data.loveapartmentList;
    if (params.p == 1) {
      loveapartmentList = data;
    } else {
      //todo 双重循环的判断性能可能不好;
      for (var i = 0; i < data.length; i++) {
        var index = loveapartmentList.findIndex(function (item) {
          return item.id == data[i].id;
        });
        if (index == -1) {
          loveapartmentList.push(data[i]);
        }
      }
    }

    that.setData({
      loveapartmentList: loveapartmentList,
    })

    //控制是否有数据
    var isNoData = true;
    if (that.data.homeList.length == 0) {
      isNoData = false;
    }
    that.setData({
      isNoData: isNoData,
    })
    if (data.length == 0) {
      wx.showToast({
        title: '没有更多数据了.',
        icon: 'success',
        duration: 2000
      })
      return;
    }

  },
  /**租金选择 */
  selectRent: function (e) {
    console.log(e)
    var that = this;
    var monyid = e.currentTarget.dataset.id;
    var selectconditions = e.currentTarget.dataset.idx;
    var avgpricestart = monyid == 0 ? 0 : ((parseInt(monyid) - 1) * 1000);
    var avgpriceend = monyid == 0 ? 0 : ((parseInt(monyid)) * 1000);
    console.log(avgpricestart)
    var avgpricestart = {
      avgpricestart: avgpricestart
    }
    var avgpriceend = {
      avgpriceend: avgpriceend
    }
    var type = {
      'type':3
    };
    var p = {
      'page': 1
    };
    var cityId = wx.getStorageSync("cityId");
    var city = {
      city: cityId
    }

    that.setData({
      selectconditions: selectconditions,
      avgpricestart: avgpricestart,
      avgpriceend: avgpriceend,
      showRent: false,
    })
    var keyword = {
      'keyword': ''
    };
    var newSearchData = Object.assign({}, city, avgpricestart, avgpriceend, p, keyword, type); //新的筛选条件is  OK!

    wx.request({
      url: 'http://api.xxpeople.com/apihome/search',
      header: {
        'content-type': "application/x-www-form-urlencoded",
      },
      data: newSearchData,
      method: 'POST',
      success: function (res) {
        console.log('res', res.data)
        var homeList = res.data.data || [];
        var size = homeList.length;
        that.setData({
          homeList: homeList
        })
        //控制是否有数据
        var isNoData = true;
        if (that.data.homeList.length == 0) {
          isNoData = false;
        }
        that.setData({
          isNoData: isNoData,
        })

        if (homeList.length == 0) {
          that.setData({
            nodata: true
          })
          wx.showToast({
            title: '没有更多数据了.',
            icon: 'success',
            duration: 2000
          })
          return;
        }
      }
    })
  },
  recovery:function(){
    this.restore()
  },
 restore: function () {
    var that = this;
   var city = that.data.areaName;
    var params = that.data.searchCondition;
    params.p = 1;
    params.label = '';
   params.city='';
    params.catagroy = 2;
 
    that.gethomeList(params);
    that.setData({
      city: city,
      more: 'true',
      handpick: false,
      disselected: '',
      newselected: 'navi-selected',
      love_apartment: '',
      loveList: false,
      loveApartment: false,
      motif: '',
    })
  },
  showdown:function(){
    this.setData({
      loveApartment:false
    })
  },
  touchM:function(e){
   var that =this
   that.setData({
     posters:true,
    //  more:false
   })
  }
})