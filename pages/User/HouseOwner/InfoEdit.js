//房东个人资料编辑
var httpUtil = require("../../../common/httpUtil.js");
var common = require("../../../common/common.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: "",
    age: "",
    user: "",
    charm_imgs_ids: [], //魅力照图片
    charm_imgs: [],
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
  },



  //时间选择
  bindBirthChange: function (e) {
    var that = this;
    //根据生日推算出年龄
    var birth = e.detail.value;
    var age = new Date().getFullYear() - new Date(birth).getFullYear()
    var user = that.data.user;
    user.age = age;
    this.setData({
      birth: birth,
      user: user,
      age: age,
    })
  },

  bindSexChange: function (e) {
    this.setData({
      sexIndex: e.detail.value,
      sexId: this.data.sexArray[e.detail.value].id,
    })
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

    var id = options.id || uid;
    var that = this;
    //加载用户数据
    httpUtil.showLoading();
    console.log("id={}", id);
    httpUtil.getUser({ uid: id}, function (data) {
      console.log("getUser:{}", data.data);
      httpUtil.hideToast();
      if (data.code === 200) {
        that.setData({
          user: data.data,
          uid: data.data.id,
          sexIndex: !data.data.sex ? 0 : parseInt(data.data.sex) - 1,
          birth: data.data.birth,
          userinfo: getApp().globalData.userInfo,

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


      //data validate
      if (that.data.charm_imgs_ids.length < 1) {
        httpUtil.alertShow(this, "cancel", "我的魅力照不能为空");
        return;
      }
      if (that.data.charm_imgs_ids.length > 9) {
        httpUtil.alertShow(this, "cancel", "我的魅力照最多只能传9张");
        return;
      }

      if (!data.username) {
        httpUtil.alertShow(this, "cancel", "昵称不能为空");
        return;
      }

      if (!that.data.birth) {
        httpUtil.alertShow(this, "cancel", "生日不能为空");
        return;
      }

      //图片个数
      data.personImgNum = that.data.charm_imgs.length;


      data.sex = that.data.sexId;
    
      data.birth = that.data.birth;




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
      if (!getApp().globalData.userInfo) {
        wx.getSetting({
          success(res) {
            console.log("获取授权列表：" + res);
            if (!res.authSetting['scope.userInfo']) {
              wx.showModal({
                title: '提示',
                content: '您没有授权，将影响到您接下来更好地使用新新人类乐园的服务，我们申请获得您的公开信息（头像及昵称）',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户重新授权..')
                    wx.openSetting({
                      success: (res) => {
                        res.authSetting = {
                          "scope.userInfo": true,
                          "scope.userLocation": true
                        }
                        getApp().getUserInfo();
                      }
                    })

                  } else if (res.cancel) {

                  }
                }
              });
            }
          }
        });
        return;
      }

      //设置头像
      data.avatar = getApp().globalData.userInfo.avatarUrl;
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
  }

});