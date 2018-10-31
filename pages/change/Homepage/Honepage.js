// pages/Xinxin/list.js
const more = require('../../../common/Child.js');
var uti = require('../../../common/httpUtil.js');
const AreaData = require("../../../common/Area.js");
var loading = false;

function initSubMenuDisplay() {
  return ['hidden', 'hidden', 'hidden', 'hidden'];
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    status: ['', '求房源', '无房一起找', '招室友', '出租', '转租'],
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
        id:0,
        name: '不限',
      }
    ],
    roomList: [],
    searchCondition: {},
    needReload: true,
    search:'',
    city: "",
    areaName:"",
    lonlat: {},
    isNoData: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    disselected: 'navi-selected',
    indicatorDots: false,
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
    search:"",
    showMore: false,
    nodata: false,
    areaArr: AreaData.result[0].city[0].area,
    isNoData: false,
    selectIndex: '0',
    house: 1,
    solicite: 1,
    e:'',
    selectconditions:"",
    selectTime:'',
    selectShow:'',
    type:'',
    spacing:false,
    rent: [{
        "rent": "不限",
        "id": "0",
      checked: false,
      },
      {
        "rent": "1000元以下",
        "id": "1",
        checked: false,
      },
      {
        "rent": "1000-2000",
        "id": "2",
        checked: false,
      },
      {
        "rent": "2000-3000",
        "id": "3",
        checked: false,
      },
      {
        "rent": "3000-4000",
        "id": "4",
        checked: false,
      },
      {
        "rent": "4000-5000",

        "id": "5",
        checked: false,
      },
      {
        "rent": "5000以上",
        "id": "6",
        checked: false,
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

  /**租金选择 */
  selectRent: function(e) {
    console.log(e)
    var that = this;
    var monyid = e.currentTarget.dataset.id;
    var selectconditions = e.currentTarget.dataset.idx;
    var pricestart = monyid == 0 ? 0 : ((parseInt(monyid) - 1) * 1000);
    var priceend = monyid == 0 ? 0 : ((parseInt(monyid)) * 1000);
    console.log(pricestart)
    var pricestart = {
      pricestart: pricestart
    }
    var priceend = {
      priceend: priceend
    }
    var latitude = that.data.latitude;
    var latitude = {
      'latitude': latitude
    };

    var longitude = that.data.longitude;
    var longitude = {
      'longitude': longitude
    };
    var type = {
      'type': 2
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
      pricestart: pricestart,
      priceend: priceend,
      showRent: false,
    })
    var keyword = {
      'keyword': ''
    };
    var newSearchData = Object.assign({}, city, latitude, longitude, pricestart, priceend, p, keyword, type); //新的筛选条件is  OK!

    wx.request({
      url: 'https://api.xxpeople.com/apiroom/search',
      header: {
        'content-type': "application/x-www-form-urlencoded",
      },
      data: newSearchData,
      method: 'POST',
      success: function(res) {
        console.log('res', res.data)
        var roomList = res.data.data || [];
        var size = roomList.length;
        that.setData({
          roomList: roomList
        })
        //控制是否有数据
        var isNoData = true;
        if (that.data.roomList.length <2) {
          isNoData = false;
        }
        that.setData({
          isNoData: isNoData,
        })

        if (roomList.length < 2) {
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
  // 附近距离
  near: function(e) {
  
    var that = this;
    var near = e.currentTarget.dataset.id;
    console.log('near',near)
    var near = {
      near: near
    }
    var type = {
      'type': 2
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
    var latitude = that.data.latitude;
    var latitude = {
      'latitude': latitude
    };

    var longitude = that.data.longitude;
    var longitude = {
      'longitude': longitude
    };
    var keyword = {
      'keyword': ''
    };
    var newSearchData = Object.assign({}, latitude, longitude,city,near,  p, keyword, type); //新的筛选条件is  OK!

    wx.request({
      url: 'https://api.xxpeople.com/apiroom/search',
      header: {
        'content-type': "application/x-www-form-urlencoded",
      },
      data: newSearchData,
      method: 'POST',
      success: function (res) {
        console.log('res', res.data)
        var roomList = res.data.data || [];
        var size = roomList.length;
        that.setData({
          roomList: roomList
        })
        //控制是否有数据
        var isNoData = true;
        if (that.data.roomList.length == 0) {
          isNoData = false;
        }
        that.setData({
          isNoData: isNoData,
        })

        if (roomList.length == 0) {
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
  selectTreatment: function(e) {
    var that = this;
    var timeid = e.currentTarget.dataset.id;
    var selectTime = e.currentTarget.dataset.idx;
    console.log(timeid)
    var intime = {
      intime: timeid
    }
    var type = {
      'type': 2
    };
    var p = {
      'page': 1
    };
    var latitude = that.data.latitude;
    var latitude = {
      'latitude': latitude
    };

    var longitude = that.data.longitude;
    var longitude = {
      'longitude': longitude
    };
    var cityId = wx.getStorageSync("cityId");
    var city = {
      city: cityId
    }
    that.setData({
      selectTime: selectTime,
      intime: intime,
      showTreatment: false,
    })
    var keyword = {
      'keyword': ''
    };
    var newSearchData = Object.assign({}, latitude, longitude, city,intime, p, keyword, type); //新的筛选条件is  OK!
    wx.request({
      url: 'https://api.xxpeople.com/apiroom/search',
      header: {
        'content-type': "application/x-www-form-urlencoded",
      },
      data: newSearchData,
      method: 'POST',
      success: function(res) {
        console.log('res', res.data)
        var roomList = res.data.data || [];
        var size = roomList.length;
        that.setData({
          roomList: roomList
        })
        //控制是否有数据
        var isNoData = true;
        if (that.data.roomList.length == 0) {
          isNoData = false;
        }
        that.setData({
          isNoData: isNoData,
        })

        if (roomList.length == 0) {
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
  /** 排序 */
  showsorting: function(e) {
    var that = this;
    var selectShow = e.currentTarget.dataset.idx;
    var sorteid = e.currentTarget.dataset.id;
    var cityId = wx.getStorageSync("cityId");
    // var params = that.data.searchCondition;
    // params.p = 1;
    // params.longitude = that.data.lonlat.longitude;
    // params.latitude = that.data.lonlat.latitude;
    // params.order = e.currentTarget.dataset.id;
    // that.getroomList(params);
    // that.setData({
    //   selectShow: selectShow,
    //   showsorting: false,
    // })
    var city = {
      city: cityId
    }
    console.log(sorteid)
    var latitude = that.data.latitude;
    var longitude = that.data.longitude;
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
      'type': 2
    };
    var p = {
      'page': 1
    };
    that.setData({
      selectShow: selectShow,
      showsorting: false,
    })
  
    var keyword = {
      'keyword': ''
    };
    var newSearchData = Object.assign({}, latitude, longitude,city, order, p, keyword, type); //新的筛选条件is  OK!

    wx.request({
      url: 'https://api.xxpeople.com/apiroom/search',
      header: {
        'content-type': "application/x-www-form-urlencoded",
      },
      data: newSearchData,
      method: 'POST',
      success: function(res) {
        console.log('res', res.data)
        var roomList = res.data.data || [];
        var size = roomList.length;
        that.setData({
          roomList: roomList
        })
        //控制是否有数据
        var isNoData = true;
        if (that.data.roomList.length == 0) {
          isNoData = false;
        }
        that.setData({
          isNoData: isNoData,
        })

        if (roomList.length == 0) {
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
  //区域：区县
  county: function(e) {
    var that = this;
    
    var area = e.currentTarget.dataset.id;
    var params = that.data.searchCondition;
    params.p = 1;
    params.area = e.currentTarget.dataset.id;
    that.getroomList(params);
    console.log(e)
    console.log('area',area)
    that.setData({
      area: area,
      showMore: false,
    })
    // var area = {
    //   area: area
    // }
    // var type = {
    //   'type': 2
    // };
    // var p = {
    //   'page': 1
    // };
    // var latitude = that.data.latitude;
    // var longitude = that.data.longitude;
    // var latitude = {
    //   latitude: latitude
    // }
    // var longitude = {
    //   longitude: longitude
    // }
   
    // var keyword = {
    //   'keyword': ''
    // };
    // var cityId = wx.getStorageSync("cityId");
    // var city = {
    //   city: cityId
    // }
    // var newSearchData = Object.assign({}, latitude, longitude, city,area, p, keyword, type); //新的筛选条件is  OK!

    // wx.request({
    //   url: 'https://api.xxpeople.com/apiroom/search',
    //   header: {
    //     'content-type': "application/x-www-form-urlencoded",
    //   },
    //   data: newSearchData,
    //   method: 'POST',
    //   success: function (res) {
    //     console.log('res', res.data)
    //     var roomList = res.data.data || [];
    //     var size = roomList.length;
    //     that.setData({
    //       roomList: roomList
    //     })
    //     //控制是否有数据
    //     var isNoData = true;
    //     if (that.data.roomList.length == 0) {
    //       isNoData = false;
    //     }
    //     that.setData({
    //       isNoData: isNoData,
    //     })

    //     if (roomList.length == 0) {
    //       that.setData({
    //         nodata: true
    //       })
    //       wx.showToast({
    //         title: '没有更多数据了.',
    //         icon: 'success',
    //         duration: 2000
    //       })
    //       return;
    //     }
    //   }
    // })
  },
  //一键复原
  recovery: function() {
    
    var that = this;
    console.log("newest");
    var params = that.data.searchCondition;
    that.getroomList(params);
     that.setData({
       solicite:1,
       house:1
       
     })
   
    // var that = this;
    // var cityId = wx.getStorageSync("cityId");
    // that.setData({
    //   solicite:1
    // })
    // var city={
    //   city: cityId
    // }
    // var type = {
    //   'type': 2
    // };
    // var p = {
    //   'page': 1
    // };
    // var keyword = {
    //   'keyword': 1
    // };
    // var newSearchData = Object.assign({}, city, p, keyword, type); //新的筛选条件is  OK!

    // wx.request({
    //   url: 'https://api.xxpeople.com/apiroom/search',
    //   header: {
    //     'content-type': "application/x-www-form-urlencoded",
    //   },
    //   data: newSearchData,
    //   method: 'POST',
    //   success: function (res) {
    //     console.log('res', res.data)
    //     var roomList = res.data.data || [];
    //     var size = roomList.length;
    //     that.setData({
    //       roomList: roomList
    //     })
    //     //控制是否有数据
    //     var isNoData = true;
    //     if (that.data.roomList.length == 0) {
    //       isNoData = false;
    //     }
    //     that.setData({
    //       isNoData: isNoData,
          
    //     })

    //     if (roomList.length == 0) {
    //       that.setData({
    //         nodata: true
    //       })
    //       wx.showToast({
    //         title: '没有更多数据了.',
    //         icon: 'success',
    //         duration: 2000
    //       })
    //       return;
    //     }
    //   }
    // })
  },
  
  /**房源选择 */
  house_resource: function(e) {
    var that = this;
    var state =4;
    console.log(e)
    console.log('state', state)
    var state = {
      state: state
    }
    var type = {
      'type': 2
    };
    var latitude = that.data.latitude;
    var longitude = that.data.longitude;
    var latitude = {
      latitude: latitude
    }
    var longitude = {
      longitude: longitude
    }
    var p = {
      'page': 1
    };
    that.setData({
      state: state,
      house: 0,
      solicite: 1,
      
    })
    var keyword = {
      'keyword': ''
    };
    var newSearchData = Object.assign({}, latitude, longitude, state, p, keyword, type); //新的筛选条件is  OK!

    wx.request({
      url: 'https://api.xxpeople.com/apiroom/search',
      header: {
        'content-type': "application/x-www-form-urlencoded",
      },
      data: newSearchData,
      method: 'POST',
      success: function (res) {
        console.log('res', res.data)
        var roomList = res.data.data || [];
        var size = roomList.length;
        that.setData({
          roomList: roomList
        })
        var isNoData = true;
        if (that.data.roomList.length == 0) {
          isNoData = false;
        }
        that.setData({
          isNoData: isNoData,
        })

      }
    })
  },
  /**新人 */
  solicite: function(e) {
    var that = this;
    var state = "1,2";
   
    console.log(e)
    console.log('state', state)
    var latitude = that.data.latitude;
    var longitude = that.data.longitude;
    var latitude = {
      latitude: latitude
    }
    var longitude = {
      longitude: longitude
    }
    var state = {
      state: state
    }
    var type = {
      'type': 2
    };
    var p = {
      'page': 1
    };
    that.setData({
      state: state,
      house: 1,
      solicite: 0,
    })
    var keyword = {
      'keyword': ''
    };
    var newSearchData = Object.assign({}, latitude, longitude, state, p, keyword, type); //新的筛选条件is  OK!

    wx.request({
      url: 'https://api.xxpeople.com/apiroom/search',
      header: {
        'content-type': "application/x-www-form-urlencoded",
      },
      data: newSearchData,
      method: 'POST',
      success: function (res) {
        console.log('res', res.data)
        var roomList = res.data.data || [];
        var size = roomList.length;
        that.setData({
          roomList: roomList
        })
        console.log(roomList)
        var isNoData = true;
        if (that.data.roomList.length < 1) {
          isNoData = false;
          spacing:false
        }
        that.setData({
          isNoData: isNoData,
        })
        if (that.data.roomList.length = 1) {
          isNoData = false;
          that.setData({
            spacing:true
          })
        }
        that.setData({
          isNoData: isNoData,
        })

       
      }
    })
 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  area:function(){
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
  onLoad: function(options) {
    var type=options.type;
    uti.showLoading("加载中...");
    var that = this;

    wx.getSystemInfo({
      success: function(res) {
        console.log(res.windowHeight);
        that.setData({
          height: res.windowHeight
        });
      }
    });
    let data = {
      'scope': 4,
      'size': 15,
      'page': 1,
      'top': 1,
    }
  
  },
  onReady: function() {
    // 页面渲染完成
    let all = more.all; //所有分类
    let id = "0100";
    this.setData({
      moreChildList: select.postlist(all, id)
    })
  },
  clickAdd: function() {
    wx.navigateTo({
      url: '/pages/CreateHome/CreateHome',
    })
  },
  //点击搜索输入框
  searchCondition: function(e) {
    console.log('type',e)
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/change/search/search?type='+type,


    })
  },

  //调用第三方的api获取地理位置
  getAddress: function(longitude, latitude) {
    var that = this;
    if (that.data.areaName) {
      return;
    }

    uti.latlng2City(latitude, longitude, function(response) {
      var areaName = response.result.ad_info.city;
      wx.setStorageSync("city", areaName)
      if (areaName.length > 3) {
        areaName = areaName.substr(0, 2) + ".."
      }
      that.setData({
        areaName: areaName,
        selectedAddress: response.result.address,
      });

    });
  },
//最新
  newest: function (params) {
    var that = this;
    console.log("newest");
    var params = that.data.searchCondition;
    params.p = 1;
    params.catagroy = 2;
    that.getroomList(params);
    this.setData({
      disselected: '',
      newselected: 'navi-selected',
    })
  },
  //获取列表
  getroomList: function (params) {
    var that = this;
    loading = true;
    uti.showLoading("加载中...");
    uti.getIamges(1, function (res) {
      that.setData({ imgUrls: res.data })
    });
    that.getLonLat(function (res) {
      var latitude = res.latitude
      var longitude = res.longitude
      that.getAddress(longitude, latitude);
      params.longitude = params.longitude || longitude;
      params.latitude = params.latitude || latitude;
      uti.searchRoomList(params, function (userRes) {
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

  bindData: function(params, data) {
    var that = this;

    //停止加载....
    setTimeout(function() {
      uti.hideToast();
      if (loading) {
        loading = false;
      }
      wx.stopPullDownRefresh();
    }, 1000);
    var roomList = that.data.roomList;
    if (params.p == 1) {
      roomList = data;
    } else {
      //todo 双重循环的判断性能可能不好;
      for (var i = 0; i < data.length; i++) {
        var index = roomList.findIndex(function(item) {
          return item.id == data[i].id;
        });
        if (index == -1) {
          roomList.push(data[i]);

        }
      }
    }
    that.setData({
      roomList: roomList,

    })
    console.log(roomList)

    //控制是否有数据
    var isNoData = true;
    if (that.data.roomList.length == 0) {
      isNoData = false;
    }
    that.setData({
      isNoData: isNoData,
    })

    if (data.length == 0) {
      that.setData({
        nodata: true,
         spacing: false,
      })
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
            longitude: res.longitude,
            latitude: res.latitude,
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



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    var params = that.data.searchCondition;
    var e = that.data.searchCondition.city;
    var cityId = wx.getStorageSync('cityId');
    params.city = cityId;
    params.p = 1;
    // params.catagroy=2;
    params.state = 0;
    params.type = 2;
    console.log('that.data', that.data.searchCondition)
    var city = wx.getStorageSync('hotcity');
    that.setData({
      'city': city,
      showsorting: false,
      showTreatment: false,
      showRent: false,
      showMore: false,
      solicite: 1
    })
    if (!city) {
      wx.showModal({
        title: '',
        content: '请点击跳转选择相应的城市',
        success: function (res) {

          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/change/city/city',
            })
          }
        }
      })

    }
    console.log('that.data.needReload', that.data.needReload)

    //从详情页面或搜索页面返回
    if (!that.data.needReload) {
      return;
    }
    if (that.data.search == true) {
      var searchCondition = that.data.searchCondition;
      var params = that.data.searchCondition;
      console.log(params)
      params.p = 1;
      params.type = 2,
        params.city = cityId,
        params.catagroy = '';
      that.setData({
        searchCondition: params
      })
    }
    //从搜索页面返回或第一次进入
    that.getCityArea(e);
    that.getroomList(params);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
 
   
  },

  // 获取市区
  getCityArea: function(e) {
    var that = this;
    console.log('市id', e)
    if(!e){
      var pid = 110000
    }else{
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
  search:function(params){
    var that = this;
    console.log(params)
    wx.request({
      url: 'https://api.xxpeople.com/apiroom/search',
      header: {
 'content-type': "application/x-www-form-urlencoded",
      },
      data: params,
      method: 'POST',
      success: function (res) {
        console.log('res', res.data)
        var roomList = res.data.data || [];
        var size = roomList.length;
        that.setData({
          roomList: roomList
        })
        var isNoData = true;
        if (that.data.roomList.length == 0) {
          isNoData = false;
          spacing:false;
        }
        that.setData({
          isNoData: isNoData,
        })


      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    that.setData({
      solicite:1
    })
    var params = that.data.searchCondition;
    params.p = 1;
    that.getroomList(params);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("onReachBottom");
    var that = this;
    that.setData({
      solicite:1,
      house:1,
    })
    var params = that.data.searchCondition;
    params.p = parseInt(params.p) + 1;
    params.longitude = that.data.lonlat.longitude;
    params.latitude = that.data.lonlat.latitude;

    that.getroomList(params);
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


  //发布跳转
  public: function() {
    wx.navigateTo({
      url: '/pages/change/public/public',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  showdown:function(){
    this.setData({
      showRent: false,
      showTreatment: false,
      showMore: false,
      showsorting:false,
    })
  },
  roomDetail: function(e) {
    console.log('e', e)
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    console.log("room detail");
    this.setData({
      showRent: false,
      showTreatment: false,
      showMore: false,
      showsorting: false,
    })
    wx.navigateTo({
      url: '/pages/change/housDetails/housDetails?id=' + id + "&uid=" + uid,
    })
  },
  switchSlider(e) {
    this.setData({
      'selectIndex': e.target.dataset.index
    })
  },


})