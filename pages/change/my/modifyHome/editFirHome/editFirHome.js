function e(e, a, t) {
    return a in e ? Object.defineProperty(e, a, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[a] = t, e;
}

var a = require("../../../../../common/httpUtil.js"), t = require("../../../../../common/common.js"), i = require("../../../../../common/Area.js");

Page({
    data: {
        uid: "",
        none_value: "",
        rel_id: 0,
        charm_imgs_ids: [],
        idea_imgs_ids: [],
        cover_id: "",
        idea_imgs: [],
        charm_imgs: [],
        provId: "",
        cityId: "",
        areaId: "",
        showPickerView: !1,
        value: [ 0, 0, 0 ],
        tempValue: [ 0, 0, 0 ],
        provArr: i.result,
        cityArr: i.result[0].city,
        areaArr: i.result[0].city[0].area,
        addressName: "请选择",
        start: "",
        loveApartment: !1,
        end: "",
        apply_end: "",
        foundChecked: "1",
        latitude: "",
        longitude: "",
        markers: "",
        scale: 14,
        address: "",
        isSubmitHome: !1,
        imageWidth: "",
        user: "",
        showRoomArr: [ 1 ],
        label: "",
        focus: !1,
        theme: [ {
            id: 0,
            name: ""
        }, {
            id: 1,
            name: "小森林"
        }, {
            id: 2,
            name: "萌萌哒"
        }, {
            id: 3,
            name: " 智能家"
        }, {
            id: 4,
            name: "舌尖味"
        }, {
            id: 5,
            name: "学院风"
        }, {
            id: 6,
            name: " 健身派"
        }, {
            id: 7,
            name: " 影视人"
        }, {
            id: 8,
            name: "音乐人"
        }, {
            id: 9,
            name: "loft"
        }, {
            id: 10,
            name: "欢乐颂"
        } ]
    },
    onLoad: function(e) {
        var t = this, i = wx.getStorageSync("uid"), s = e.id;
        console.log(i, s), wx.getLocation({
            type: "wgs84",
            success: function(e) {
                var a = e.latitude, i = e.longitude;
                e.speed, e.accuracy;
                t.setData({
                    longitude: i,
                    latitude: a
                });
            }
        }), wx.getSystemInfo({
            success: function(e) {
                var a = e.windowHeight / 5 - 10;
                t.setData({
                    uid: i,
                    imageWidth: a
                });
            }
        }), a.myhomeDetail({
            id: s,
            uid: i
        }, function(e) {
            var a = [], i = e.data.charm_imgs;
            if (i) for (var s in i) 4 == i[s].type && a.push(i[s].id);
            t.setData({
                items: e.data,
                label: e.data.label,
                idea_imgs: e.data.charm_imgs,
                idea_imgs_ids: a
            });
        });
    },
    bindinput1: function(e) {
        var a = this.data.items;
        a.name = e.detail.value;
        var t = e.detail.value + "";
        this.setData({
            homename_length: t.length,
            items: a
        });
    },
    selectTheme: function(e) {
        var a = e.currentTarget.dataset.id, t = this.data.items;
        t.label = e.currentTarget.dataset.id, console.log(t.label), this.setData({
            label: a,
            items: t,
            loveApartment: !1
        });
    },
    bindinput2: function(e) {
        var a = this.data.items;
        a.declaration = e.detail.value;
        var t = e.detail.value + "";
        this.setData({
            declaration_length: t.length,
            items: a
        });
    },
    bindinput3: function(e) {
        var a = this.data.items;
        a.desc = e.detail.value;
        var t = e.detail.value + "";
        this.setData({
            desc_length: t.length,
            items: a
        });
    },
    onShow: function() {
        var e = this, t = wx.getStorageSync("uid");
        t && "" != t ? (e.setData({
            uid: t
        }), e.data.user || a.getUser({
            uid: t
        }, function(i) {
            if (200 === i.code) {
                var s = i.data.score;
                if (e.setData({
                    user: i.data
                }), parseInt(s) < 251) return void a.alertView("提示", "魅力值不足251，请完善个人信息后再来", function() {
                    wx.navigateTo({
                        url: "/pages/User/MyHome/personaldata/personaldata?uid=" + t
                    });
                });
            }
        })) : wx.switchTab({
            url: "/pages/User/user"
        });
    },
    formSubmit: function(e) {
        var t = this, i = e.detail.value;
        if (console.log("charm_imgs_ids:", t.data.charm_imgs_ids), console.log("idea_imgs_ids:", t.data.idea_imgs_ids), 
        console.log("创爱家form发生了submit事件，携带数据为：", i), i.name) if (i.declaration) if (t.data.idea_imgs.length < 1) wx.showToast({
            title: "封面图片不能为空",
            icon: "none",
            duration: 1e3
        }); else if (i.desc) {
            var s = t.data.items, o = {
                id: s.id,
                desc: s.desc,
                declaration: s.declaration,
                name: s.name,
                label: s.label,
                idea_imgs_ids: t.data.idea_imgs_ids
            };
            console.log(o), a.addHome(o, function(e) {
                console.log("res:", e), 200 == e.code ? wx.showToast({
                    title: "修改成功",
                    icon: "none",
                    duration: 2e3,
                    success: function() {
                        wx.navigateTo({
                            url: "/pages/change/my/modifyHome/editSenHome/editSenHome?id=" + s.id
                        });
                    }
                }) : wx.showToast({
                    title: "修改失败",
                    icon: "none",
                    duration: 1e3
                });
            });
        } else wx.showToast({
            title: "描述不能为空",
            icon: "none",
            duration: 1e3
        }); else wx.showToast({
            title: "创家宣言不能为空",
            icon: "none",
            duration: 1e3
        }); else wx.showToast({
            title: "名字不能为空",
            icon: "none",
            duration: 1e3
        });
    },
    uploadImg: function(i) {
        var s = i.currentTarget.dataset.type;
        console.log("typeInt:", s);
        var o = this;
        if (4 == s && o.data.idea_imgs_ids.length >= 1) wx.showToast({
            title: "封面图最多只能传1张",
            icon: "none",
            duration: 1e3
        }); else {
            var n = 0;
            3 == s ? n = 1 - o.data.charm_imgs_ids.length : 4 == s && (n = 1 - o.data.idea_imgs_ids.length), 
            wx.chooseImage({
                count: n,
                sizeType: [ "original", "compressed" ],
                sourceType: [ "album", "camera" ],
                success: function(i) {
                    for (var n = i.tempFilePaths, d = 0, r = n.length; d < r; d++) {
                        var l = o.data.charm_imgs_ids, c = o.data.charm_imgs, m = o.data.idea_imgs_ids, u = o.data.idea_imgs;
                        console.log(l), console.log("charm_imgs_ids", l), console.log("charm_imgs", c), 
                        console.log("idea_imgs_ids", m), console.log("idea_imgs", u), wx.uploadFile({
                            url: t.constans.domain + "/common/upload",
                            filePath: n[d],
                            name: "file",
                            formData: e({
                                uid: o.data.uid,
                                rel_id: 0,
                                type: s,
                                cover: 1
                            }, "rel_id", o.data.items.id),
                            success: function(e) {
                                console.log("upload res:" + e);
                                try {
                                    var t = JSON.parse(e.data);
                                    if (200 == t.code) {
                                        var i = t.data[0];
                                        if (i.from_user_info = !1, 4 == s) {
                                            console.log("type4原图数量", u), u.push(i), m.push(i.id);
                                            var n = o.data.cover_id || i.id;
                                            o.setData({
                                                idea_imgs: u,
                                                idea_imgs_ids: m,
                                                cover_id: n
                                            });
                                        }
                                    } else a.alertShow(o, "cancel", "上传失败");
                                } catch (e) {
                                    console.log(e), a.alertShow(o, "cancel", "啊哦，上传失败了");
                                }
                            }
                        });
                    }
                }
            });
        }
    },
    previewImg: function(e) {
        if (!(this.endTime - this.startTime > 350)) {
            var a = e.currentTarget.dataset.idx, t = e.currentTarget.dataset.type, i = this, s = [];
            3 == t ? i.data.charm_imgs.map(function(e) {
                s.push(e.url);
            }) : 4 == t && i.data.idea_imgs.map(function(e) {
                s.push(e.url);
            }), wx.previewImage({
                current: s[a],
                urls: s
            });
        }
    },
    bindTouchStart: function(e) {
        this.startTime = e.timeStamp;
    },
    bindTouchEnd: function(e) {
        this.endTime = e.timeStamp;
    },
    handelDeleteImgCallBack: function(e, t, i, s) {
        a.alertShow(e, "success", "删除成功");
        var o = e.data.cover_id;
        if (s == e.data.cover_id && (o = ""), 4 == i) {
            var n = e.data.idea_imgs, d = (n.splice(t, 1), e.data.idea_imgs_ids), r = d.indexOf(s);
            r > -1 && d.splice(r, 1), e.setData({
                idea_imgs: n,
                idea_imgs_ids: d,
                cover_id: o
            });
        }
    },
    deleteImg: function(e) {
        var t = this, i = e.currentTarget.dataset.id, s = e.currentTarget.dataset.idx;
        console.log("idx", s);
        var o = e.currentTarget.dataset.type, n = e.currentTarget.dataset.fromuserinfo;
        wx.showModal({
            title: "提示",
            content: "你确定要删除吗?",
            success: function(e) {
                if (e.confirm) {
                    console.log("用户点击删除");
                    var d = {
                        id: i
                    };
                    n ? t.handelDeleteImgCallBack(t, s, o, i) : a.imgDel(d, function(e) {
                        200 == e.code ? t.handelDeleteImgCallBack(t, s, o, i) : a.alertShow(t, "cancel", "删除失败");
                    });
                }
            }
        });
    },
    select: function() {
        this.setData({
            loveApartment: !0
        });
    },
    cancel: function() {
        this.setData({
            loveApartment: !1
        });
    }
});