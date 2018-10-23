var e = require("../../../../../common/httpUtil.js");

require("../../../../../common/common.js");

Page({
    data: {
        uid: "",
        addressName: "请选择",
        foundChecked: "1",
        latitude: "",
        longitude: "",
        markers: "",
        scale: 14,
        address: "",
        isSubmitHome: !1,
        user: "",
        found: ""
    },
    foundChange: function(e) {
        console.log(e.detail.value), this.setData({
            foundChecked: e.detail.value
        });
    },
    onLoad: function(o) {
        var t = this, a = wx.getStorageSync("uid");
        if (a && "" != a) {
            t.setData({
                uid: a
            });
            var d = o.id;
            e.myhomeDetail({
                id: d,
                uid: a
            }, function(e) {
                t.setData({
                    items: e.data,
                    foundChecked: e.data.found,
                    address: e.data.address
                });
            });
        } else wx.switchTab({
            url: "/pages/User/user"
        });
    },
    formSubmit: function(o) {
        var t = this, a = o.detail.value;
        if (console.log("charm_imgs_ids:", t.data.charm_imgs_ids), console.log("idea_imgs_ids:", t.data.idea_imgs_ids), 
        console.log("创爱家form发生了submit事件，携带数据为：", a), a.avgprice) if (a.total_price) {
            var d = t.data.items, i = o.detail.value;
            i.id = d.id, i.found = t.data.foundChecked, i.address = t.data.address || d.address, 
            i.latitude = t.data.latitude || d.latitude, i.longitude = t.data.longitude || d.longitude, 
            console.log("editSenHome:", i), e.addHome(i, function(e) {
                console.log("res:", e), 200 == e.code ? wx.showToast({
                    title: "修改成功",
                    icon: "none",
                    duration: 2e3,
                    success: function() {
                        wx.navigateTo({
                            url: "/pages/change/my/modifyHome/editThrHome/editThrHome?id=" + d.id
                        });
                    }
                }) : wx.showToast({
                    title: "修改失败",
                    icon: "none",
                    duration: 1e3
                });
            });
        } else wx.showToast({
            title: "总价不能为空",
            icon: "none",
            duration: 1e3
        }); else wx.showToast({
            title: "均价不能为空",
            icon: "none",
            duration: 1e3
        });
    },
    chooseMap: function() {
        var e = this;
        wx.chooseLocation({
            success: function(o) {
                console.log("name", o.name), console.log("address", o.address), console.log("latitude", o.latitude), 
                console.log("longitude", o.longitude);
                var t = wx.getStorageSync("homeDetail");
                t.address = o.address, t.latitude = o.latitude, t.longitude = o.longitude, wx.setStorageSync("homeDetail", t), 
                e.setData({
                    longitude: o.longitude,
                    latitude: o.latitude,
                    address: o.address,
                    scale: 16,
                    markers: [ {
                        id: 1,
                        latitude: o.latitude,
                        longitude: o.longitude,
                        callout: {
                            content: "房屋位置",
                            color: "#FFFFFF",
                            fontSize: 14,
                            borderRadius: 5,
                            bgColor: "#82C435",
                            padding: 5,
                            display: "ALWAYS"
                        },
                        anchor: {
                            x: 1,
                            y: 1
                        }
                    } ]
                });
            }
        });
    }
});