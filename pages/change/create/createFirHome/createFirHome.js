// pages/change/create/createFirHome/createFirHome.js
var util = require("../../../../common/httpUtil.js");
var common = require("../../../../common/common.js");

const AreaData = require("../../../../common/Area.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: "",
    none_value: "",
    rel_id: 0,
    charm_imgs_ids: [],
    idea_imgs_ids: [],
    cover_id: "",
    idea_imgs: [],
    charm_imgs: [],
    provId: '',                                                     //省ID
    cityId: '',                                                     //市ID
    areaId: '',                                                     //区ID
    showPickerView: false,                                          //控制省市区三级联动显隐
    value: [0, 0, 0],
    tempValue: [0, 0, 0],
    provArr: AreaData.result,                                       //省数组
    cityArr: AreaData.result[0].city,                               //市数组
    areaArr: AreaData.result[0].city[0].area,                       //区数组
    addressName: '请选择',
    start: "",
    loveApartment: false,    
    end: "",
    apply_end: "",
    foundChecked: "1",
    latitude: "",
    longitude: "",
    markers: "",
    scale: 14,
    address: "",
    isSubmitHome: false,
    imageWidth: "",
    user: "",
    showRoomArr: [1],
    label:'',
    focus:false,
    theme:[
      {
        id: 0,
        "name": ""
      },{
      id:1,
      "name":"小森林"
    }, {
        id: 2,
        "name": "萌萌哒"
      }, {
        id: 3,
       "name":" 智能家"
      }, {
        id: 4,
        "name": "舌尖味"
      },  {
        id: 5,
       "name": "学院风"
      }, {
        id: 6,
       "name":" 健身派"
      }, {
        id: 7,
       "name":" 影视人"
      }, {
        id: 8,
       "name": "音乐人"
      }, {
        id: 9,
       "name": "loft"
      }, {
        id: 10,
       "name": "欢乐颂"
      },]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var that = this;
    var uid = wx.getStorageSync('uid');

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        that.setData({
          longitude: longitude,
          latitude: latitude,
        });
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        var width = res.windowHeight / 5 - 10;
        that.setData({
          uid: uid,
          imageWidth: width,
        });
      }
    });
  },
  // 实时监测输入的数据长度
  bindinput1: function (e) {
    // 输入的值都能获取到，那么让这个值字符串化并且获取字符串的长度就有了我需要的那个长度了，
    // 有了长度就可以赋值给那个length了，实时的就可以了
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.name = e.detail.value
    var value = e.detail.value + "";
    this.setData({
      homename_length: value.length,
    });
    wx.setStorageSync('homeDetail', homeDetail)

  },
  selectTheme: function (e) {
    var label = e.currentTarget.dataset.id;
    var homeDetail = wx.getStorageSync('homeDetail')
      homeDetail.label = e.currentTarget.dataset.id;
    console.log(homeDetail.label)
      this.setData({
       label:label,
        loveApartment:false,
      })
    wx.setStorageSync('homeDetail', homeDetail)
  },
  bindinput2: function (e) {
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.declaration = e.detail.value
    var value = e.detail.value + "";
    this.setData({ declaration_length: value.length });
    wx.setStorageSync('homeDetail', homeDetail)
  },
  bindinput3: function (e) {
    var homeDetail = wx.getStorageSync('homeDetail')
    homeDetail.dream_home = e.detail.value
    var value = e.detail.value + "";
    this.setData({ desc_length: value.length });
    wx.setStorageSync('homeDetail', homeDetail)
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
    var that = this

    var uid = wx.getStorageSync('uid');
    
    // if (!that.data.idea_imgs) {
    //   var idea_imgs = wx.getStorageSync('idea_imgs');
    //   if (idea_imgs.length<0){
    //     console.log('无缓存')
    //     var idea_imgs = ''
    //     wx.setStorageSync('idea_imgs', idea_imgs);
    //   }else{
    //     that.setData({
    //       idea_imgs: idea_imgs
    //     })
    //   }
     
    // }
    if (!uid || uid == "") {
      wx.switchTab({
        url: '/pages/User/user',
      })
      return;
    }
    that.setData({
      uid: uid,
      
    });
    if (!that.data.user) {
      util.getUser({ uid: uid }, function (data) {
        if (data.code === 200) {
          var score = data.data.score;
          that.setData({
            user: data.data,

          });
          if (parseInt(score) < 251) {
            util.alertView("提示", "魅力值不足251，请完善个人信息后再来", function () {
              wx.navigateTo({
                // url: '/pages/User/MyHome/UserDataEditor/UserDataEditor?uid=' + uid,
                url: '/pages/User/MyHome/personaldata/personaldata?uid=' + uid,
              })
            });
            return;
          }
        }
      });
    }
    // 读取缓存
    if (!that.data.idea_imgs){
    var idea_imgs = wx.getStorageSync('idea_imgs')
      if (!idea_imgs){
  that.setData({
    idea_imgs: idea_imgs
  })
      }
}
    if (!that.data.items) {
      var homeDetail = wx.getStorageSync('homeDetail')
      console.log(homeDetail);

      if (!homeDetail) {
        console.log('无缓存');
        var homeDetail = {
          name: "",
          declaration: "",
          dream_home: "",
          hope_roommate: "",
          introduction: "",
        }
        wx.setStorageSync('homeDetail', homeDetail);
      } else {
        console.log('有缓存')
        that.setData({
          items: homeDetail,
        })
      }
    }  
  },
