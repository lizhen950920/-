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
    comment: "",
    content:"",
    commentId:"",
    status:"0",
    home:"",
    disabledState:false,
  },

  bindinput: function (e) {
    this.setData({
      comment: e.detail.value
    });
  },
  //一键复制
  copy:function(e){
    var wechat = e.currentTarget.dataset.wechat;
    console.log(wechat);
    if(!wechat){
      return;
    }
    wx.setClipboardData({
      data: wechat,
      success:function(res){
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
  //一键call
  call: function (e) {
    var mobile = e.currentTarget.dataset.mobile;
    console.log(mobile);
    if(mobile){
      wx.makePhoneCall({
        phoneNumber: mobile,
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var commentId = options.id;//申请id push表id
    var id = options.home_id; //homeid
    var home_uid = options.homeuid; //爱家创建者uid
    var applyUid = options.applyuid; //申请者uid
    var content = options.content; //申请内容
    //var status = options.status; //是否已同意申请

    var that = this;

    that.setData({
      home_id: id,
      home_uid: home_uid,
      uid: applyUid,
      content:content,
      commentId: commentId,
      //status: status,
    });

    // httpUtil.getMsg({ id: commentId }, function (data) {
    //   that.setData({
    //     status: data.data.status,
    //   });
    // });


    httpUtil.getUser({ uid: that.data.uid}, function (data) {
      console.log("getUser:{}", data.data);
      if (data.code === 200) {
        var user = data.data;
        console.log('user',user)
        user.isShow=true;
        that.setData({
          user: user,
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
    //爱家申请信息
    httpUtil.getApplyHome({ uid: that.data.uid, home_uid: that.data.home_uid, home_id: that.data.home_id}, function (res) {
      console.log('res.data', res.data)
      that.setData({
        applyHome:res.data,
      });
    });
    //获取爱家信息
    httpUtil.homeBasicInfo({ id: that.data.home_id, uid: that.data.home_uid }, function (res) {
      that.setData({
        home:res.data,
      })
    });
  },

  //同意申请1，申请不通过2，没房3
  agreeApply: function (e) {
    var that = this;
    that.setData({
      disabledState:true,
    }); 
    var status = e.detail.value.status;
    var content = '同意成功，已通知申请者，你们接下来可以互加微信，祝你们聊的开心^O^';
    var msgType = 4;
    if (status == 2) {
      content = '提交成功'
      msgType = 7
    } else if (status == 3) {
      content = '提交成功'
      msgType = 8
    }
    var formId = e.detail.formId;
    console.log("同意申请formId:" + formId);
    //搜集formid
    httpUtil.saveFormId({ uid: that.data.uid, formId: formId }, function (res) { });

    //发送模板消息
    var paramMsg = {
      uid: that.data.uid, //发送给申请者
      msgType: msgType,
      loginUid: that.data.home_uid, //爱家uid
      data: "电话 "+ that.data.home.mobile,
      // title: that.data.home.name,
      page: 'pages/User/MyLdealHome/LdealHome/LdealHome?id=' + that.data.home_id + '&uid=' + that.data.home_uid,
    };
    httpUtil.sendTemplateMsg(paramMsg, function (res) {
      console.log("sendTemplateMsg：" + res);
    });

    var param = {
      uid: that.data.uid, //申请者uid
      homeid: that.data.home_id,
      homename: that.data.home.name,
      home_uid: that.data.home_uid,
      id: that.data.commentId,
      status: status,
    };
    
    //同意申请
    httpUtil.agreeApply(param, function (res) {
      console.log(res);
      that.setData({
        disabledState: false,
      });
      if (res.code == 200) {
        wx.showModal({
          title: '提示',
          content: content,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '/pages/User/MyLdealHome/LdealHome/LdealHome?id=' + that.data.home_id + '&uid=' + that.data.home_uid,
              })
            }
          }
        })
       
      } else {
        httpUtil.alertShow(that, "cancel", res.message);
      }
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