/**
 * 获取用户信息
 */
var common = require("common.js");
var domain = common.constans.domain;
//获取单个
function getUser(data,cb){
  httpRequest('/apiuser/detail',data,cb);
}

//获取图片
function getIamges(data, cb) {
  httpRequest('/apihome/getPromHome', data,  cb);
}

//获取图片
function getImgs(type,uid,rel_id,cb){
  httpRequest('/common/getImgs',{type:type,uid:uid,rel_id:rel_id},cb);
}
//经纬度转换为城市
function latlng2City(lat, lng,cb){
  var url = "https://apis.map.qq.com/ws/geocoder/v1/?location="+ lat +","+ lng +"&key=NXWBZ-V4UWO-6J3W6-SZXCT-RLUBF-ELB7X";
  httpRequest(url,{},cb);
}

//获取首页数据
function getSearchHomeList(data,cb){
  httpRequest('/apihome/search',data,cb);
}

//创家
function addHome(data,cb){
  httpRequest('/apihome/add', data, cb);
}

//寻房
function searchRoomList(data,cb){
  httpRequest("/apiroom/search",data, cb);
}

//设置封面
function setCover(data, cb) {
  httpRequest("/common/setCover", data, cb);
}
//设置封面
function getVideoUrl(data, cb) {
  httpRequest("/common/getVideoUrl", data, cb);
}

//我的理想之家列表
function myhomeList(data,cb){
  httpRequest('/apihome/myhome',data,cb);
}

//显示或隐藏爱家
function showHiddenHome(data, cb) {
  httpRequest('/apihome/showHiddenHome', data, cb);
}
// 显示或隐藏房源
function showHiddenreserve(data, cb) {
  httpRequest('/apiroom/show', data, cb);
}
//我的理想之家详情
function myhomeDetail(data, cb) {
  httpRequest('/apihome/detail', data, cb);
}
//有房出租
function addRoom(data, cb){
  httpRequest('/apiroom/add', data, cb);
}

//获取配置
function getHobbies(data,cb){
  httpRequest('/common/getHobbies', {}, cb);
}

//获取个人二维码
function getInvitationErCode(data, cb) {
  httpRequest('/common/getInvitationErCode', data, cb);
}
//获取爱情公寓图片
function getLoveimg(data, cb){
  httpRequest('/apihome/aqgyImg',data,cb)
}


//我喜欢的
function mylikehome(data,cb){
  httpRequest('/apihome/mylikehome', data, cb);
}
//我发布的房源
function myroomlist(data,cb){
  httpRequest('/apiroom/myroomlist', data, cb);
}
//房源详情
function roomDetail(data,cb){
  httpRequest('/apiroom/roomDetail', data, cb);
}
//房源点赞
function like(data,cb){
  httpRequest('/apihome/like', data, cb);
}

//获取芝麻信用授权地址
function zhimaAuthInfoAuth(data,cb){
  httpRequest('/common/zhimaAuthInfoAuth', data, cb);
}

//获取消息
function getMessages(data,cb){
  httpRequest('/common/getPushMsg', data, cb);
}
// 获取未读消息
function getWeiReadMessages(id, cb) {
  httpRequest('/apicomment/unreadMsgCount', { uid: id }, cb);
}

//删除图片
function imgDel(data,cb){
  httpRequest('/common/delImgs', data, cb);
}
//删除房源
function houseDel(data, cb) {
  httpRequest('/apiroom/delete', data, cb);
}
// 删除理想之家
function ideHomeDel(data,cb){
  httpRequest('/apihome/delete',data,cb)
}
//批量删除图片
function delAllImgs(data,cb){
  httpRequest('/common/delAllImgs', data, cb);
}
//获取大学省份
function getProvince(data,cb){
  httpRequest('/common/getProvince', data, cb);
}
//获取大学省份
function getUniversityArea(data,cb){
  httpRequest('/common/getUniversityArea', data, cb);
}
//按省份获取大学
function getUniversityByArea(data,cb){
  httpRequest('/common/getUniversityByArea', data, cb);
}
//编辑个人资料
function userEdit(data,cb){
  httpRequest('/apiuser/add', data, cb);
}
//添加评论
function addComment(data,cb){
  httpRequest('/apicomment/add', data, cb);
}
//获取推荐列表
function getInvations(data, cb) {
  httpRequest('/apiuser/getInvations', data, cb);
}
//微信支付
function wxpay(data, cb) {
  httpRequest('/wxpay/aappPay', data, cb);
}

