var t = require("../../../../../common/httpUtil.js"), e = require("../../../../../common/common.js");

Page({
    data: {
        items: "",
        charm_imgs: [],
        introduction_length: 0
    },
    onLoad: function(e) {
        var a = wx.getStorageSync("uid"), i = this;
        wx.getSystemInfo({
            success: function(t) {
                var e = t.windowHeight / 5 - 10;
                i.setData({
                    uid: a,
                    imageWidth: e
                });
            }
        });
        var n = e.id;
        t.myhomeDetail({
            id: n,
            uid: a
        }, function(t) {
            var e = t.data.charm_imgs, a = [];
            for (var n in e) 3 == e[n].type && a.push(e[n]);
            i.setData({
                items: t.data,
                charm_imgs: a,
                introduction_length: t.data.introduction.length
            });
        });
    },
    startDateChange: function(t) {
        console.log("picker发送选择改变，携带值为", t.detail.value);
        var e = this.data.items;
        e.start = t.detail.value, this.setData({
            items: e
        });
    },
    endDateChange: function(t) {
        console.log("picker发送选择改变，携带值为", t.detail.value);
        var e = new Date(t.detail.value).getTime();
        if (e < new Date(this.data.items.start).getTime()) wx.showToast({
            title: "结束时间必须大于开始时间",
            icon: "none",
            duration: 1e3
        }); else {
            var a = this.data.items;
          a.end = t.detail.value, this.setData({
                items: a
            });
        }
    },
    applyDateChange: function(t) {
        var e = this.data.items;
        e.apply_end = t.detail.value, this.setData({
            items: e
        });
    },
    introductionEvent: function(t) {
        var e = this.data.items;
        e.introduction = t.detail.value;
        var a = t.detail.value + "";
        this.setData({
            introduction_length: a.length,
            items: e
        });
    },
    uploadImg: function(a) {
        var i = this;
        if (i.data.charm_imgs.length >= 9) t.alertShow(this, "cancel", "个人魅力照最多只能传9张"); else {
            var n = 9 - i.data.charm_imgs.length;
            wx.chooseImage({
                count: n,
                sizeType: [ "original", "compressed" ],
                sourceType: [ "album", "camera" ],
                success: function(a) {
                    for (var n = a.tempFilePaths, o = 0, s = n.length; o < s; o++) {
                        var c = i.data.charm_imgs;
                        wx.uploadFile({
                            url: e.constans.domain + "/common/upload",
                            filePath: n[o],
                            name: "file",
                            formData: {
                                uid: i.data.uid,
                                rel_id: i.data.items.id,
                                type: 3
                            },
                            success: function(e) {
                                console.log("upload res:" + e);
                                try {
                                    var a = JSON.parse(e.data);
                                    if (200 == a.code) {
                                        var n = a.data[0];
                                        c.push(n);
                                        //var o = i.data.items;
                                        i.setData({
                                          charm_imgs: c
                                        });
                                    } else t.alertShow(i, "cancel", "上传失败");
                                } catch (e) {
                                    console.log(e), t.alertShow(i, "cancel", "啊哦，上传失败了");
                                }
                            }
                        });
                    }
                }
            });
        }
    },
    deleteImg: function(e) {
        var a = this, i = e.currentTarget.dataset.id, n = a.data.items;
        wx.showModal({
            title: "提示",
            content: "你确定要删除吗?",
            success: function(e) {
                if (e.confirm) {
                    console.log("用户点击删除");
                    var o = {
                        id: i
                    };
                    t.imgDel(o, function(e) {
                        if (200 == e.code) {
                            var o = n.charm_imgs, s = o.indexOf(i);
                            s > -1 && o.splice(s, 1), n.charm_imgs = o, a.setData({
                                items: n
                            });
                        } else t.alertShow(a, "cancel", "删除失败");
                    });
                }
            }
        });
    },
    formSubmit: function(e) {
        var a = this, i = a.data.items;
        if (i.start) if (i.end) if (i.introduction) {
            var n = {
                id: i.id,
                introduction: i.introduction,
                start: i.start,
                end: i.end,
                apply_end: i.apply_end
            };
            console.log(n), t.addHome(n, function(t) {
                console.log("res:", t), 200 == t.code ? wx.showToast({
                    title: "修改成功",
                    icon: "none",
                    duration: 2e3,
                    success: function() {
                        wx.reLaunch({
                            url: "/pages/change/my/ideeaHome/ideaHome?id=" + i.id + "&uid=" + a.data.uid
                        });
                    }
                }) : wx.showToast({
                    title: "修改失败",
                    icon: "none",
                    duration: 1e3
                });
            });
        } else wx.showToast({
            title: "自我介绍不能为空",
            icon: "none",
            duration: 1e3
        }); else wx.showToast({
            title: "结束时间不能为空",
            icon: "none",
            duration: 1e3
        }); else wx.showToast({
            title: "入住时间不能为空",
            icon: "none",
            duration: 1e3
        });
    }
});