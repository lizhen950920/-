// pages/change/create/createThrHome/createThrHome.js
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
    tatus:0,
    onoff: [false, true], 
    charm_imgs_ids: [],
    idea_imgs_ids: [],
    //房间图片二维数组
    room_imgs: [
      [],
      [],
      [],
      [],
      [],
    ],
    cover_id: "",
    idea_imgs: [],
    charm_imgs: [],
    provId: '', //省ID
    cityId: '', //市ID
    areaId: '', //区ID
    showPickerView: false, //控制省市区三级联动显隐
    value: [0, 0, 0],
    tempValue: [0, 0, 0],
    provArr: AreaData.result, //省数组
    cityArr: AreaData.result[0].city, //市数组
    areaArr: AreaData.result[0].city[0].area, //区数组
    addressName: '请选择',
    start: "",
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
    introduction_length: 0,
    roomnum:0,
    imgs: [],
    wrong:true,

    curlength:'0',
    status1:[true,false],
    status2: [true, false],
    status3: [true, false],
    status:[],
    room_checked:[1,1],
  },
  // 更改返回按钮出现的页面错误
  navback:function(){
    wx.navigateBack({
      delta:1
    })
  },
  addShowRoom: function (e) {
    var showRoomArr = this.data.showRoomArr
    var room_checked = this.data.room_checked
    if (showRoomArr.length >= 20) {
      wx.showToast({
        title: '最多只能增加20个房间',
        icon: 'none',
        duration: 1000
      })
      return
    }
    showRoomArr.push(showRoomArr.length + 1);
    room_checked.push(1);
    this.setData({
      showRoomArr: showRoomArr,
      idea_imgs: [],
      idea_imgs_ids: [],
      room_checked: room_checked,
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uid = wx.getStorageSync('uid');
    var that = this;
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  room_remark_input: function (e) {
    this.setData({
      introduction_length: e.detail.value.length
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    var uid = wx.getStorageSync('uid');
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
      util.getUser({
        uid: uid
      }, function (data) {
        if (data.code === 200) {
          var score = data.data.score;
          that.setData({
            user: data.data,

          });
          // if (parseInt(score) < 251) {
          //   util.alertView("提示", "魅力值不足251，请完善个人信息后再来", function() {
          //     wx.navigateTo({
          //       // url: '/pages/User/MyHome/UserDataEditor/UserDataEditor?uid=' + uid,
          //       url: '/pages/User/MyHome/personaldata/personaldata?uid=' + uid,
          //     })
          //   });
          //   return;
          // }
        }
      });
    }
    // var room_imgs = wx.getStorageSync('space_imgs')
    // that.setData({
    //   room_imgs: room_imgs
    // })
    // 读取缓存
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
          male: "",
          female: "",
          old: "",
          room: "",
          hall: "",
          toilet: "",
          kitchen: "",
          area: "",
          total_price: "",
          deposit: "",
          found: "",
          address: "",
          pay: '',
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

  //上传图片
  uploadImg: function (e) {
    var typeInt = e.currentTarget.dataset.type;
    var roomnum = e.currentTarget.dataset.roomnum;
    console.log("typeInt:", typeInt);
    this.setData({
      roomnum: roomnum
    })
    var that = this;
    var curlength = that.data.room_imgs[roomnum].length
    console.log(curlength)
    that.setData({
      curlength: curlength
    })
    if (typeInt == 7 && curlength >= 3) {
      wx.showToast({
        title: '空间图片最多只能传3张',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    var max = 3;
    var count = 0;
    if (typeInt == 7) {
      count = max - curlength;
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
          //var idea_imgs_ids = that.data.idea_imgs_ids
          var idea_imgs = that.data.room_imgs[roomnum] //获取之前存储的图片数组

          console.log('charm_imgs_ids', charm_imgs_ids)
          console.log('charm_imgs', charm_imgs)
          //console.log('idea_imgs_ids', idea_imgs_ids)
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
                  if (typeInt == 3) {
                    console.log('type4原图数量', charm_imgs)
                    charm_imgs.push(img);
                    charm_imgs_ids.push(img.id);
                    that.setData({
                      charm_imgs: charm_imgs,
                      charm_imgs_ids: charm_imgs_ids
                    });
                  } else if (typeInt == 7) {
                    console.log('type7原图数量', idea_imgs)
                    idea_imgs.push(img) //放入
                    //idea_imgs_ids.push(img.id);
                    var cover_id = that.data.cover_id || img.id;
                    var room_imgs = that.data.room_imgs;
                    room_imgs[roomnum] = idea_imgs;

                    that.setData({
                      room_imgs: room_imgs, //存回data中
                      charm_imgs: room_imgs,
                      //idea_imgs_ids: idea_imgs_ids,
                      cover_id: cover_id,
                    })
                    wx.setStorageSync('space_imgs', room_imgs)
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
    } else if (type == 7) {
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
  handelDeleteImgCallBack: function (that, index, idx, type, id) {

    util.alertShow(that, "success", "删除成功");
    var cover_id = that.data.cover_id;
    if (id == that.data.cover_id) {
      cover_id = "";
    }
    if (type == 7) { //空间图
      var tmpArr = that.data.room_imgs;
      console.log(tmpArr)
      console.log('idx', idx)
      console.log('index', index)
      var _tmpArr = tmpArr[index].splice(idx, 1);
      var tmp_idea_imgs = that.data.idea_imgs_ids;
      console.log('tmp_idea_imgs', tmp_idea_imgs)
      var index = tmp_idea_imgs.indexOf(id);
      console.log('index', index)
      if (index > -1) {
        tmp_idea_imgs.splice(index, 1);
      }

      that.setData({
        room_imgs: tmpArr,
        charm_imgs: tmpArr,
        idea_imgs_ids: tmp_idea_imgs,
        cover_id: cover_id,
      });
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
    console.log(e)
    var that = this;
    var id = e.currentTarget.dataset.id;
    var idx = e.currentTarget.dataset.idx;
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.roomnum;
    var from_user_info = e.currentTarget.dataset.fromuserinfo;

    //util.alertShow(that, "success", "别急，还没做完");
    wx.showModal({
      title: '提示',
      content: '你确定要删除吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击删除');
          var params = {
            id: id
          };
          if (from_user_info) { //来至于用户资料的图片不可以从数据库中删除.
            that.handelDeleteImgCallBack(that, idx, type, id);
          } else { //自己上传的可以从数据库真正删除
            util.imgDel(params, function (res) {
              if (res.code == 200) {
                that.handelDeleteImgCallBack(that, index, idx, type, id);
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
    var id = e.currentTarget.dataset.id;
    var idx = e.currentTarget.dataset.idx;
    var type = e.currentTarget.dataset.type;
    console.log(id);
    that.setData({
      cover_id: id,
    });
    if (type == 7) {
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
  formSubmit: function (e) {
    console.log(e)
    var that = this;
    
    var data = e.detail.value;
    console.log('data',data)
    var showRoomArr = that.data.showRoomArr;
    var idx = that.data.roomnum;
    //处理房间信息
    var room_arr = [];
    var state=[]
    var tipsStr = "";
    for (var i = 1; i <= that.data.showRoomArr.length; i++) {
      var imgs = that.data.room_imgs[i - 1]; 
      var img1 = imgs[0] ? imgs[0].url : "";
      if(!img1){
        wx.showToast({
          title: '请至少上传一张图片',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      var status = that.data.room_checked[i];
      if(status == 1){
        if (!data['room_price_' + i]){
          wx.showToast({
            title: '请填写价格',
            icon: 'none',
            duration: 1000
          })
          return;
        }
        if (!data['room_area_' + i]) {
          wx.showToast({
            title: '请填写面积',
            icon: 'none',
            duration: 1000
          })
          return;
        }
      }
      if (!data['room_name_' + i]) {
        wx.showToast({
          title: '请填写房间名称',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      var element = {
        roomName: data['room_name_' + i],
        roomArea: data['room_area_' + i],
        roomPrice: data['room_price_' + i],
        roomMark: data['room_mark_' + i],
        img1: img1,
        img2: imgs.length > 1 ? imgs[1].url : "",
        img3: imgs.length > 2 ? imgs[2].url : "",
        status: status,
      }
      if (!element.img1) {
        wx.showToast({
          title: '请至少上传一张图片',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      if (!element.roomMark) {
        wx.showToast({
          title: '请填写描述',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      
      room_arr.push(element)
    }
    console.log("room_arr json:", JSON.stringify(room_arr));
    console.log("room_arr json:", room_arr);
    var homeDetail = wx.getStorageSync('homeDetail')
    

    homeDetail.room_arr = room_arr;
    homeDetail.showRoomArr = showRoomArr;
    wx.setStorageSync('homeDetail', homeDetail)
    wx.navigateTo({
      url: '/pages/change/create/createFourthHome/createFourthHome',
    })
  },
  // 申请开放按钮
  switch1Change: function (e) {
    //console.log('id', e)
    var that=this
    var checked = Number(e.detail.value)
    var id = e.currentTarget.dataset.index;
    console.log(checked)
    var room_checked = that.data.room_checked;
    room_checked[id] = checked;
    that.setData({ room_checked: room_checked})
  },
})