//获取推荐人数和状态
function signUpNum(data, cb) {
  httpRequest('/apiuser/signUpNum', data, cb);
}
//微信支付
function WeChatpay(data,cb){
  httpRequest('/wxpay/aappPay',data,cb);
}
//爱家评论
function homeComment(data, cb) {
  httpRequest('/apihome/homeComment', data, cb);
}

//获取评论
function getComment(data,cb){
  httpRequest('/apicomment/commentList', data, cb);
}
//获取验证码
function sendSms(data,cb){
  httpRequest('/common/sendSms', data, cb);
}
//验证 验证码
function validateCode(data,cb){
  httpRequest('/common/validateCode', data, cb);
}
//同意申请
function agreeApply(data,cb){
  httpRequest('/apicomment/agreeApply', data, cb);
}

//爱家申请加入
function applyHome(data, cb) {
  httpRequest('/apicomment/applyHome', data, cb);
}

//获取爱家申请
function getApplyHome(data, cb) {
  httpRequest('/apicomment/getApplyHome', data, cb);
}



//投票
function roomVote(data,cb){
  httpRequest('/apiroom/roomVote', data, cb);
}
//已读消息
function readMsg(data,cb){
  httpRequest('/apicomment/readMsg', data, cb);
}
//删除室友
function delHomeApply(data, cb) {
  httpRequest('/apicomment/delHomeApply', data, cb);
}


//获取消息
function getMsg(data,cb){
  httpRequest('/common/getMsg', data, cb);
}

//发送模板消息
function sendTemplateMsg(data, cb){
  httpRequest('/common/sendTemplateMsg', data, cb);
}

//爱家基本信息
function homeBasicInfo(data, cb){
  httpRequest('/apihome/basicInfo', data, cb);
}
//手机号解密
function decodeUserInfo(data, cb){
  httpRequest('/common/decodeUserInfo', data, cb);
}
//微信登录
function wechatLogin(data, cb){
  httpRequest('/common/wechatLogin', data, cb);
}

//获取二维码
function getErCode(data, cb) {
  httpRequest('/common/getErCode', data, cb);
}
//获取用户列表
function getUserList(data, cb) {
  httpRequest('/apiuser/seach', data, cb);
}

//申请交换联系方式
function applyChangeConcat(data, cb) {
  httpRequest('/apiuser/applyChangeConcat', data, cb);
}
//同意交换联系方式
function agreeChangeConcat(data, cb) {
  httpRequest('/apiuser/agreeChangeConcat', data, cb);
}


//发送formId
function saveFormId(data, cb) {
  if (data.formId == 'the formId is a mock one'|| !data.formId){
    return;
  }
  data.expire = parseInt((new Date().getTime() / 1000) + 7 * 86400);
  httpRequest('/common/saveFormId', data, cb);
}

//区域类型
function _type(post_type) {
  for (var x in post_type) {  //=======处理移动端,小程序去掉json键首尾0问题
    let tmp = post_type[x]
    if (x.length == 3) {
      let tmpX = '0' + x;
      delete post_type[x];
      post_type[tmpX] = tmp;
    }
  }
  var id = [];
  for (var i in post_type) id.push(i);
  return id.sort().map(function (item) {
    return {
      id: item,
      _type: post_type[item]
    }
  })
}
//区域小类
function postlist(all, id) {
  for (var x in all) {  //=======处理移动端,小程序去掉json键首尾0问题
    let tmp = all[x]
    if (x.length == 3) {
      let tmpX = '0' + x;
      delete all[x];
      all[tmpX] = tmp;
    }
  }
  var temId = id.substring(0, 2);
  var allId = [];
  for (let id in all) allId.push(id);
  var id = allId.filter(function (item) {
    return RegExp('^' + temId).test(item);
  })
  return id.map(function (item) {
    return {
      id: item,
      post: all[item]
    }
  })
}

function httpRequest(url,data,cb){
  var url = url;
  var _method = "GET";
  var _header = { "content-type": "application/json" };
  if (url == '/apihome/add' || url == '/apiuser/add') {
    _method = "POST";
    _header = { "content-type": "application/x-www-form-urlencoded" };
  }
  
  if (!url.startsWith("http")){
    url = domain + url;
  }
  
  wx.request({
    url: url,
    data: data,
    header: _header,
    method: _method,
    success: function (res) {
      //console.log(res);
      typeof cb == "function" && cb(res.data);
    },
    fail: function (res) { },
    complete: function (res) { },
  })
}