// form 表单提交
  formSubmit: function (e) {
    var that = this;
    var data = e.detail.value;
    console.log("charm_imgs_ids:", that.data.charm_imgs_ids);
    console.log("idea_imgs_ids:", that.data.idea_imgs_ids);
    console.log('创爱家form发生了submit事件，携带数据为：', data);
    if (!data.name) {
      wx.showToast({
        title: '名字不能为空',
        icon: 'none',
        duration: 1000
      })
   
      return;
    }
    if (!data.declaration) {
      wx.showToast({
        title: '创家宣言不能为空',
        icon: 'none',
        duration: 1000
      })

  
      return;
    }
    if (that.data.idea_imgs.length < 1) {
      wx.showToast({
        title: '封面图片不能为空',
        icon: 'none',
        duration: 1000
      })


      return;
    }
    if (!data.desc) {
      wx.showToast({
        title: '描述不能为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
wx.navigateTo({
  url: '/pages/change/create/createSenHome/createSenHome',
})
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
  
  },
  //上传图片
  uploadImg: function (e) {
 
    var typeInt = e.currentTarget.dataset.type;
    console.log("typeInt:", typeInt);
    var that = this;

   
    if (typeInt == 4 && that.data.idea_imgs_ids.length >= 1) {

      wx.showToast({
        title: '封面图最多只能传1张',
        icon: 'none',
        duration: 1000
      })
      // util.alertShow(this, "cancel", "封面图最多只能传1张");
      return;
    }
    var max = 1;
    var count = 0;
    if (typeInt == 3) {
      count = max - that.data.charm_imgs_ids.length;
    } else if (typeInt == 4) {
      count = max - that.data.idea_imgs_ids.length;
    }
    wx.chooseImage({
      count: count, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        for (var i = 0, lengths = tempFilePaths.length; i < lengths; i++) {
          var charm_imgs_ids = that.data.charm_imgs_ids
          var charm_imgs = that.data.charm_imgs
          var idea_imgs_ids = that.data.idea_imgs_ids
          var idea_imgs = that.data.idea_imgs
          console.log(charm_imgs_ids)
          
          console.log('charm_imgs_ids', charm_imgs_ids)
          console.log('charm_imgs', charm_imgs)
          console.log('idea_imgs_ids', idea_imgs_ids)
          console.log('idea_imgs', idea_imgs)

          wx.uploadFile({
            url: common.constans.domain + '/common/upload', //
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              uid: that.data.uid,
              rel_id: 0,
              'type': typeInt,

            },
            success: function (res) {
              wx.showLoading({
                title: '请稍后..',
              })
              setTimeout(function () {
                wx.hideLoading()
              }, 1000)
              console.log("upload res:" + res);
              try {
                var data = JSON.parse(res.data);
                if (data.code == 200) {
                  var img = data.data[0];
                  img.from_user_info = false;
                  // 上传成功
                  //data.data[0].url = "https://api.xxpeople.com" + data.data[0].url
                if (typeInt == 4) {
                    console.log('type4原图数量', idea_imgs)
                    idea_imgs.push(img)
                    idea_imgs_ids.push(img.id);
                    var cover_id = that.data.cover_id || img.id;

                    that.setData({
                      idea_imgs: idea_imgs,
                      idea_imgs_ids: idea_imgs_ids,
                      cover_id: cover_id,
                    })
                  that.setCover();
                     wx.setStorageSync('idea_imgs', idea_imgs)
                    wx.setStorageSync('idea_imgs_ids', idea_imgs_ids)
                    wx.setStorageSync('cover_id', cover_id)
                  }
                } else {
                  // 上传失败
                  util.alertShow(that, "cancel", "上传失败");
                }
                
              } catch (e) {
                console.log(e)
                util.alertShow(that, "cancel", "啊哦，上传失败了");
              }
            }
          })
        }
      }
    })
  },
                   
             
  //点击预览图片
  previewImg: function (e) {
    if (this.endTime - this.startTime > 350) {
      return;
    }
    var idx = e.currentTarget.dataset.idx;
    var type = e.currentTarget.dataset.type;
    var that = this;
    var urls = [];
    if (type == 3) {
      that.data.charm_imgs.map(function (item) {
        urls.push(item.url);
      });
    } else if (type == 4) {
      that.data.idea_imgs.map(function (item) {
        urls.push(item.url);
      });
    }
    wx.previewImage({
      current: urls[idx], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },

bindTouchEnd: function (e) {
  this.endTime = e.timeStamp;
},
  //删除后的回掉处理方法
  handelDeleteImgCallBack: function (that, idx, type, id) {
    util.alertShow(that, "success", "删除成功");
    var cover_id = that.data.cover_id;
    if (id == that.data.cover_id) {
      cover_id = "";
    }
    if (type == 4) { //创想图
      var tmpArr = that.data.idea_imgs;
      var _tmpArr = tmpArr.splice(idx, 1);
      var tmp_idea_imgs = that.data.idea_imgs_ids;

      var index = tmp_idea_imgs.indexOf(id);
      if (index > -1) {
        tmp_idea_imgs.splice(index, 1);
      }
      that.setData({
        idea_imgs: tmpArr,
        idea_imgs_ids: tmp_idea_imgs,
        cover_id: cover_id,
      });
      wx.setStorageSync('idea_imgs', tmpArr)
     
      wx.setStorageSync('idea_imgs_ids', tmp_idea_imgs)
    
    } else { //魅力照
      var tmpArr = that.data.charm_imgs;
      var _tmpArr = tmpArr.splice(idx, 1);
      var tmp_charm_imgs = that.data.charm_imgs_ids;

      var index = tmp_charm_imgs.indexOf(id);
      if (index > -1) {
        tmp_charm_imgs.splice(index, 1);
      }

      that.setData({
        charm_imgs: tmpArr,
        charm_imgs_ids: tmp_charm_imgs,
        cover_id: cover_id,
      });
    }
  },

  //删除图片
  deleteImg: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var idx = e.currentTarget.dataset.idx;
    console.log('idx',idx)
    var type = e.currentTarget.dataset.type;
    var from_user_info = e.currentTarget.dataset.fromuserinfo;
    //util.alertShow(that, "success", "别急，还没做完");
    wx.showModal({
      title: '提示',
      content: '你确定要删除吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击删除');
          var params = { id: id };
          if (from_user_info) { //来至于用户资料的图片不可以从数据库中删除.
            that.handelDeleteImgCallBack(that, idx, type, id);
          } else {//自己上传的可以从数据库真正删除
            util.imgDel(params, function (res) {
              if (res.code == 200) {
                that.handelDeleteImgCallBack(that, idx, type, id);
               
                /*
                util.alertShow(that, "success", "删除成功");
                
                var cover_id = that.data.cover_id;
                if (id == that.data.cover_id) {
                  cover_id = "";
                }
                if (type == 4) {
                  var tmpArr = that.data.idea_imgs;
                  var _tmpArr = tmpArr.splice(idx, 1);
                  var tmp_idea_imgs = that.data.idea_imgs_ids;

                  var index = tmp_idea_imgs.indexOf(id);
                  if (index > -1) {
                    tmp_idea_imgs.splice(index, 1);
                  }

                  that.setData({
                    idea_imgs: _tmpArr,
                    idea_imgs_ids: tmp_idea_imgs,
                    cover_id: cover_id,
                  });
                } else {
                  var tmpArr = that.data.charm_imgs;
                  var _tmpArr = tmpArr.splice(idx, 1);
                  var tmp_charm_imgs = that.data.charm_imgs;

                  var index = tmp_charm_imgs.indexOf(id);
                  if (index > -1) {
                    tmp_charm_imgs.splice(index, 1);
                  }

                  that.setData({
                    charm_imgs: _tmpArr,
                    charm_imgs_ids: tmp_charm_imgs,
                    cover_id: cover_id,
                  });
                }*/
              } else {
                util.alertShow(that, "cancel", "删除失败");
              }
            });
          }
        }
      }
    });
  },
  //设置封面图片
  setCover: function (e) {
    var that = this;
    var id = that.data.idea_imgs[0].id;
    var idx = that.data.idea_imgs[0].rel_id;
    var type = that.data.idea_imgs[0].type;
    console.log(id);
    that.setData({
      cover_id: id,
    });
    if (type == 4) {
      var tmpArr = that.data.idea_imgs;
      tmpArr.map(function (item) {
        if (item.id == id) {
          item.selected = true;
        } else {
          item.selected = false;
        }
      });
      //tmpArr[idx].selected = true
      that.setData({
        imageWidth: parseInt(that.data.imageWidth) - 1,
        idea_imgs: tmpArr
      });
    }
    util.alertShow(that, "success", "设置成功");
  },
  select:function(){
    this.setData({
      loveApartment:true
    })
  },
  cancel: function () {
    this.setData({
      loveApartment: false
    })
  },

})