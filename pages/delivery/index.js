//index.js
//获取应用实例
const app = getApp()
const web = require("../../common/web.js");
Page({
  isTypeClick: false,
  data: {
    "state": "load", //show,error,
    "errorMsg": "",
    "dataList": [{
      "active": "true",
      "goodList": [{
        "number": "0",
      }]
    }],
    "currentType": {},
    "carVisibility": "hide", //show
    "goodAmount": 0,
    "scrollValue": 0,
    "shopcarList": [],
  },
  onLoad: function() {
    console.log("onload");
    let that = this;
    web.request("C1001", {}, {
      success: function(data) {
        let dataList = data.typeList;
        dataList[0].active = 'true';
        console.log(dataList[0]);
        that.setData({
          "dataList": dataList,
          "currentType": dataList[0],
          "state": "show"
        });
      },
      fail: function(code, res) {
        console.log(res);
        that.setData({
          "state": "error"
        });
      }
    });
  },
  typeCLick: function(res) {
    let id = res.target.dataset.id;
    let dataList = this.data.dataList;
    let currentType;
    for (let i = 0; i < dataList.length; i++) {
      let item = dataList[i];
      if (item.id == id) {
        currentType = item;
        item.active = "true";
      } else {
        item.active = "false";
      }
    }
    this.setData({
      "dataList": dataList,
      "currentType": currentType,
      "scrollValue": 0
    });
  },
  addClick: function(res) {
    let id = res.target.dataset.id;
    let goodAmount = this.data.goodAmount + 1;
    let dataList = this.data.dataList;
    let currentType;

    loop:
      for (let i = 0; i < dataList.length; i++) {
        let goodList = dataList[i].goodList;
        for (let j = 0; j < goodList.length; j++) {
          let item = goodList[j];
          if (item.id == id) {
            if (item.amount == null) {
              dataList[i].goodList[j].amount = 1;
            } else {
              dataList[i].goodList[j].amount = item.amount + 1;
            }
            currentType = dataList[i];
            shopcarAdd(dataList[i].goodList[j]);
            break loop;
          }
        }
      }

    this.setData({
      "currentType": currentType,
      "dataList": dataList,
      "goodAmount": goodAmount,
      "carVisibility": "show"
    });
  },
  shopcarAdd: function(body) {
    let shopcarList = this.data.shopcarList;
    for (let i = 0; i < shopcarList.length; i++) {
      if (shopcarList[i].body.id == body.id) {
        shopcarList[i].amount = shopcarList[i].amount + 1;
        this.setData({
          "shopcarList": shopcarList
        });
        return;
      }
    }

    shopcarList.push({
      "body": body,
      "amount": 1
    });
    this.setData({
      "shopcarList": shopcarList
    });
  },
  reduceClick: function(res) {
    let id = res.target.dataset.id;
    let goodAmount = this.data.goodAmount;
    if (goodAmount > 0) {
      goodAmount = goodAmount - 1;
    }
    let dataList = this.data.dataList;
    let currentType;

    loop:
      for (let i = 0; i < dataList.length; i++) {
        let goodList = dataList[i].goodList;
        for (let j = 0; j < goodList.length; j++) {
          let item = goodList[j];
          if (item.id == id) {
            if (item.amount == null) {
              dataList[i].goodList[j].amount = 0;
            } else if (item.amount > 0) {
              dataList[i].goodList[j].amount = item.amount - 1;
            }

            shopcarReduce(dataList[i].goodList[j]);
            currentType = dataList[i];
            break loop;
          }
        }
      }
    this.setData({
      "currentType": currentType,
      "dataList": dataList,
      "goodAmount": goodAmount,
      "carVisibility": (goodAmount == 0 ? "hide" : "show")
    });
  },
  shopcarReduce: function(item) {},
  toDetail: function() {
    wx.navigateTo({
      url: 'good/detail/index',
    })
  }
})