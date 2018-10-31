// pages/change/futureCity/loveApartment/loveApartment.js
var util = require("../../../../common/httpUtil.js");
var common = require("../../../../common/common.js");
const AreaData = require("../../../../common/Area.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectIndex: "",
    autoplay: false,
    interval: 3000,
    duration: 1000,
    motif:'',
    label:'',
    name:'',
    name:1,
    theme: [{
       id: 10,
       name: '欢乐颂',
       url:'http://admin.xxpeople.com/upload/images/aqgy/1.jpg',
       prompt: '家，因为一群灵动的女生而变得格外有魅力',
        checked: false,
        num:1,
      }, {
        id: 9,
        name: 'loft',
        checked: false,
        url:'http://admin.xxpeople.com/upload/images/aqgy/2.jpg',
        prompt: '双层空间，开阔的空间，独特的采光，让家更具想象力',
        num: 2,
      },
      {
        id: 7,
        name: '影视人',
        checked: false,
        prompt:'用影视的魅力链接你我的心灵，探索人类艺术的美好，在思想的大海里遨游',
        url:'http://admin.xxpeople.com/upload/images/aqgy/11.jpeg',
        num: 3,
      },
      {
        id: 6,
        url:'http://admin.xxpeople.com/upload/images/aqgy/4.png',
        name: '健身派',
        prompt: '感受身体的健美与生活的协调，每天都活力四射，工作都变得轻松起来',
        'checked': false,
        num: 4,
      }, {
        id: 5,
        name: '学院风',
        checked: false,
        url:'http://admin.xxpeople.com/upload/images/aqgy/5.png',
        prompt: '我们的家，也可以是知识的海洋，我们在这里探索真理，纵横宇宙间，便览人类智慧',
        num: 5,
      },
      {
        id: 8,
        name: '音乐族',
        url:'http://admin.xxpeople.com/upload/images/aqgy/6.jpg',
        checked: false,
        prompt:'音乐的力量，让家轻盈灵动起来',
        num: 6,
      },
      {
        id: 1,
        name: "小森林",
        url:'http://admin.xxpeople.com/upload/images/aqgy/7.jpeg',
        checked: false,
        prompt:'亲近自然，过简单美好的生活，每个人的生命中都应该有一座自己的小森林，在这里治愈心灵，回归本真',
        num: 7,
      },
      {
        id: 2,
        url:'http://admin.xxpeople.com/upload/images/aqgy/8.jpeg',
        name: "萌萌哒",
        checked: false,
        prompt:'家有萌宠，一起边吸猫，边看球赛啊，或者我们在看书，萌宠们陪在身边，小乐小惬意',
        num: 8,
      }, {
        id: 4,
        name: '舌尖味',
        checked: false,
        url:'http://admin.xxpeople.com/upload/images/aqgy/9.jpeg',
        prompt:'用美味装点生活，只要你想，每天都可以美滋美味，通过共烹饪美食，让我们之间的友谊来得更醇厚',
        num: 9,
      },
      {
        id: 3,
        url:'http://admin.xxpeople.com/upload/images/aqgy/10.jpeg',
        name: '智能家',
        checked: false,
        prompt:'探索科技的魅力，感受科技的美好，走在时代前沿，成为新风尚潮儿',
        num: 10,
      },

    ],
    num: [{
        id: 0,
        name: 1,
        checked: false,
      }, {
        id: 1,
        name: 2,
        checked: false,
      },
      {
        id: 2,
        name: 3,
        checked: false,
      },
      {
        id: 3,
        name: 4,
        checked: false,
      },
      {
        id: 4,
        name: 5,
        checked: false,
      },
      {
        id: 5,
        name: 6,
        checked: false,
      },
      {
        id: 6,
        name: 7,
        checked: false,
      },
      {
        id: 7,
        name: 8,
        checked: false,
      },
      {
        id: 8,
        name: 9,
        checked: false,
      },
      {
        id: 9,
        name: 10,
        checked: false,
      },
    ],
    prompt: [{
        id: 0,
        name: '家，因为一群灵动的女生而变得格外有魅力',

        checked: false,
      }, {
        id: 1,
        name: '双层空间，开阔的空间，独特的采光，让家更具想象力',
        checked: false,
      },
      {
        id: 2,
        name: '用影视的魅力链接你我的心灵，探索人类艺术的美好，在思想的大海里遨游',
        checked: false,
      },
      {
        id: 3,
        name: '感受身体的健美与生活的协调，每天都活力四射，工作都变得轻松起来',
        checked: false,

        'checked': false,
      }, {
        id: 4,
        name: '我们的家，也可以是知识的海洋，我们在这里探索真理，纵横宇宙间，便览人类智慧',
        checked: false,
      },
      {
        id: 5,
        name: '音乐的力量，让家轻盈灵动起来',
      },
      {
        id: 6,
        name: "亲近自然，过简单美好的生活，每个人的生命中都应该有一座自己的小森林，在这里治愈心灵，回归本真",

        checked: false,
      },
      {
        id: 7,

        name: "家有萌宠，一起边吸猫，边看球赛啊，或者我们在看书，萌宠们陪在身边，小乐小惬意",
        checked: false,
      }, {
        id: 8,
        name: '用美味装点生活，只要你想，每天都可以美滋美味，通过共烹饪美食，让我们之间的友谊来得更醇厚',
        checked: false,
      },
      {
        id: 9,

        name: '探索科技的魅力，感受科技的美好，走在时代前沿，成为新风尚潮儿',
        checked: false,
      },

    ],

  },
  selectTheme: function(e) {
    console.log(e)
    var that = this;
    var id = e.currentTarget.dataset.val.id;
    var name = e.currentTarget.dataset.val.name;
    var idx = e.currentTarget.dataset.idx;
    var selectIndex = e.currentTarget.dataset.idx;
    if (that.data.num[idx].checked == false) {
      that.data.num[idx].checked = true;
    }

    that.setData({
      selectIndex: selectIndex,
      num: that.data.num,
      name:name
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var selectIndex = options.selecttheme
    var that = this
    that.setData({
      selectIndex: selectIndex
    })
    util.getLoveimg(1, function(res) {
      console.log('res.data', res.data)
      that.setData({
        imgUrls: res.data
      })

    });
  },
  comformTheme:function(e){
   console.log(e)
    var label = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    this.setData({
      label: label,
      name: name,
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    if (prevPage && prevPage.route == "pages/change/futureCity/futurecity") {
      prevPage.setData({
        love_apartment:true,
        needReload: true,
        subject:false,
        searchCondition: {
        label:this.data.label,
          name:this.data.name,
          type: 3,
        },
      });
  }
    wx.switchTab({
      url: '/pages/change/futureCity/futurecity',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {




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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
  },
  swiperChange: function (e) {
    this.setData({
      selectIndex: e.detail.current
    })
  }
})