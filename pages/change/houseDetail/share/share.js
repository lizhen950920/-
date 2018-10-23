var util = require("../../../../common/httpUtil.js");
var common = require("../../../../common/common.js");

const AreaData = require("../../../../common/Area.js");

Page({
  data: {
    uid: "",
    home: "",
    coverImg: "",
    ercodeImg: "",

  },

  onShow: function () {
    var uid = wx.getStorageSync('uid');
    if (!uid || uid == "") {
      wx.navigateTo({
        url: '/pages/User/Login/Login',
      })
      console.log("未登录");
      return;
    }
  },

  onLoad: function (option) {
    var that = this;
    console.log("onloaded");
    var uid = wx.getStorageSync('uid');
    var id = option.id; //传递id
    var ercode = option.ercode; //二维码；
    util.showLoading();
    var params = {
      uid: option.uid, //创家者uid
      id: id,
    };
    that.setData({
      loginUid: uid,
    });
    wx.getSystemInfo({
      success: function (res) {

        var width = res.windowHeight / 6 - 10;
        that.setData({
          uid: uid,
          imageWidth: width,
          screenWidth: res.screenWidth,
          screenHeight: res.screenHeight,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          pixelRatio: res.pixelRatio,
        });

        //二维码不存在则生成.
        if (!ercode || ercode == undefined || ercode == 'undefined') {
          console.log("ercode not exist");
          util.getErCode({ uid: option.uid, id: id }, function (res) {
            var ercodeImg = res.message;
            that.donwloadSaveFile(ercodeImg, function (result) {

              that.setData({
                ercodeImg: ercode,
                ercodeImgLocal: result
              });

              util.roomDetail(params, function (res) {
                var tmpHome = res.data;
                console.log(" ercode not exist myhomeDetail");
                var coverImg = "";
                tmpHome.charm_imgs.map(function (item) {
                  item.selected = false;
                  if (item.type == 4 && item.cover == 1) {
                    coverImg = item.url;
                    that.donwloadSaveFile(coverImg, function (result) {
                      that.setData({
                        coverImgLocal: result,
                      });
                      that.donwloadSaveFile(tmpHome.avatar, function (result) {
                        that.setData({
                          avatar: result,
                        });
                        console.log(" ercode not exist drawImg");
                        that.drawImg();
                      });
                    });
                  }
                });
                that.setData({
                  home: tmpHome,
                  coverImg: coverImg,
                });
              });
            });
          });
        } else {
          console.log("ercode exist");
          that.donwloadSaveFile(ercode, function (result) {
            console.log("donwload file :" + ercode);
            that.setData({
              ercodeImg: ercode,
              ercodeImgLocal: result
            });

            util.myhomeDetail(params, function (res) {
              var tmpHome = res.data;
              console.log("ercode exist myhomeDetail params:" + params);
              console.log("ercode exist myhomeDetail res:" + JSON.stringify(tmpHome));
              var coverImg = "";
              tmpHome.charm_imgs.map(function (item) {
                item.selected = false;
                if (item.type == 4 && item.cover == 1) {
                  coverImg = item.url;
                  that.donwloadSaveFile(coverImg, function (result) {
                    that.setData({
                      coverImgLocal: result,
                    });
                    that.donwloadSaveFile(tmpHome.avatar, function (result) {
                      that.setData({
                        avatar: result,
                      });
                      console.log(" ercode exist drawImg");
                      that.drawImg();
                    });
                  });
                }
              });
              that.setData({
                home: tmpHome,
                coverImg: coverImg,
              });
            });
          });
        }
      }
    });
  },

  donwloadSaveFile: function (url, cb) {
    var that = this;
    var path = url.replace("http://admin", "https://api");
    wx.downloadFile({
      url: path,
      success: function (res) {
        if (res.statusCode === 200) {
          console.log("donwload file success:" + res.tempFilePath);
          var tempFilePath = res.tempFilePath;
          var i = 1;
          that.saveFile(tempFilePath, i, function (saveFileRes) {
            cb(saveFileRes);
          });
        } else {
          console.log("donwload file fail:" + url);
        }
      }
    })
  },

  saveFile(tempFilePath, i, cb) {
    var that = this;
    wx.saveFile({
      tempFilePath: tempFilePath,
      success: function (res) {
        var savedFilePath = res.savedFilePath;
        console.log("savedFilePath", savedFilePath);
        cb(savedFilePath);
      },
      fail: function (res) {
        console.log("save file fail:" + tempFilePath + ",res:" + JSON.stringify(res));
        if (i < 5) {
          i++;
          that.saveFile(tempFilePath, i, cb);
        } else {
          wx.showToast({
            title: '生成卡片失败，请手工截图~',
          })
          cb(tempFilePath);
        }
      }
    })
  },

  //画文字
  drawText: function (context, fontSize, fontColor, left, top, text, center) {

    context.setFontSize(fontSize);
    context.setFillStyle(fontColor);
    if (center) {
      context.setTextAlign(center)
    }
    context.fillText(text, left, top);


  },

  //drawColor
  drawColor: function (context, color, left, top, width, height) {
    context.setFillStyle(color);
    context.fillRect(left, top, width, height)


  },

  drawImg: function () {
    var that = this;
    var ctx = wx.createCanvasContext("mycanvas");
    var windowHeight = that.data.windowHeight;//窗口高度;
    var screenWidth = that.data.screenWidth;//屏幕宽度

    //屏幕背景
    this.drawColor(ctx, '#ffffff', 0, 0, that.data.screenWidth, that.data.screenHeight);
    //顶部
    ctx.drawImage(that.data.avatar, 0, 0, windowHeight * 0.08, windowHeight * 0.08);
    var text = that.data.home.username + "：嗨朋友们，我在爱奇林创了"
    if (that.data.loginUid != that.data.home.uid) {
      text = that.data.home.username + "：嗨朋友们，我在爱奇林发现"
    }
    this.drawText(ctx, "14", "#000000", windowHeight * 0.09, windowHeight * 0.03, text, "left");
    this.drawText(ctx, "14", "#000000", windowHeight * 0.09, windowHeight * 0.06, "一个家，缺室友，好缺！", "left");
    //头部背景
    this.drawColor(ctx, '#FFFF00', 0, windowHeight * 0.08, screenWidth, windowHeight * 0.09);

    var halfWidth = screenWidth / 2;
    this.drawText(ctx, "36", "#000000", halfWidth, windowHeight * 0.147, "我们住一起好吗？", "center");
    this.drawText(ctx, "26", "#000000", halfWidth, windowHeight * 0.22, that.data.home.name, "center");
    this.drawText(ctx, "12", "blue", halfWidth, windowHeight * 0.25, that.data.home.declaration, "center");
    ctx.drawImage(that.data.coverImgLocal, screenWidth * 0.02, windowHeight * 0.27, that.data.screenWidth - (screenWidth * 0.02) * 2, windowHeight * 0.319);


    ctx.drawImage(that.data.ercodeImgLocal, that.data.screenWidth / 2 - 60, windowHeight * 0.59, screenWidth * 0.32, windowHeight * 0.19);


    //this.drawText(ctx, "18", "red", that.data.screenWidth / 3 * 2 + 60, windowHeight * 0.64, "一起搭建我们", "");
    //this.drawText(ctx, "18", "red", that.data.screenWidth / 3 * 2 + 60, windowHeight * 0.69, "想要的小天地", "");

    //ctx.setStrokeStyle('red')
    //ctx.strokeRect(halfWidth * 0.5, windowHeight * 0.746, windowHeight * 0.49, 20);

    this.drawText(ctx, "13", "#000000", halfWidth, windowHeight * 0.81, "长按图片识别小程序码进入与我共建小天地", "center");
    this.drawText(ctx, "13", "#000000", halfWidth, windowHeight * 0.85, "无论你能不能跟我一起", "center");
    this.drawText(ctx, "18", "#000000", halfWidth, windowHeight * 0.888, "求转发，求推荐！帮我找到对的室友", "center");
    this.drawText(ctx, "13", "red", halfWidth, windowHeight * 0.92, "也许那个对的室友，就在身边", "center");

    //this.drawText(ctx, "13", "#ffffff", halfWidth, 680, "也许那个对的室友，就在身边", "center");
    ctx.draw();
    util.hideToast();
  },

  //生成图片
  saveImg: function () {
    var that = this;

    //绘制图片
    //将生成好的图片保存到本地
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.data.screenWidth,
      height: that.data.windowHeight,
      canvasId: 'mycanvas',
      destWidth: that.data.screenWidth * that.data.pixelRatio,
      destHeight: that.data.windowHeight * that.data.pixelRatio,
      success: function success(res) {
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function success(res) {
            console.log("canvasToTempFilePath:" + res.savedFilePath);
            wx.previewImage({
              urls: [res.savedFilePath],
            })
            that.setData({
              imagePath: res.savedFilePath,
              //canvasHidden: true//生成完图片后将画布隐藏
            });
          }
        });
      }
    });

  },


})
