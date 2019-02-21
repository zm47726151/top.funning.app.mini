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
    "shopcarVisibility": "hide", //show
    "goodAmount": 0,
    "scrollValue": 0,
    "shopcarList": [],
    "shoplistVisibility": ""
  },
  onLoad: function() {
    let that = this;
    that.setData({
      "state": "load"
    });

    web.request("C1001", {}, {
      success: function(data) {
        let dataList = data.typeList;
        dataList[0].active = 'true';
        that.setData({
          "dataList": dataList,
          "currentType": dataList[0],
          "state": "show"
        });
      },
      fail: function(code, msg) {
        that.setData({
          "state": "error",
          "errorMsg": msg
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
    let dataList = this.data.dataList;
    let currentType;
    let that = this;

    //1. 更新datatlist
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
            //2. 更新currentType
            currentType = dataList[i];
            //3. 更新shopcarList
            that.shopcarlistAdd(dataList[i].goodList[j]);
            break loop;
          }
        }
      }

    //4. 更新GoodAmount
    let goodAmount = this.data.goodAmount + 1;

    this.setData({
      "currentType": currentType,
      "dataList": dataList,
      "goodAmount": goodAmount,
      "shopcarVisibility": "show"
    });
  },
  shopcarlistAdd: function(body) {
    //3. 更新shopcarList
    let shopcarList = this.data.shopcarList;
    let item;
    for (let i = 0; i < shopcarList.length; i++) {
      if (shopcarList[i].body.id == body.id) {
        item = shopcarList[i];
        break;
      }
    }
    if (item == null) {
      shopcarList.push({
        "body": body,
        "amount": 1
      });
    } else {
      item.amount = item.amount + 1;
    }

    //5. 更新priceAmount
    let priceAmount = 0;
    for (let i = 0; i < shopcarList.length; i++) {
      priceAmount = priceAmount + shopcarList[i].body.price * shopcarList[i].amount;
    }

    this.setData({
      "shopcarList": shopcarList,
      "priceAmount": priceAmount
    });
  },
  reduceClick: function(res) {
    let id = res.target.dataset.id;
    let dataList = this.data.dataList;
    let currentType;
    let that = this;

    //1. 更新datalist
    loop:
      for (let i = 0; i < dataList.length; i++) {
        let goodList = dataList[i].goodList;
        for (let j = 0; j < goodList.length; j++) {
          let item = goodList[j];
          if (item.id == id) {
            if (item.amount == null || item.amount < 1) {
              return;
            } else if (item.amount > 0) {
              dataList[i].goodList[j].amount = item.amount - 1;
            }

            //2. 更新currentType
            currentType = dataList[i];

            //3. 更新shopcartList
            that.shopcarListReduce(dataList[i].goodList[j]);
            break loop;
          }
        }
      }

    //4. 更新goodAcount
    let goodAmount = this.data.goodAmount;
    if (goodAmount > 0) {
      goodAmount = goodAmount - 1;
    }

    this.setData({
      "currentType": currentType,
      "dataList": dataList,
      "goodAmount": goodAmount,
      "shopcarVisibility": (goodAmount == 0 ? "hide" : "show")
    });
  },
  shopcarListReduce: function(body) {
    //3. 更新shopcarList
    let shopcarList = this.data.shopcarList;
    let item;
    for (let i = 0; i < shopcarList.length; i++) {
      if (shopcarList[i].body.id == body.id) {
        item = shopcarList[i];
        break;
      }
    }

    if (item != null) {
      item.amount = item.amount - 1;
      if (item.amount < 1) {
        let index = shopcarList.indexOf(item);
        shopcarList.splice(index, 1);
      }
    }

    //5. 更新priceAmount
    let priceAmount = 0;
    for (let i = 0; i < shopcarList.length; i++) {
      priceAmount = priceAmount + shopcarList[i].body.price * shopcarList[i].amount;
    }

    this.setData({
      "shopcarList": shopcarList,
      "priceAmount": priceAmount
    });
  },
  showShoplist: function() {
    this.setData({
      "shoplistVisibility": "show",
    });
  },
  hideShoplist: function() {
    this.setData({
      "shoplistVisibility": "hide",
    });
  },
  clearShopcarList: function() {
    //1. update datalist
    let dataList = this.data.dataList;
    for (let i = 0; i < dataList.length; i++) {
      for (let j = 0; j < dataList[i].goodList.length; j++) {
        dataList[i].goodList[j].amount = 0;
      }
    }

    //2. update currentType
    let currentType = this.data.currentType;
    for (let i = 0; i < currentType.goodList.length; i++) {
      currentType.goodList[i].amount = 0;
    }

    //3. update shopcarlist
    let shopcarList = this.data.shopcarList;
    shopcarList.splice(0, shopcarList.length);

    //4. update goodAmount
    //5. update priceAmount
    this.setData({
      "dataList": dataList,
      "currentType": currentType,
      "shopcarList": shopcarList,
      "goodAmount": 0,
      "priceAmount": 0,
      "shoplistVisibility": "hide",
      "shopcarVisibility": "hide"
    });
  },
  comfirm: function() {
    let shopcarList = this.data.shopcarList;
    if (!shopcarList) {
      wx.showToast({
        image: "/image/failure.png",
        title: '请选择商品',
      });
      return;
    }

    let json = {
      "shopcarList": shopcarList,
    }

    let jsonStr = JSON.stringify(json);
    this.createOrder();
  },
  createOrder: function() {
    wx.showLoading({
      title: '处理中...',
    })
    web.request("C1002", {
      goodList: this.data.shopcarList
    }, {
      success: function(data) {
        console.log(data);
        wx.navigateTo({
          url: '/pages/order/confirm/index?id=' + data.id,
        })
      },
      fail: function(code, msg) {
        wx.showToast({
          title: msg,
          image:"/image/failure.png"
        });
      },
      complete:function(res){
        wx.hideLoading();
      }
    });
  },
  toDetail: function() {
    wx.navigateTo({
      url: 'good/detail/index',
    })
  }
})