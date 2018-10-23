var t = require("../../../../../common/httpUtil.js"), o = require("../../../../../common/common.js");

Page({
    data: {
        uid: "",
        introduction_length: 0,
        roomnum: "",
        curlength: "0",
        rooms: [],
      room_imgs: [
        [],
        [],
        [],
        [],
        [],
      ],
    },
    addShowRoom: function(t) {
        var o = this, e = o.data.rooms;
        e.length >= 5 ? wx.showToast({
            title: "最多只能增加5个房间",
            icon: "none",
            duration: 1e3
        }) : (e.push({
            room_name: "",
            home_id: o.data.items.id,
            room_price: "",
            room_area: "",
            room_mark: "",
            imgs: [],
            status: 1
        }), this.setData({
            rooms: e
        }));
    },
    onLoad: function(o) {
        var e = wx.getStorageSync("uid"), a = this;
        wx.getSystemInfo({
            success: function(t) {
                var o = t.windowHeight / 5 - 10;
                a.setData({
                    uid: e,
                    imageWidth: o
                });
            }
        });
        var r = o.id;
        t.myhomeDetail({
            id: r,
            uid: e
        }, function(t) {
            a.setData({
                items: t.data,
                rooms: t.data.rooms
            });
        });
    },
    input_event: function(t) {
        var o = this, e = t.currentTarget.dataset.type;
        e = parseInt(e);
        var a = t.currentTarget.dataset.idx, r = o.data.rooms[a];
        switch (e) {
          case 1:
            r.room_name = t.detail.value;
            break;

          case 2:
            r.room_mark = t.detail.value;
            break;

          case 3:
            r.room_area = t.detail.value;
            break;

          case 4:
            r.room_price = t.detail.value;
        }
        var i = o.data.rooms;
        i[a] = r, this.setData({
            introduction_length: t.detail.value.length,
            rooms: i
        });
    },
    onShow: function() {
        var t = this, o = wx.getStorageSync("uid");
        o && "" != o ? t.setData({
            uid: o
        }) : wx.switchTab({
            url: "/pages/User/user"
        });
    },
    uploadImg: function(e) {
        var a = e.currentTarget.dataset.roomnum;
        //console.log("typeInt:", typeInt);
        var r = this,
        room = r.data.rooms[a],//某个房间数据
        room_imgs = r.data.rooms[a].imgs, //某个房间的图片列表
        n = r.data.rooms[a].imgs.length;
        console.log(n), 
        r.setData({
            curlength: n
        }), n >= 3 ? wx.showToast({
            title: "空间图片最多只能传3张",
            icon: "none",
            duration: 1e3
        }) : wx.chooseImage({
            count: 3 - n,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(e) {
                for (var n = e.tempFilePaths, m = 0, d = n.length; m < d; m++) {
                    //var c = r.data.rooms[a].imgs;
                    wx.uploadFile({
                        url: o.constans.domain + "/common/upload",
                        filePath: n[m],
                        name: "file",
                        formData: {
                            uid: r.data.uid,
                            rel_id: r.data.items.id,
                            type: 7
                        },
                        success: function(o) {
                            console.log("upload res:" + o);
                            try {
                                var e = JSON.parse(o.data);
                                if (200 == e.code) {
                                    var data = e.data[0]; //图片对象
                                    console.log("img:" + data);
                                    room_imgs.push(data.url), //添加一个图片到列表中
                                    room.imgs = room_imgs;
                                    var rooms = r.data.rooms;
                                    rooms[a] = room
                                    r.setData({
                                      rooms: rooms
                                    });
                                } else t.alertShow(r, "cancel", "上传失败");
                            } catch (o) {
                                console.log(o), t.alertShow(r, "cancel", "啊哦，上传失败了");
                            }
                        }
                    });
                }
            }
        });
    },
    previewImg: function(t) {
        if (!(this.endTime - this.startTime > 350)) {
            var o = t.currentTarget.dataset.idx, e = t.currentTarget.dataset.id, a = this.data.rooms[e].imgs;
            wx.previewImage({
                current: a[o],
                urls: a
            });
        }
    },
    deleteImg: function(o) {
        console.log(o);
        var e = this, a = o.currentTarget.dataset.roomnum, r = o.currentTarget.dataset.idx, i = e.data.rooms[a], s = i.imgs, n = e.data.rooms;
        wx.showModal({
            title: "提示",
            content: "你确定要删除吗?",
            success: function(o) {
                o.confirm && (console.log("用户点击删除"), s.splice(r, 1), i.imgs = s, n[a] = i, e.setData({
                    rooms: n
                }), t.alertShow(e, "success", "删除成功"));
            }
        });
    },
    setCover: function(o) {
        var e = this, a = o.currentTarget.dataset.id, r = (o.currentTarget.dataset.idx, 
        o.currentTarget.dataset.type);
        if (console.log(a), e.setData({
            cover_id: a
        }), 7 == r) {
            var i = e.data.idea_imgs;
            i.map(function(t) {
                t.id == a ? t.selected = !0 : t.selected = !1;
            }), e.setData({
                imageWidth: parseInt(e.data.imageWidth) - 1,
                idea_imgs: i
            });
        }
        t.alertShow(e, "success", "设置成功");
    },
    formSubmit: function(o) {
        for (var e = this, a = (o.detail.value, e.data.rooms), r = [], i = 0; i < a.length; i++) {
            var s = a[i];
            if (s.imgs.length < 1) return void wx.showToast({
                title: "请至少上传一张图片",
                icon: "none",
                duration: 1e3
            });
            if (1 == s.status) {
                if (!s.room_price) return void wx.showToast({
                    title: "请填写价格",
                    icon: "none",
                    duration: 1e3
                });
                if (!s.room_area) return void wx.showToast({
                    title: "请填写面积",
                    icon: "none",
                    duration: 1e3
                });
            }
            if (!s.room_name) return void wx.showToast({
                title: "请填写房间名称",
                icon: "none",
                duration: 1e3
            });
            if (!s.room_mark) return void wx.showToast({
                title: "请填写房间创想设计",
                icon: "none",
                duration: 1e3
            });
            r.push({
                roomName: s.room_name,
                homeId: e.data.items.id,
                roomPrice: s.room_price,
                roomArea: s.room_area,
                roomMark: s.room_mark,
                img1: s.imgs[0],
                img2: s.imgs[1],
                img3: s.imgs[2],
                status: s.status,
                id: s.id
            });
        }
        var n = e.data.items, m = {};
        m.id = n.id, m.rooms = JSON.stringify(r), console.log("editThrHome:", m), t.addHome(m, function(t) {
            console.log("res:", t), 200 == t.code ? wx.showToast({
                title: "修改成功",
                icon: "none",
                duration: 2e3,
                success: function() {
                    wx.navigateTo({
                        url: "/pages/change/my/modifyHome/editFourthHome/editFourthHome?id=" + n.id
                    });
                }
            }) : wx.showToast({
                title: "修改失败",
                icon: "none",
                duration: 1e3
            });
        });
    },
    switch1Change: function(t) {
        var o = this, e = Number(t.detail.value), a = t.currentTarget.dataset.index;
        console.log("checked:" + e);
        var r = o.data.rooms;
        r[a].status = e, o.setData({
            rooms: r
        });
    }
});