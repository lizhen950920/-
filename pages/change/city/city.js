// pages/change/city/city.js
Page({
  data: {
    //下面是字母排序
    letter: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    cityListId: '',
    //下面是城市列表信息，这里只是模拟数据
    citylist: [{
      "letter": "A", "data": [
        {
          "name": "阿坝",
          "key": "A",
          "id": 513231,
        },
        {
          "id": 152921,
          "name": "阿拉善左旗",
          "key": "A"
        },
        {
          "id": 542500,
          "name": "阿里地区",
          "key": "A"
        },
        {
          "id": 610900,
          "name": "安康市",
          "key": "A"
        },
        {
          "id": 340800,
          "name": "安庆市",
          "key": "A"
        },

        {
          "id": 210300,
          "name": "鞍山市",
          "key": "A"
        }
        ,
        {
          "id": 520400,
          "name": "安顺市",
          "key": "A"
        }
        ,
        {
          "id": 410522,
          "name": "安阳县",
          "key": "A"
        }
        ,
        ]
    }, {
      "letter": "B", "data": [
        {
          "id": 110000,
          "name": "北京市",
          "key": "B"
        },
        {
          "id": 620400,
          "name": "白银市",
          "key": "B"
        },
        {
          "id": 130600,
          "name": "保定市",
          "key": "B"
        },
        {
          "id": 610300,
          "name": "宝鸡市",
          "key": "B"
        },
        {
          "id": 530500,
          "name": "保山市",
          "key": "B"
        },
        {
          "id": 150200,
          "name": "包头市",
          "key": "B"
        },
        {
          "id": 511900,
          "name": "巴中市",
          "key": "B"
        }
        ,
        {
          "id": 450500,
          "name": "北海市",
          "key": "B"
        }
        ,
        {
          "id": 340300,
          "name": "蚌埠市",
          "key": "B"
        }
        ,
        {
          "id": 210500,
          "name": "本溪市",
          "key": "B"
        }
        ,
        {
          "id": 522400,
          "name": "毕节市",
          "key": "B"
        }
        ,
        {
          "id": 371600,
          "name": "滨州市",
          "key": "B"
        }
        ,
        {
          "id": 451000,
          "name": "百色市",
          "key": "B"
        }
        ,
        {
          "id": 341600,
          "name": "亳州市",
          "key": "B"
        }
      ]
    }, {
      "letter": "C", "data": [
        {
          "id": 500000,
          "name": "重庆市",
          "key": "C"
        },
        {
          "id": 510100,
          "name": "成都市",
          "key": "C"
        },
        {
          "id": 430121,
          "name": "长沙县",
          "key": "C"
        },
        {
          "id": 220100,
          "name": "长春市",
          "key": "C"
        },
        {
          "id": 130900,
          "name": "沧州市",
          "key": "C"
        },
        {
          "id": 430700,
          "name": "常德市",
          "key": "C"
        },
        {
          "id": 542121,
          "name": "昌都县",
          "key": "C"
        }
        ,
        {
          "id": 140421,
          "name": "长治县",
          "key": "C"
        }
        ,
        {
          "id": 320400,
          "name": "常州市",
          "key": "C"
        }
        ,
        {
          "id": 340181,
          "name": "巢湖市",
          "key": "C"
        }
        ,
        {
          "id": 445100,
          "name": "潮州市",
          "key": "C"
        }
        ,
        {
          "id": 130821,
          "name": "承德县",
          "key": "C"
        }
        ,
        {
          "id": 431000,
          "name": "郴州市",
          "key": "C"
        }
        ,
        {
          "id": 150400,
          "name": "赤峰市",
          "key": "C"
        }
        ,
        {
          "id": 341700,
          "name": "池州市",
          "key": "C"
        }
        ,
        {
          "id": 451400,
          "name": "崇左市",
          "key": "C"
        }
        ,
        {
          "id": 532301,
          "name": "楚雄市",
          "key": "C"
        }
        ,
        {
          "id": 341100,
          "name": "滁州市",
          "key": "C"
        }
        ,
        {
          "id": 110500,
          "name": "朝阳区",
          "key": "C"
        }
      ]
    }, {
      "letter": "D", "data": [
        {
          "id": 210200,
          "name": "大连市",
          "key": "D"
        },
        {
          "id": 441900,
          "name": "东莞市",
          "key": "D"
        },
        {
          "id": 532901,
          "name": "大理市",
          "key": "D"
        },
        {
          "id": 210600,
          "name": "丹东市",
          "key": "D"
        },
        {
          "id": 230600,
          "name": "大庆市",
          "key": "D"
        },
        {
          "id": 140227,
          "name": "大同县",
          "key": "D"
        },
        {
          "id": 232700,
          "name": "大兴安岭地区",
          "key": "D"
        }
        ,
        {
          "id": 533100,
          "name": "德宏傣族景颇族自治州",
          "key": "D"
        }
        ,
        {
          "id": 510600,
          "name": "德阳市",
          "key": "D"
        }
        ,
        {
          "id": 371400,
          "name": "德州市",
          "key": "D"
        }
        ,
        {
          "id": 621100,
          "name": "定西市",
          "key": "D"
        }
        ,
        {
          "id": 533400,
          "name": "迪庆藏族自治州",
          "key": "D"
        }
        ,
        {
          "id": 370500,
          "name": "东营市",
          "key": "D"
        }

      ]
    }, {
      "letter": "E", "data":
      [
        {
          "id": 150600,
          "name": "鄂尔多斯市",
          "key": "E"
        }
        ,
        {
          "id": 422801,
          "name": "恩施市",
          "key": "E"
        }
        ,
        {
          "id": 420700,
          "name": "鄂州市",
          "key": "E"
        }
      ]
    }, {
      "letter": "F", "data": [
        {
          "id": 350100,
          "name": "福州市",
          "key": "F"
        }
        ,
        {
          "id": 450600,
          "name": "防城港市",
          "key": "F"
        }
        ,
        {
          "id": 440600,
          "name": "佛山市",
          "key": "F"
        }
        ,
        {
          "id": 210421,
          "name": "抚顺县",
          "key": "F"
        }
        ,
        {
          "id": 361000,
          "name": "抚州市",
          "key": "F"
        }
        ,
        {
          "id": 210921,
          "name": "阜新蒙古族自治县",
          "key": "F"
        }
        ,
        {
          "id": 341200,
          "name": "阜阳市",
          "key": "F"
        }
      ]
    }, {
      "letter": "G", "data": [
        {
          "id": 440100,
          "name": "广州市",
          "key": "G"
        },
        {
          "id": 360700,
          "name": "赣州市",
          "key": "G"
        },
        {
          "id": 450300,
          "name": "桂林市",
          "key": "G"
        },
        {
          "id": 520100,
          "name": "贵阳市",
          "key": "G"
        },
        {
          "id": 623000,
          "name": "甘南藏族自治州",
          "key": "G"
        },

        {
          "id": 513328,
          "name": "甘孜县",
          "key": "G"
        },
        {
          "id": 511682,
          "name": "广安区",
          "key": "G"
        }
        ,
        {
          "id": 510800,
          "name": "广元市",
          "key": "G"
        }
        ,
        {
          "id": 632600,
         "name": "果洛藏族自治州",
          "key": "G"
        }
        ,
        {
          "id": 450800,
          "name": "贵港市",
          "key": "G"
        }

      ]
    }, {
      "letter": "H", "data": [
        {
          "id": 330100,
          "name": "杭州市",
          "key": "H"
        },
        {
          "id": 230100,
          "name": "哈尔滨市",
          "key": "H"
        },
        {
          "id": 340100,
          "name": "合肥市",
          "key": "H"
        },
        {
          "id": 460100,
          "name": "海口市",
          "key": "H"
        },
        {
          "id": 632100,
          "name": "海东市",
          "key": "H"
        },
        {
          "id": 632200,
          "name": "海北藏族自治州",
          "key": "H"
        },
        {
          "id": 632500,
          "name": "海南藏族自治州",
          "key": "H"
        }
        ,
        {
          "id": 632800,
          "name": "海西蒙古族藏族自治州",
          "key": "H"
        }
        ,
        {
          "id": 130421,
          "name": "邯郸县",
          "key": "H"
        }

        ,
        {
          "id": 610700,
          "name": "汉中市",
          "key": "H"
        }
        ,
        {
          "id": 410600,
          "name": "鹤壁市",
          "key": "H"
        }
        ,
        {
          "id": 451200,
          "name": "河池市",
          "key": "H"
        }
        ,
        {
          "id": 230400,
          "name": "鹤岗市",
          "key": "H"
        }
        ,
        {
          "id": 231100,
          "name": "黑河市",
          "key": "H"
        }
        ,
        {
          "id": 131100,
          "name": "衡水市",
          "key": "H"
        }
        ,
        {
          "id": 430421,
          "name": "衡阳县",
          "key": "H"
        }

        ,
        {
          "id": 441600,
          "name": "河源市",
          "key": "H"
        }
        ,
        {
          "id": 451100,
          "name": "贺州市",
          "key": "H"
        }
        ,
        {
          "id": 532529,
          "name": "红河县",
          "key": "H"
        }
        ,
        {
          "id": 320800,
          "name": "淮安市",
          "key": "H"
        }
        ,
        {
          "id": 340600,
          "name": "淮北市",
          "key": "H"
        }
        ,
        {
          "id": 431200,
          "name": "怀化市",
          "key": "H"
        }
        ,
        {
          "id": 340400,
          "name": "淮南市",
          "key": "H"
        }
        ,

        {
          "id": 421100,
          "name": "黄冈市",
          "key": "H"
        }
        ,
        {
          "id": 632300,
          "name": "黄南藏族自治州",
          "key": "H"
        }
        ,
        {
          "id": 341001,
          "name": "黄山区",
          "key": "H"
        },
        {
          "id": 420200,
          "name": "黄石市",
          "key": "H"
        },
        {
          "id": 441300,
          "name": "惠州市",
          "key": "H"
        },
        {
          "id": 211400,
          "name": "葫芦岛市",
          "key": "H"
        },
        {
          "id": 150700,
          "name": "呼伦贝尔市",
          "key": "H"
        },
        {
          "id": 330500,
          "name": "湖州市",
          "key": "H"
        }
        ,
        {
          "id": 371700,
          "name": "菏泽市",
          "key": "H"
        }

      ]
    }, {
      "letter": "J", "data":
      [

        {
          "id": 370100,
          "name": "济南市",
          "key": "J"
        },
        {
          "id": 230800,
          "name": "佳木斯市",
          "key": "J"
        },
        {
          "id": 360821,
          "name": "吉安县",
          "key": "J"
        },
        {
          "id": 440700,
          "name": "江门市",
          "key": "J"
        },
        {
          "id": 410800,
          "name": "焦作市",
          "key": "J"
        },
        {
          "id": 330400,
          "name": "嘉兴市",
          "key": "J"
        },
        {
          "id": 620200,
          "name": "嘉峪关市",
          "key": "J"
        }
        ,
        {
          "id": 445200,
          "name": "揭阳市",
          "key": "J"
        }
        ,

        {
          "id": 220200,
          "name": "吉林市",
          "key": "J"
        }
        ,
        {
          "id": 620300,
          "name": "金昌市",
          "key": "J"
        }
        ,
        {
          "id": 140500,
          "name": "晋城市",
          "key": "J"
        }
        ,
        {
          "id": 360200,
          "name": "景德镇市",
          "key": "J"
        }
        ,
        {
          "id": 420800,
          "name": "荆门市",
          "key": "J"
        }
        ,
        {
          "id": 421000,
          "name": "荆州市",
          "key": "J"
        }
        ,
        {
          "id": 330700,
          "name": "金华市",
          "key": "J"
        }

        ,
        {
          "id": 370800,
          "name": "济宁市",
          "key": "J"
        }
        ,
        {
          "id": 140700,
          "name": "晋中市",
          "key": "J"
        }
        ,
        {
          "id": 210700,
          "name": "锦州市",
          "key": "J"
        }
        ,
        {
          "id": 360421,
          "name": "九江县",
          "key": "J"
        }
        ,
        {
          "id": 620900,
          "name": "酒泉市",
          "key": "J"
        }
      ]
    }, {
      "letter": "K", "data": [
        {
          "id": 530100,
          "name": "昆明市",
          "key": "K"

        }
        ,
        {

          "id": 410224,
          "name": "开封县",
          "key": "K"
        }
      ]
    }, {
      "letter": "L", "data": [
        {
          "id": 620100,
          "name": "兰州市",
          "key": "L"
        },
        {
          "id": 540100,
          "name": "拉萨市",
          "key": "L"
        },
        {
          "id": 451300,
          "name": "来宾市",
          "key": "L"
        },
        {
          "id": 371200,
          "name": "莱芜市",
          "key": "L"
        },
        {
          "id": 131000,
          "name": "廊坊市",
          "key": "L"
        },
        {
          "id": 511100,
          "name": "乐山市",
          "key": "L"
        },
        {
          "name": "凉山",
          "key": "L"
        }
        ,
        {
          "name": "连云港",
          "key": "L"
        }

        ,
        {
          "name": "聊城",
          "key": "L"
        }

        ,
        {
          "name": "辽阳",
          "key": "L"
        }
        ,
        {
          "name": "辽源",
          "key": "L"
        }
        ,
        {
          "name": "丽江",
          "key": "L"
        }
        ,
        {
          "name": "临沧",
          "key": "L"
        }
        ,
        {
          "name": "临汾",
          "key": "L"
        }
        ,
        {
          "name": "临夏",
          "key": "L"
        }
        ,

        {
          "name": "临沂",
          "key": "L"
        }

        ,
        {
          "name": "林芝",
          "key": "L"
        }
        ,
        {
          "name": "丽水",
          "key": "L"
        }
        ,
        {
          "name": "六安",
          "key": "L"
        }
        ,
        {
          "name": "六盘水",
          "key": "L"
        }
        ,
        {
          "name": "柳州",
          "key": "L"
        }
        ,
        {
          "name": "陇南",
          "key": "L"
        }
        ,

        {
          "name": "龙岩",
          "key": "L"
        }
        ,

        {
          "name": "娄底",
          "key": "L"
        }
        ,
        {
          "name": "漯河",
          "key": "L"
        }
        ,
        {
          "name": "洛阳",
          "key": "L"
        },
        {
          "name": "泸州",
          "key": "L"
        },
        {
          "name": "吕梁",
          "key": "L"
        }

      ]
    }, {
      "letter": "M", "data": [
        {
          "name": "马鞍山",
          "key": "M"
        }
        ,
        {
          "name": "茂名",
          "key": "M"
        }
        ,
        {
          "name": "眉山",
          "key": "M"
        }
        ,
        {
          "name": "梅州",
          "key": "M"
        }
        ,
        {
          "name": "绵阳",
          "key": "M"
        }
        ,
        {
          "name": "牡丹江",
          "key": "M"
        }

      ]
    }, {
      "letter": "N", "data": [

        {
          "name": "南京",
          "key": "N"
        },
        {
          "name": "南昌",
          "key": "N"
        },
        {
          "name": "南宁",
          "key": "N"
        },
        {
          "name": "南充",
          "key": "N"
        },
        {
          "name": "南平",
          "key": "N"
        },
        {
          "name": "南通",
          "key": "N"
        },
        {
          "name": "南阳",
          "key": "N"
        }
        ,
        {
          "name": "那曲",
          "key": "N"
        }

        ,
        {
          "name": "内江",
          "key": "N"
        }
        ,
        {
          "name": "宁德",
          "key": "N"
        }
        ,
        {
          "name": "怒江",
          "key": "N"
        }


      ]
    }, {
      "letter": "P", "data":
      [

        {
          "name": "盘锦",
          "key": "P"
        }
        ,
        {
          "name": "攀枝花",
          "key": "P"
        }
        ,
        {
          "name": "平顶山",
          "key": "P"
        }
        ,
        {
          "name": "平凉",
          "key": "P"
        }
        ,
        {
          "name": "萍乡",
          "key": "P"
        }
        ,
        {
          "name": "莆田",
          "key": "P"
        }
        ,
        {
          "name": "濮阳",
          "key": "P"
        }

      ]
    }, {
      "letter": "Q", "data": [

        {
          "name": "青岛",
          "key": "Q"
        },
        {
          "name": "黔东南",
          "key": "Q"
        },
        {
          "name": "黔南",
          "key": "Q"
        },
        {
          "name": "黔西南",
          "key": "Q"
        },
        {
          "name": "庆阳",
          "key": "Q"
        },
        {
          "name": "清远",
          "key": "Q"
        },
        {
          "name": "秦皇岛",
          "key": "Q"
        }
        ,
        {
          "name": "钦州",
          "key": "Q"
        }
        ,
        {
          "name": "齐齐哈尔",
          "key": "Q"
        }
        ,
        {
          "name": "泉州",
          "key": "Q"
        }
        ,
        {
          "name": "曲靖",
          "key": "Q"
        }
        ,
        {
          "name": "衢州",
          "key": "Q"
        }


      ]
    }, {
      "letter": "R", "data":
      [
        {
          "name": "日喀则",
          "key": "R"
        },
        {
          "name": "日照",
          "key": "R"
        }
      ]
    }, {
      "letter": "T", "data": [
        {
          "name": "上海",
          "key": "S"
        },
        {
          "name": "深圳",
          "key": "S"
        },
        {
          "name": "苏州",
          "key": "S"
        },
        {
          "name": "沈阳",
          "key": "S"
        },
        {
          "name": "石家庄",
          "key": "S"
        },
        {
          "name": "三门峡",
          "key": "S"
        },
        {
          "name": "三明",
          "key": "S"
        }
        ,
        {
          "name": "三亚",
          "key": "S"
        }

        ,
        {
          "name": "商洛",
          "key": "S"
        }

        ,
        {
          "name": "商丘",
          "key": "S"
        }
        ,
        {
          "name": "上饶",
          "key": "S"
        }
        ,
        {
          "name": "山南",
          "key": "S"
        }
        ,
        {
          "name": "汕头",
          "key": "S"
        }
        ,
        {
          "name": "汕尾",
          "key": "S"
        }
        ,
        {
          "name": "韶关",
          "key": "S"
        }
        ,

        {
          "name": "绍兴",
          "key": "S"
        }

        ,
        {
          "name": "邵阳",
          "key": "S"
        }
        ,
        {
          "name": "十堰",
          "key": "S"
        }
        ,
        {
          "name": "朔州",
          "key": "S"
        }
        ,
        {
          "name": "四平",
          "key": "S"
        }
        ,
        {
          "name": "绥化",
          "key": "S"
        }
        ,
        {
          "name": "遂宁",
          "key": "S"
        }
        ,

        {
          "name": "随州",
          "key": "S"
        }
        ,

        {
          "name": "娄底",
          "key": "S"
        }
        ,
        {
          "name": "宿迁",
          "key": "S"
        }
        ,
        {
          "name": "宿州",
          "key": "S"
        }

      ]
    }, {
      "letter": "T", "data": [

        {
          "name": "天津",
          "key": "T"
        },
        {
          "name": "太原",
          "key": "T"
        },
        {
          "name": "泰安",
          "key": "T"
        },
        {
          "name": "泰州",
          "key": "T"
        },
        {
          "name": "唐山",
          "key": "T"
        },
        {
          "name": "天水",
          "key": "T"
        },
        {
          "name": "铁岭",
          "key": "T"
        }
        ,
        {
          "name": "铜川",
          "key": "T"
        }
        ,

        {
          "name": "通化",
          "key": "T"
        }
        ,
        {
          "name": "通辽",
          "key": "T"
        }
        ,
        {
          "name": "铜陵",
          "key": "T"
        }
        ,
        {
          "name": "铜仁",
          "key": "T"
        }
        ,
        {
          "name": "台湾",
          "key": "T"
        }


      ]
    }, {
      "letter": "W", "data": [

        {
          "name": "武汉",
          "key": "W"
        },
        {
          "name": "乌鲁木齐",
          "key": "W"
        },
        {
          "name": "无锡",
          "key": "W"
        },
        {
          "name": "威海",
          "key": "W"
        },
        {
          "name": "潍坊",
          "key": "W"
        },
        {
          "name": "文山",
          "key": "W"
        },
        {
          "name": "温州",
          "key": "W"
        }
        ,
        {
          "name": "乌海",
          "key": "W"
        }
        ,

        {
          "name": "芜湖",
          "key": "W"
        }
        ,
        {
          "name": "乌兰察布",
          "key": "W"
        }
        ,
        {
          "name": "武威",
          "key": "W"
        }
        ,
        {
          "name": "梧州",
          "key": "W"
        }

      ]
    }, {
      "letter": "X", "data": [

        {
          "name": "厦门",
          "key": "X"
        },
        {
          "name": "西安",
          "key": "X"
        },
        {
          "name": "西宁",
          "key": "X"
        },
        {
          "name": "襄樊",
          "key": "X"
        },
        {
          "name": "湘潭",
          "key": "X"
        },
        {
          "name": "湘西",
          "key": "X"
        },
        {
          "name": "咸宁",
          "key": "X"
        }
        ,
        {
          "name": "咸阳",
          "key": "X"
        }
        ,

        {
          "name": "孝感",
          "key": "X"
        }
        ,
        {
          "name": "邢台",
          "key": "X"
        }
        ,
        {
          "name": "新乡",
          "key": "X"
        }
        ,
        {
          "name": "信阳",
          "key": "X"
        }
        ,
        {
          "name": "新余",
          "key": "X"
        }
        ,
        {
          "name": "忻州",
          "key": "X"
        }
        ,
        {
          "name": "西双版纳",
          "key": "X"
        }

        ,
        {
          "name": "宣城",
          "key": "X"
        }
        ,

        {
          "name": "许昌",
          "key": "X"
        }
        ,
        {
          "name": "徐州",
          "key": "X"
        }
        ,
        {
          "name": "香港",
          "key": "X"
        }
        ,
        {
          "name": "锡林郭勒",
          "key": "X"
        }
        ,
        {
          "name": "兴安",
          "key": "X"
        }
      ]
    }, {
      "letter": "Y", "data":
      [

        {
          "name": "银川",
          "key": "Y"
        },
        {
          "name": "雅安",
          "key": "Y"
        },
        {
          "name": "延安",
          "key": "Y"
        },
        {
          "name": "延边",
          "key": "Y"
        },
        {
          "name": "盐城",
          "key": "Y"
        },
        {
          "name": "阳江",
          "key": "Y"
        },

        {
          "name": "阳泉",
          "key": "Y"
        }
        ,
        {
          "name": "扬州",
          "key": "Y"
        }
        ,

        {
          "name": "烟台",
          "key": "Y"
        }
        ,
        {
          "name": "宜宾",
          "key": "Y"
        }
        ,
        {
          "name": "宜昌",
          "key": "Y"
        }
        ,
        {
          "name": "宜春",
          "key": "Y"
        }
        ,
        {
          "name": "营口",
          "key": "Y"
        }
        ,

        {
          "name": "益阳",
          "key": "Y"
        }
        ,
        {
          "name": "永州",
          "key": "Y"
        }

        ,
        {
          "name": "岳阳",
          "key": "Y"
        }
        ,

        {
          "name": "榆林",
          "key": "Y"
        }
        ,
        {
          "name": "运城",
          "key": "Y"
        }
        ,
        {
          "name": "云浮",
          "key": "Y"
        }
        ,
        {
          "name": "玉树",
          "key": "Y"
        }
        ,
        {
          "name": "玉溪",
          "key": "Y"
        }
        ,
        {
          "name": "玉林",
          "key": "Y"
        }

      ]
    }, {
      "letter": "Z", "data": [
        {
          "name": "杂多县",
          "key": "Z"
        },
        {
          "name": "赞皇县",
          "key": "Z"
        },
        {
          "name": "枣强县",
          "key": "Z"
        },
        {
          "name": "枣阳市",
          "key": "Z"
        },
        {
          "name": "枣庄",
          "key": "Z"
        },
        {
          "name": "泽库县",
          "key": "Z"
        },
        {
          "name": "增城市",
          "key": "Z"
        }
        ,

        {
          "name": "曾都区",
          "key": "Z"
        }
        ,
        {
          "name": "泽普县",
          "key": "Z"
        }

        ,
        {
          "name": "泽州县",
          "key": "Z"
        }
        ,
        {
          "name": "札达县",
          "key": "Z"
        }
        ,
        {
          "name": "扎赉特旗",
          "key": "Z"
        }
        ,
        {
          "name": "扎兰屯市",
          "key": "Z"
        }
        ,
        {
          "name": "扎鲁特旗",
          "key": "Z"
        }
        ,

        {
          "name": "扎囊县",
          "key": "Z"
        }
        ,
        {
          "name": "张北县",
          "key": "Z"
        }

        ,
        {
          "name": "张店区",
          "key": "Z"
        }
        ,
        {
          "name": "章贡区",
          "key": "Z"
        }
        ,
        {
          "name": "张家港",
          "key": "Z"
        }
        ,
        {
          "name": "张家界",
          "key": "Z"
        }
        ,
        {
          "name": "张家口",
          "key": "Z"
        }
        ,
        {
          "name": "漳平市",
          "key": "Z"
        }
        ,

        {
          "name": "漳浦县",
          "key": "Z"
        }
        ,

        {
          "name": "章丘市",
          "key": "Z"
        }
        ,
        {
          "name": "樟树市",
          "key": "Z"
        }
        ,
        {
          "name": "张湾区",
          "key": "Z"
        },
        {
          "name": "彰武县",
          "key": "Z"
        },
        {
          "name": "漳县",
          "key": "Z"
        },
        {
          "name": "张掖",
          "key": "Z"
        },
        {
          "name": "漳州",
          "key": "Z"
        },
        {
          "name": "长子县",
          "key": "Z"
        }
        ,

        {
          "name": "湛河区",
          "key": "Z"
        }
        ,
        {
          "name": "湛江",
          "key": "Z"
        }
        ,

        {
          "name": "站前区",
          "key": "Z"
        }
        ,
        {
          "name": "沾益县",
          "key": "Z"
        }
        ,
        {
          "name": "诏安县",
          "key": "Z"
        },
        {
          "name": "召陵区",
          "key": "Z"
        },
        {
          "name": "昭平县",
          "key": "Z"
        },
        {
          "name": "肇庆",
          "key": "Z"
        },
        {
          "name": "昭通",
          "key": "Z"
        },
        {
          "name": "赵县",
          "key": "Z"
        }

      ]
    }],
    //下面是热门城市数据
    newcity: [
      {
        name: "北京市",
        checked: "false",
        id: 110100,
        type: 0,
      },
      {
        name: "天津市",
        checked: "false",
        id: 120100,
        type: 1,
      },
      {
        name: "上海市",
        checked: "false",
        id: 310100,
        type: 2,
      },
      {
        name: "南京市",
        checked: "false",
        id: 320100,
        type: 3,
      },
      {
        name: "杭州市",
        checked: "false",
        id: 330100,
        type: 4,
      },
      {
        name: "郑州市",
        checked: "false",
        id: 410100,
        type: 5,
      },
      {
        name: "武汉市",
        checked: "false",
        id: 420100,
        type: 6,
      },
      {
        name: "广州市",
        checked: "false",
        id: 440100,
        type: 7,
      },
      {
        name: "深圳市",
        checked: "false",
        id: 440300,
        type: 8,
      },
      {
        name: "重庆市",
        checked: "false",
        id: 500100,
        type: 9,
      },
      {
        name: "成都市",
        checked: "false",
        id: 510100,
        type: 10,
      },
      {
        name: "西安市",
        checked: "false",
        id: 610100,
        type: 11,
      }
    ],
    // citySel: '全国',
    locateCity: '',
    background: "white",
    color: "#333",
    type:'',
  },
  onLoad: function (options) {
//   var type=options.type;
// this.data({
//   type:type
// })
  
  },
  /**点击热门城市 */
  hot(e) {
    console.log(e)
     var that = this;
     var area = e.currentTarget.dataset.val.id;
     var city = e.currentTarget.dataset.val.name;
    var type = e.currentTarget.dataset.idx;
    if (that.data.newcity[type].checked == false) {
      that.data.newcity[type].checked = true;
    }
    that.setData({
      newcity: that.data.newcity,
    });
     console.log(area)
    if (area) {
      wx.setStorage({
        key: 'cityId',
        data: area
      })
    } else {
      console.log('还没有');
    }
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    //直接调用上一个页面的data方法，把数据显示到页面上
    if (prevPage && prevPage.route == "pages/change/Homepage/Honepage") {
      var keyword = ''
      prevPage.setData({
        needReload: true,
        searchCondition: {
          city: area,
          keyword: keyword,
          type: 2,
          p:1
        },
      });
    }
    wx.switchTab({
      url: '/pages/change/Homepage/Honepage'
    })

    if (city) {
      wx.setStorageSync('hotcity', city)
    } else {
      console.log('还没有');
    }

  },
  //点击城市
  cityTap(e) {
 
   var that = this;
   console.log(e)
   var area = e.currentTarget.dataset.val.id;
   var city = e.currentTarget.dataset.val.name;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    //直接调用上一个页面的data方法，把数据显示到页面上
    if (prevPage && prevPage.route == "pages/change/Homepage/Honepage") {
      var keyword=''
      prevPage.setData({
        needReload: true,
        searchCondition: {
          city: area,
          keyword: keyword,
          type: 2,
          p: 1
        },
      });
    }
    wx.switchTab({
      url: '/pages/change/Homepage/Honepage'
    })

    if (city) {
      wx.setStorage({
        key: 'hotcity',
        data: city
      })
    } else {
      console.log('还没有');
    }

  },
  //点击城市字母
  letterTap(e) {
    const Item = e.currentTarget.dataset.item;
    console.log(Item)
    this.setData({
      cityListId: Item
    });
    console.log("..............." + this.data.cityListId);
  },
 
})
