// setuserhomepage.js
var httpUtil = require("../../../common/httpUtil.js");
var common = require("../../../common/common.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: "",
    moneyMin: 0,
    moneyMax: 0,
    age: "",
    user: "",
    charm_imgs_ids: [], //魅力照图片
    charm_imgs: [],
    live_imgs_ids: [], //理想居住空间
    live_imgs: [],
    uid: "", //用户id
    birth: '',
    sexArray: [{
      'id': '1',
      'name': '男'
    }, {
      'id': '2',
      'name': '女'
    },],
    sexIndex: 0,
    sexId: 1,
    marryArray: [{
      'id': '1',
      'name': '单身'
    }, {
      'id': '2',
      'name': '婚恋'
    }, {
      'id': '3',
      'name': '保密'
    },],
    marryIndex: 0,
    marryId: 1,

    typeArray: [{
      'id': '1',
      'name': '有房找室友'
    }, {
      'id': '2',
      'name': '求房求室友'
    }, {
      'id': '3',
      'name': '爱家生活中'
    },],
    typeIndex: 0,
    typeId: 1,

    constellationArray: [{
      'id': '1',
      'name': '白羊座'
    }, {
      'id': '2',
      'name': '金牛座'
    }, {
      'id': '3',
      'name': '双子座'
    }, {
      'id': '4',
      'name': '巨蟹座'
    }, {
      'id': '5',
      'name': '狮子座'
    }, {
      'id': '6',
      'name': '处女座'
    }, {
      'id': '7',
      'name': '天秤座'
    }, {
      'id': '8',
      'name': '天蝎座'
    }, {
      'id': '9',
      'name': '射手座'
    }, {
      'id': '10',
      'name': '魔羯座'
    }, {
      'id': '11',
      'name': '水瓶座'
    }, {
      'id': '12',
      'name': '双鱼座'
    },],
    constellationIndex: 0,
    constellationId: 1,
    hope_live: "",
    hope_roommate: "",
  },

  bindinput: function (e) {
    var val = e.detail.value;
    this.setData({
      hope_roommate: val
    });
  },

  // 计算最大值与最小值
  bindtap1: function (e) {

    var ctype = e.currentTarget.dataset.ctype
    var value = e.detail.value

    if (ctype == '1') {
      this.setData({
        moneyMin: value
      })
    } else {
      this.setData({
        moneyMax: value
      })
    }

  },
  bindMoveChange: function (e) {
    var that = this;
    var moveDate = e.detail.value;
    var ctype = e.currentTarget.dataset.type
    var user = that.data.user;
    if (ctype == "1") {
      user.move_start = moveDate;
    } else {
      user.move_end = moveDate;
    }
    this.setData({
      user: user,
    })
  },
  //时间选择
  bindBirthChange: function (e) {
    var that = this;
    //根据生日推算出年龄
    var birth = e.detail.value;
    var birthDate = new Date(birth);
    var age = new Date().getFullYear() - birthDate.getFullYear()

    //计算星座
    var constellation = that.getAstro(birthDate.getMonth() + 1, birthDate.getDate());
    console.log("星座：" + constellation);
    var index = that.data.constellationArray.findIndex(function (item) {
      return item.name.indexOf(constellation) != -1;
    });
    var user = that.data.user;
    user.age = age;
    var obj = that.data.constellationArray[index];
    this.setData({
      birth: birth,
      user: user,
      age: age,
      constellationIndex: index,
      constellationId: obj.id,
    })
  },
  getAstro: function (m, d) {
    return "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯".substr(m * 2 - (d < "102223444433".charAt(m - 1) - -19) * 2, 2);
  },
  bindSexChange: function (e) {
    this.setData({
      sexIndex: e.detail.value,
      sexId: this.data.sexArray[e.detail.value].id,
    })
  },

  bindMarryChange: function (e) {
    this.setData({
      marryIndex: e.detail.value,
      marryId: this.data.marryArray[e.detail.value].id,
    })
  },

  bindTypeChange: function (e) {
    this.setData({
      typeIndex: e.detail.value,
      typeId: this.data.typeArray[e.detail.value].id,
    })
  },

  bindConstellationChange: function (e) {
    this.setData({
      constellationIndex: e.detail.value,
      constellationId: this.data.constellationArray[e.detail.value].id,
    })
  },
  chooseMap: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log("name", res.name);
        console.log("address", res.address);
        console.log("latitude", res.latitude);
        console.log("longitude", res.longitude);

        //var _user =  that.data.user
        //_user.hope_live = res.address
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          hope_live: res.address,
          scale: 16,
          markers: [{
            id: 1,
            latitude: res.latitude,
            longitude: res.longitude,
            callout: {
              content: "房屋位置",
              color: "#FFFFFF",
              fontSize: 14,
              borderRadius: 5,
              bgColor: '#82C435',
              padding: 5,
              display: 'ALWAYS'
            },
            anchor: { x: 1, y: 1 }
          }]
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    try {
      var res = wx.getSystemInfoSync()
      var sdkverion = res.SDKVersion.replace(/\./g, '');
      if (parseFloat(sdkverion) < 141) {
        wx.showToast({
          title: '微信版本太低，无法使用本页面的功能.',
          icon: 'success',
          duration: 2000
        })
      }
    } catch (e) {
      // Do something when catch error
    }
    //判断是否登录 =》可以去掉
    var uid = wx.getStorageSync('uid');
    if (!uid || uid == "") {
      wx.navigateTo({
        url: '/pages/User/Login/Login',
      })
      return;
    }

        that.setData({
          userInfo: wx.getStorageSync('userInfo')
        })
     

    var id = options.id || uid;
    var that = this;
    //加载用户数据
    httpUtil.showLoading();
    console.log("id={}", id);
    httpUtil.getUser({ uid: id }, function (data) {
      console.log("getUser:{}", data.data);
      httpUtil.hideToast();
      if (data.code === 200) {
        that.setData({
          user: data.data,
          uid: data.data.id,
          sexIndex: !data.data.sex ? 0 : parseInt(data.data.sex) - 1,
          marryIndex: !data.data.marry ? 0 : parseInt(data.data.marry) - 1,
          typeIndex: !data.data.type ? 0 : parseInt(data.data.type) - 1,
          constellationIndex: !data.data.constellation ? 0 : parseInt(data.data.constellation) - 1,
          constellationId: data.data.constellation,
          birth: data.data.birth,
          age: data.data.age,
          hope_live: data.data.hope_live,
          hope_roommate: data.data.hope_roommate,
          //userinfo: getApp().globalData.userInfo,

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


  //删除
  deleteImg: function (e) {
    var id = e.currentTarget.dataset.id;
    var typeId = e.currentTarget.dataset.type;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '你确定要删除吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击删除');
          httpUtil.imgDel({
            id: id
          }, function (res) {
            if (res.code == 200) {
              httpUtil.showSuccess();
              if (typeId == 1) {
                var tmpData = that.data.charm_imgs.filter(function (item) {
                  if (item.id != id) {
                    return item;
                  }
                });
                //删除数组中的元素
                var tmp_charm_imgs_ids = that.data.charm_imgs_ids;
                var index = tmp_charm_imgs_ids.indexOf(id);
                if (index > -1) {
                  tmp_charm_imgs_ids.splice(index, 1);
                }
                that.setData({
                  charm_imgs: tmpData,
                  charm_imgs_ids: tmp_charm_imgs_ids
                });
              } else if (typeId == 2) {
                var tmpData = that.data.live_imgs.filter(function (item) {
                  if (item.id != id) {
                    return item;
                  }
                });
                //删除数组中的元素
                var tmp_live_imgs_ids = that.data.live_imgs_ids;
                var index = tmp_live_imgs_ids.indexOf(id);
                if (index > -1) {
                  tmp_live_imgs_ids.splice(index, 1);
                }
                that.setData({
                  live_imgs: tmpData,
                  live_imgs_ids: tmp_live_imgs_ids,
                });
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })

  },

  //提交表单
  formSubmit: function (e) {
    try {
      /*
      var res = wx.getSystemInfoSync()
      var sdkverion = res.SDKVersion.replace(/\./g, '');
      if (parseFloat(sdkverion) < 141) {
        wx.showToast({
          title: '微信版本太低，无法使用本页面的功能.',
          icon: 'success',
          duration: 2000
        })
        return;
      }
      */


      var that = this;
      var data = e.detail.value;
      console.log("charm_imgs_ids:", that.data.charm_imgs_ids.toString());

      // 如果最高月租预算低于最低月租预算
      if (Number(data.rent_start) > Number(data.rend_end)) {
        httpUtil.alertShow(this, "cancel", "最高预算不能低于最低预算哦");
        return;
      }

      //data validate
      if (that.data.charm_imgs_ids.length < 1) {
        httpUtil.alertShow(this, "cancel", "我的魅力照不能为空");
        return;
      }
      if (that.data.charm_imgs_ids.length > 9) {
        httpUtil.alertShow(this, "cancel", "我的魅力照最多只能传9张");
        return;
      }
      // if (that.data.live_imgs_ids.length < 1 || that.data.live_imgs_ids.length > 9) {
      //   httpUtil.alertShow(this, "cancel", "理想居住空间图片只能传1-9张");
      //   return;
      // }
      if (!data.username) {
        httpUtil.alertShow(this, "cancel", "昵称不能为空");
        return;
      }
      if (!data.hometownStr) {
        httpUtil.alertShow(this, "cancel", "家乡不能为空");
        return;
      }
      if (!that.data.birth) {
        httpUtil.alertShow(this, "cancel", "生日不能为空");
        return;
      }
      if (!data.profession) {
        httpUtil.alertShow(this, "cancel", "职业不能为空");
        return;
      }
      //图片个数
      data.personImgNum = that.data.charm_imgs.length;
      data.liveImgNum = that.data.live_imgs.length;

      data.age = that.data.age;
      data.sex = that.data.sexId;
      data.marry = that.data.marryId;
      data.type = that.data.typeId;
      data.birth = that.data.birth;
      data.constellation = that.data.constellationId;
      data.latitude = that.data.latitude;
      data.longitude = that.data.longitude;
      data.move_start = that.data.user.move_start;
      data.move_end = that.data.user.move_end;
      data.hope_live = that.data.hope_live;

      if (!data.skill) {
        httpUtil.alertShow(this, "cancel", "技能不能为空");
        return;
      }
      // if (!data.hope_skill) {
      //   httpUtil.alertShow(this, "cancel", "希望交换的技能不能为空");
      //   return;
      // }
      // if (!data.dream_home) {
      //   httpUtil.alertShow(this, "cancel", "理想居住空间不能为空");
      //   return;
      // }
      if (!data.hope_roommate) {
        httpUtil.alertShow(this, "cancel", "理想室友不能为空");
        return;
      }
      if (!data.hope_live) {
        httpUtil.alertShow(this, "cancel", "希望住在不能为空");
        return;
      }
      if (!data.rent_start) {
        httpUtil.alertShow(this, "cancel", "月租预算开始不能为空");
        return;
      }
      if (!data.rend_end) {
        httpUtil.alertShow(this, "cancel", "月租预算结束不能为空");
        return;
      }

      if (!data.mobile) {
        httpUtil.alertShow(this, "cancel", "手机号不能为空");
        return;
      }
      if (!(/^1[34578]\d{9}$/.test(data.mobile))) {
        util.alertShow(this, "cancel", "请输入正确的手机号码");
        return;
      }
      if (!data.wechat) {
        httpUtil.alertShow(this, "cancel", "微信不能为空");
        return;
      }
      //设置用户的uid
      data.id = that.data.user.id;

      //搜集formId
      var formId = e.detail.formId;
      console.log("个人资料编辑formId:" + formId);
      httpUtil.saveFormId({ uid: that.data.user.id, formId: formId }, function (res) { });

      // //判断是否已授权
      var that = this;
      //判断是否已授权

      //设置头像.如果没有头像则设置为默认的头像.
      data.avatar = that.data.userInfo.avatarUrl || "https://api.xxpeople.com/upload/noavatar.png";
      httpUtil.showLoading("提交中");
      console.log("用户编辑：", data);
      //配置
      httpUtil.userEdit(data, function (res) {
        console.log("用户编辑返回结果:", res);
        setTimeout(function () {
          httpUtil.hideToast();
          if (res.code === -1) {
            httpUtil.alertShow(that, "cancel", "美好的新人，你还有必填选项没有填哦");
            return;
          } else {
            httpUtil.alertShow(that, "success", res.message);
            //跳转到首页
            wx.switchTab({
              url: '/pages/User/user'
            })
          }
        }, 1000);
      });
    } catch (e) {
      console.log("出错了:" + e);
      httpUtil.alertShow(this, "cancel", "出错了");
    }
  },

  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },

  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },

  //上传图片
  uploadImg: function (e) {

    var typeInt = e.currentTarget.dataset.type;
    console.log("typeInt:", typeInt);
    var that = this;

    if (typeInt == 1 && that.data.charm_imgs.length >= 9) {
      httpUtil.alertShow(this, "cancel", "最多只能上传9张魅力图");
      return;
    }
    if (typeInt == 2 && that.data.live_imgs.length >= 9) {
      httpUtil.alertShow(this, "cancel", "最多只能上传9张理想居住空间图");
      return;
    }
    var max = 9;
    var count = 0;
    if (typeInt == 1) {
      count = max - that.data.charm_imgs.length;
    } else if (typeInt == 2) {
      count = max - that.data.live_imgs.length;
    }

    wx.chooseImage({
      count: count, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        for (var i = 0, lengths = tempFilePaths.length; i < lengths; i++) {
          var tempFilePath = tempFilePaths[i]
          wx.uploadFile({
            url: common.constans.domain + '/common/upload',
            filePath: tempFilePath,
            name: 'file',
            formData: {
              uid: that.data.uid,
              rel_id: that.data.user.id,
              'type': typeInt,

            },
            success: function (res) {
              console.log(JSON.parse(res.data))
              var data = JSON.parse(res.data);
              var imgObj = {
                url: data.data[0].url,
                type: typeInt,
                cover: 0,
                id: data.data[0].id,
              };

              console.log("上传图片", data.data[0]);
              if (typeInt == 1) {
                that.data.charm_imgs_ids.push(data.data[0].id);
                that.setData({
                  charm_imgs: that.data.charm_imgs.concat(imgObj)
                });
              } else if (typeInt == 2) {
                that.data.live_imgs_ids.push(data.data[0].id);
                that.setData({
                  live_imgs: that.data.live_imgs.concat(imgObj)
                });
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
    var type = e.currentTarget.dataset.type;
    var idx = e.currentTarget.dataset.idx;
    var urls = [];
    var that = this;
    if (type == 1) {
      that.data.charm_imgs.map(function (item) {
        urls.push(item.url);
      });
    } else {
      that.data.live_imgs.map(function (item) {
        urls.push(item.url);
      });
    }
    wx.previewImage({
      current: urls[idx], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  //长按设置封面图片
  setCover: function (e) {

    var that = this;
    var id = e.currentTarget.dataset.id;
    var idx = e.currentTarget.dataset.idx;
    var type = e.currentTarget.dataset.type;
    console.log("点击设置封面," + id);

    var param = {
      id: id,
      rel_id: this.data.rel_id,
    }
    httpUtil.setCover(param, function (res) {
      if (res.code == 200) {
        var tmpArr = that.data.charm_imgs;
        tmpArr[idx].selected = true
        that.setData({
          charm_imgs: tmpArr
        });

      }
    });
  },
  first: function () {
    wx.switchTab({
      url: '/pages/User/user'
    })
  }
});