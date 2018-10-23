var util = require("../../common/httpUtil.js");
var common = require("../../common/common.js");

const AreaData = require("../../common/Area.js");
Page({
  data: {
    avatar: '',
  },
  onShow: function () {

  },
  onLoad: function (option) {
    var that = this;
    var uid = wx.getStorageSync('uid');
    var id = option.id; //传递id
    var ercode = option.ercode; //二维码；
    util.showLoading();
   
        that.setData({
          userinfo: wx.getStorageSync('userInfo')
        })
        that.drawImg();
     
    // var userinfo = getApp().globalData.userInfo;
    // that.setData({
    //   userinfo: userinfo,
    // })
    wx.getSystemInfo({
      success: function (res) {
        var width = res.windowHeight / 6 - 10;
        that.setData({
          imageWidth: width,
          screenWidth: res.screenWidth,
          screenHeight: res.screenHeight,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          pixelRatio: res.pixelRatio,
        });
        var uid = wx.getStorageSync('uid');
        util.getInvitationErCode({ "uid": uid }, function (data) {
          var ercodeImg = data.message;
          that.donwloadSaveFile(ercodeImg, function (result) {
            console.log('result', result)
            that.setData({
              ercodeImg: ercodeImg,
              ercodeImgLocal: result
            });
          });
        });

      }
    });
  },

  donwloadSaveFile: function (url, cb) {
    console.log('url', url)
    var that = this;
    var path = url.replace(/http\:\/\/api/g,"https://api");
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
 
    var halfWidth = screenWidth / 2;
    console.log(that.data.userinfo)
    //屏幕背景
    this.drawColor(ctx, '#ffffff', 0, 0, that.data.screenWidth, that.data.screenHeight);
    //顶部
    ctx.drawImage(that.data.userinfo.avatarUrl, windowHeight * 0.005, windowHeight * 0.01, windowHeight * 0.08, windowHeight * 0.08);
    var text = that.data.userinfo.nickName
    this.drawText(ctx, "14", "#000000", windowHeight * 0.09, windowHeight * 0.03, text, "left");
    this.drawText(ctx, "14", "#cccccc", windowHeight * 0.09, windowHeight * 0.06, "我发现了一个神奇的地方，它除了可以找爱情", "left");
    this.drawText(ctx, "14", "#cccccc", windowHeight * 0.09, windowHeight * 0.09, "公寓,竟然还可以匹配室友随心造美家！", "left");
    ctx.drawImage("/img/utopia/mark.png", screenWidth * 0.02, windowHeight * 0.10, that.data.screenWidth - (screenWidth * 0.02) * 2, windowHeight * 0.245);
    this.drawText(ctx, "30", "#000000", halfWidth, windowHeight * 0.39, "为了更好打拼", "center");
    this.drawText(ctx, "22", "#ff6600", halfWidth, windowHeight * 0.45, "我在爱奇林安家,房东直", "center");
    this.drawText(ctx, "22", "#ff6600", halfWidth, windowHeight * 0.50, "租还能减1001元房租,需", "center");
    this.drawText(ctx, "22", "#ff6600", halfWidth, windowHeight * 0.55, "要你的助力！", "center");
    this.drawText(ctx, "14", "#000000", halfWidth, windowHeight * 0.59, "扫码进入报名，既帮助了", "center");
    this.drawText(ctx, "14", "#000000", halfWidth, windowHeight * 0.62, "我,也为你预备了一个好去处", "center");
    ctx.drawImage(that.data.ercodeImgLocal, that.data.screenWidth / 2 - 60, windowHeight * 0.65, screenWidth * 0.32, windowHeight * 0.19);
    this.drawText(ctx, "13", "#000000", halfWidth, windowHeight * 0.86, "@爱奇林，你的奋斗守护者", "center");
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
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,

          success: function success(res) {
            console.log("canvasToTempFilePath:" + res.savedFilePath);
            wx.showToast({
              title: '保存成功',
            })
            // wx.previewImage({
            //   urls: [res.savedFilePath],
            // });
          }
        });
      }
    });

  },


  onShareAppMessage: function () {
    return {
      title: "邀请函",
      path: "/pages/Utopia/Index?uid=1",
    }
  }
})