//成功提示
function showSuccess(title = "成功啦", duration = 2500) {
  wx.showToast({
    title: title,
    icon: 'success',
    duration: (duration <= 0) ? 2500 : duration
  });
}
//loading提示
function showLoading(title = "请稍后", duration = 5000) {
  wx.showToast({
    title: title,
    icon: 'loading',
    duration: (duration <= 0) ? 5000 : duration
  });
}
//隐藏提示框
function hideToast() {
  wx.hideToast();
}

//显示带取消按钮的消息提示框
function alertViewWithCancel(title = "提示", content = "消息提示", confirm, showCancel = "true") {
  wx.showModal({
    title: title,
    content: content,
    showCancel: showCancel,
    success: function (res) {
      if (res.confirm) {
        confirm();
      }
    }
  });
}
//显示不取消按钮的消息提示框
function alertView(title = "提示", content = "消息提示", confirm) {
  alertViewWithCancel(title, content, confirm, false);
}
//当前日期

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/')
  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//时间戳转日期
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function formatTimeTwo(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
//日期格式化
function getDateDiff(date) {
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = now - new Date(date).getTime();
  if (diffValue < 0) { return; }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  if (monthC >= 1) {
    result = "" + parseInt(monthC) + "月前";
  }
  else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  }
  else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  }
  else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  }
  else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else
    result = "刚刚";
  return result;
}
function alertShow(that, iconType, alertlable) {
  that.setData({
    isAlert: true,
    iconType: iconType,
    alertLable: alertlable
  });
  setTimeout(function (e) {
    that.setData({
      isAlert: false
    })
  }, 1500)
}
module.exports = {
  showSuccess: showSuccess,
  showLoading: showLoading,
  hideToast: hideToast,
  alertViewWithCancel: alertViewWithCancel,
  alertView: alertView,
  getUser:getUser,
  getImgs: getImgs,
  getDateDiff: getDateDiff,
  getSearchHomeList: getSearchHomeList,
  addHome:addHome,  
  alertShow: alertShow,
  searchRoomList: searchRoomList,
  setCover: setCover,
  myhomeList: myhomeList,
  myhomeDetail: myhomeDetail,
  addRoom: addRoom,
  getHobbies: getHobbies,
  mylikehome: mylikehome,
  myroomlist: myroomlist,
  roomDetail: roomDetail,
  like: like,
  zhimaAuthInfoAuth: zhimaAuthInfoAuth,
  getMessages: getMessages,
  imgDel: imgDel,
  getUniversityArea: getUniversityArea,
  getUniversityByArea: getUniversityByArea,
  userEdit: userEdit,
  addComment: addComment,
  getComment: getComment,
  sendSms:sendSms,
  validateCode:validateCode,
  agreeApply: agreeApply,
  delAllImgs: delAllImgs,
  getProvince: getProvince,
  roomVote:roomVote,
  getWeiReadMessages: getWeiReadMessages,
  readMsg: readMsg,
  getMsg: getMsg,
  getIamges: getIamges,
  latlng2City:latlng2City,
  sendTemplateMsg: sendTemplateMsg,
  homeBasicInfo: homeBasicInfo,
  decodeUserInfo: decodeUserInfo,
  wechatLogin: wechatLogin,
  saveFormId: saveFormId,
  getErCode:getErCode,
  getUserList:getUserList,
  agreeChangeConcat: agreeChangeConcat,
  applyChangeConcat: applyChangeConcat,
  showHiddenHome:showHiddenHome,
  showHiddenreserve:showHiddenreserve,
  applyHome: applyHome,
  getApplyHome: getApplyHome,
  homeComment: homeComment,
  getVideoUrl: getVideoUrl,
  delHomeApply: delHomeApply,
  getInvitationErCode: getInvitationErCode,
  getInvations: getInvations,
  signUpNum: signUpNum,
  _type: _type,
  postlist: postlist,
  houseDel:houseDel,
  WeChatpay: WeChatpay,
  ideHomeDel: ideHomeDel,
  getLoveimg: getLoveimg,
  formatTime: formatTime,
  formatNumber: formatNumber,
  wxpay: wxpay,
}