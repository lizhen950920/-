var httpUtil = require("../../common/httpUtil.js");
// userhomepage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: "",
    imgs: [],
    imgsSize: 0,
    home_id: "",
    uid: "",
    mobile: "",
    home_uid: "",
    comment:"",
    introduction:"",
    home:"",
    applyStatus:false,
    selectidx:'0',
    room_id:'',
  },
  bindinput5:function(e){
    var comment=e.detail.value;
    var that=this
    that.setData({
      comment: comment
    })
  },
  selectroom:function(e){
console.log(e)
var idx=e.currentTarget.dataset.idx;

var that=this
    var room =that.data.home.rooms[idx].room_name
    console.log('room',room)
that.setData({
  selectidx: idx,
  room: room
}) 
  },
  bindMoveChange: function (e) {
    var that = this;
    var moveDate = e.detail.value;
    var ctype = e.currentTarget.dataset.type
    if (ctype == "1") {
      this.setData({
        move_start: moveDate,
      })
    } else {
      this.setData({
        move_end: moveDate,
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.home_id; //homeid
    var home_uid = options.homeuid;
    var showType = options.type;
    var selectidx=options.idx;
    var room_id = options.room_id;
    console.log(options)
    if (!selectidx){
      this.setData({
        selectidx: 0,
      })
     
    }
    console.log(options)
    var that = this;
 
    var uid = wx.getStorageSync('uid');
    that.setData({
      home_id: id,
      home_uid: home_uid,
      uid: uid,
      selectidx: selectidx,
      room_id: room_id,
    });
   
    httpUtil.getUser({ uid: that.data.uid}, function (data) {
      console.log("getUser:{}", data.data);
      if (data.code === 200) {
        var user = data.data;
        user.isShow=true;
        that.setData({
          user: user
        });
      } else {
        console.log(data.message);
      }
    });
    var type = 2;
    httpUtil.getImgs(type, that.data.uid, that.data.uid, function (data) {
      console.log("getImgs:{}", data.data);
      if (data.code === 200) {
        console.log(data.data.length);
        that.setData({
          imgs: data.data,
          imgsSize: data.data.length,
        });
      } else {
        console.log(data.message);
      }
    });

    //爱家信息
    httpUtil.homeBasicInfo({ id: that.data.home_id,uid: uid}, function (res) {
      console.log('res',res)
      wx.setNavigationBarTitle({
        title: res.data.name+" 入家申请",
      })
      var start = "";
      var end = "";
      if (res.data.homeApply){
        start = res.data.homeApply.move_start;
        end = res.data.homeApply.move_end;
      }
        
      var room = res.data.rooms[0].room_name
      console.log('room', room)
      that.setData({
        room: room
      })
      that.setData({
        home_title: res.data.name,
        home:res.data,
        move_start: start,
        move_end:end,
      });
     
    });
    
  },
  //错误提示
  showTips:function(content){
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: false,
    })
  },
  //提交申请
  bindFormSubmit: function (e) {
    var that = this;
    //判断是否可以加入 你的魅力值不足，请先去完善个人资料提升魅力值，当魅力值超过350时才可以申请
    // if (that.data.user.score < 350) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '你的魅力值不足，请先去完善个人资料提升魅力值，当魅力值超过350时才可以申请',
    //     showCancel: false,
    //     success: function () {
    //       wx.navigateTo({
    //         url: '/pages/User/MyHome/UserDataEditor/UserDataEditor?id=' + that.data.uid,
    //       })
    //     }
    //   })
    //   return;
    // }

    var data = e.detail.value;
    var content = that.data.comment;
    if (!that.data.comment){
      that.showTips('请填写自我介绍')
      return;
    }
    if(!that.data.move_start){
      that.showTips('请填写入住开始时间')
      return;
    }
    if (!that.data.move_end) {
      that.showTips('请填写入住结束时间')
      return;
    }
    // if (!data.room) {
    //   that.showTips('请填写申请房间')
    //   return;
    // }

    that.setData({
      applyStatus: true,
    });
    httpUtil.showLoading();
    
    var formId = e.detail.formId;
    console.log("入家申请formId:" + formId);
    //搜集formid
    httpUtil.saveFormId({ uid: that.data.uid, formId: formId }, function (res) { });
   
    var param = {
      content: that.data.comment,
      move_start:that.data.move_start,
      move_end: that.data.move_end,
      home_room: that.data.room,
      home_id: that.data.home_id,
      home_uid: that.data.home_uid,
      uid: that.data.uid,
      room_id: that.data.room_id,
    };
    console.log('param', param)
    //提交申请
    
    httpUtil.applyHome(param, function (res) {
      console.log(res);
      var comment = that.data.comment
      that.setData({
        applyStatus: false,
      });
      httpUtil.hideToast();
      if (res.code == 200) {
        that.sendTemplateMsg(res, comment);
        wx.showModal({
          title: '提示',
          content: '提交成功，请耐心等待发起人的回音',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              
              wx.redirectTo({
                url: '/pages/change/my/ideeaHome/ideaHome?id=' + that.data.home_id + '&uid=' + that.data.home_uid,
              })
            } 
          }
        })
        
      } else {
        httpUtil.alertShow(that, "cancel", res.message);
      }
    });
  },

  sendTemplateMsg: function (p,comment){
    var that = this;
    console.log('p',p)
    console.log('comment', comment)
    console.log("pushId:" + p.data.pushId);
    var url = 'pages/Home/Apply?id=' + p.data.pushId + '&applyuid=' + that.data.uid
      + '&home_id=' + that.data.home_id
      + '&homeuid=' + that.data.home_uid
      + '&status=' + 0
      + '&content=' + comment;
    //发送模板消息
    var paramMsg = {
      uid: that.data.home_uid, //发送给创建爱家的人
      msgType: 3,
      loginUid: that.data.uid, //申请人
      data: that.data.comment, //申请理由
      title: that.data.home_title,
      //page: 'pages/User/MyLdealHome/LdealHome/LdealHome?id=' + that.data.home_id + '&uid=' + that.data.home_uid,
      page: url,
    };
    console.log('paramMsg',paramMsg)
    httpUtil.sendTemplateMsg(paramMsg, function (res) {
      console.log("sendTemplateMsg：" + res);
    });
  },

  //点击预览图片
  previewImg: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var that = this;
    var urls = [];
    that.data.user.charm_imgs.map(function (item) {
      urls.push(item.url);
    });
    wx.previewImage({
      current: urls[idx], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

})