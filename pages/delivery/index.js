//index.js
//获取应用实例

/**
 * 1. get good list from server
 * 2. 对比 app.shopList 和 good list
 * 3. 更新 good List 中的数量
 * 4. 生成 current type
 * 
 * 每一次更新 shop list 都要同步到 app.shopList
 */

const app = getApp()
const web = require("../../common/web.js");
Page({
  isTypeClick: false,
  data: {
    "imageHost": app.imageHost,
    "state": "load", //show,error,
    "errorMsg": "",
    /*"dataList": [{
      "active": "true",
      "goodList": [{
        "number": "0",
      }]
    }],
    "currentType": {},*/
    "shopcarVisibility": "hide", //show
    "goodAmount": 0,
    "scrollValue": 0,
    "shopList": [],
    "shoplistVisibility": ""
  },
  onLoad: function() {
    this.getData();
  },
  getData: function() {
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
          "state": "show",
          "postImageUrl": data.postImageUrl
        });
        that.dataInit();
      },
      fail: function(code, msg) {
        that.setData({
          "state": "error",
          "errorMsg": msg
        });
      }
    });
  },
  onShow: function() {
    this.dataInit();
  },
  dataInit: function() {
    console.log("dataInit");
    if (!this.data.dataList) {
      return;
    }

    if (!this.data.currentType) {
      return;
    }

    if (!app.shopList) {
      app.shopList = [];
    }

    let map = {};
    for (let i = 0; i < app.shopList.length; i++) {
      let m = app.shopList[i];
      map[m.body.id] = m;
    }

    let dataList = this.data.dataList;
    let currentTypeIndex = dataList.indexOf(this.data.currentType);
    console.log(currentTypeIndex);

    for (let i = 0; i < dataList.length; i++) {
      let goodList = dataList[i].goodList;
      for (let j = 0; j < goodList.length; j++) {
        let good = goodList[j];
        let item = map[good.id];
        if (item) {
          good.amount = item.amount;
        }
      }
    }

    let priceAmount = 0;
    let goodAmount = 0;
    for (let i = 0; i < app.shopList.length; i++) {
      let item = app.shopList[i];
      priceAmount = priceAmount + item.body.price * item.amount;
      goodAmount = goodAmount + item.amount;
    }

    let currentType = dataList[currentTypeIndex];
    this.setData({
      "shopList": app.shopList,
      "dataList": dataList,
      "priceAmount": priceAmount,
      "goodAmount": goodAmount,
      "currentType": currentType
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
            //3. 更新shopList
            that.shopListAdd(dataList[i].goodList[j]);
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
  shopListAdd: function(body) {
    //3. 更新shopList
    let shopList = this.data.shopList;
    let item;
    for (let i = 0; i < shopList.length; i++) {
      if (shopList[i].body.id == body.id) {
        item = shopList[i];
        break;
      }
    }
    if (item == null) {
      shopList.push({
        "body": body,
        "amount": 1
      });
    } else {
      item.amount = item.amount + 1;
    }

    //5. 更新priceAmount
    let priceAmount = 0;
    for (let i = 0; i < shopList.length; i++) {
      priceAmount = priceAmount + shopList[i].body.price * shopList[i].amount;
    }

    this.setData({
      "shopList": shopList,
      "priceAmount": priceAmount
    });
    app.shopList = shopList;
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
            that.shopListReduce(dataList[i].goodList[j]);
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
  shopListReduce: function(body) {
    //3. 更新shopList
    let shopList = this.data.shopList;
    let item;
    for (let i = 0; i < shopList.length; i++) {
      if (shopList[i].body.id == body.id) {
        item = shopList[i];
        break;
      }
    }

    if (item != null) {
      item.amount = item.amount - 1;
      if (item.amount < 1) {
        let index = shopList.indexOf(item);
        shopList.splice(index, 1);
      }
    }

    //5. 更新priceAmount
    let priceAmount = 0;
    for (let i = 0; i < shopList.length; i++) {
      priceAmount = priceAmount + shopList[i].body.price * shopList[i].amount;
    }

    this.setData({
      "shopList": shopList,
      "priceAmount": priceAmount
    });
    app.shopList = shopList;
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
  clearShopList: function() {
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

    //3. update shopList
    let shopList = this.data.shopList;
    shopList.splice(0, shopList.length);

    //4. update goodAmount
    //5. update priceAmount
    this.setData({
      "dataList": dataList,
      "currentType": currentType,
      "shopList": shopList,
      "goodAmount": 0,
      "priceAmount": 0,
      "shoplistVisibility": "hide",
      "shopcarVisibility": "hide"
    });
    app.shopList = shopList;
  },
  comfirm: function() {
    let shopList = this.data.shopList;
    if (!shopList) {
      wx.showToast({
        image: "/image/failure.png",
        title: '请选择商品',
      });
      return;
    }

    wx.showLoading({
      title: '处理中...',
    })
    web.request("C1002", {
      goodList: this.data.shopList
    }, {
      success: function(data) {
        console.log(data);
        wx.navigateTo({
          url: '/pages/order/normal/confirm/index?id=' + data.id,
        });
        wx.hideLoading();
      },
      fail: function(code, msg) {
        wx.showToast({
          title: msg,
          image: "/image/failure.png"
        });
        wx.hideLoading();
      }
    });
  },
  toDetail: function(res) {
    wx.navigateTo({
      url: 'good/detail/index?id=' + res.currentTarget.dataset.id,
    })
  },
  search: function() {
    wx.navigateTo({
      url: 'good/search/index',
    })
  },
  onShareAppMessage: function() {
    return {
      title: getApp().appName,
      path: '/pages/delivery/index',
      imageUrl: '/image/logo.png'
    }
  },
  posterClose: function() {
    this.setData({
      postImageUrl: false
    });
  }
})