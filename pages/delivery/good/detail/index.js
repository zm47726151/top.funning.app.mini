// pages/delivery/good/detail/index.js

const web = require("../../../../common/web.js")
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "imageHost": app.imageHost
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id;
    let amount = 0;
    for (let i = 0; i < app.shopList.length; i++) {
      let item = app.shopList[i];
      if (id == item.body.id) {
        amount = item.amount;
        break;
      }
    }
    this.setData({
      "id": id,
      "amount": amount
    });
    this.getData();
    this.updateBottomView();
  },
  getData: function() {
    let that = this;
    this.setData({
      "state": "load"
    })
    web.request("C1009", {
      "id": that.data.id
    }, {
      success: function(d) {
        d.state = "show";
        that.setData(d);
      },
      fail: function(code, msg) {
        that.setData({
          "state": "error",
          "errorMsg": msg
        });
      }
    });
  },
  goodAdd: function() {
    let amount = this.data.amount;
    if (!amount) {
      amount = 0;
    }
    amount = amount + 1;
    this.setData({
      amount: amount
    });

    this.updateShopList(amount);
    this.updateBottomView();
  },

  goodReduce: function() {
    let amount = this.data.amount;
    if (!amount) {
      amount = 0;
    }
    if (amount < 1) {
      return;
    }
    amount = amount - 1;
    this.setData({
      amount: amount
    });

    this.updateShopList(amount);
    this.updateBottomView();
  },
  updateShopList: function(amount) {
    let shopList = app.shopList;
    let id = this.data.id;
    let item;
    for (let i = 0; i < shopList.length; i++) {
      item = shopList[i];
      if (item.body.id == id) {
        item.amount = amount;
      }
    }
    if (item == null) {
      item = {};
      item.amount = 1;
      item.body = {};
      item.body.id = this.data.id;
      item.body.name = this.data.name;
      item.body.description = this.data.description;
      item.body.imageUrl = this.data.imageUrl;
      item.body.price = this.data.price;
      shopList.push(item);
    } else if (item.amount == 0) {
      let index = shopList.indexOf(item);
      shopList.splice(index, 1);
    }
    app.shopList = shopList;
  },
  updateBottomView: function() {
    let shopList = app.shopList;
    let goodAmount = 0;
    let priceAmount = 0;

    for (let i = 0; i < shopList.length; i++) {
      let item = shopList[i];
      goodAmount = goodAmount + item.amount;
      priceAmount = priceAmount + Number(item.body.price) * Number(item.amount);
    }

    this.setData({
      goodAmount: goodAmount,
      priceAmount: priceAmount
    });
  },

  showShoplist: function() {
    console.log("showShoplist");
    this.setData({
      "shoplistVisibility": true,
      "shopList": app.shopList
    });
  },

  hideShoplist: function() {
    console.log("hideShoplist");
    this.setData({
      "shoplistVisibility": false,
    });
  },

  clearShopList: function() {
    app.shopList = [];
    this.updateBottomView();
    this.setData({
      "shoplistVisibility": false,
      "amount": 0
    });
  },

  comfirm: function() {
    let shopList = app.shopList;
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
      goodList: shopList
    }, {
      success: function(data) {
        console.log(data);
        wx.hideLoading();
        wx.navigateTo({
          url: '/pages/order/normal/confirm/index?id=' + data.id,
        });
      },
      fail: function(code, msg) {
        wx.hideLoading();
        wx.showToast({
          title: msg,
          image: "/image/failure.png"
        });
      }
    });
  },

  shopListAdd: function(res) {
    let id = res.currentTarget.dataset.id;
    let shopList = app.shopList;

    for (let i = 0; i < shopList.length; i++) {
      let item = shopList[i];
      if (item.body.id = id) {
        item.amount = item.amount + 1;
        if (item.body.id == this.data.id) {
          let amount = this.data.amount;
          amount = amount + 1;
          this.setData({
            "amount": amount
          });
        }
        break;
      }
    }

    let priceAmount = 0;
    for (let i = 0; i < shopList.length; i++) {
      let item = shopList[i];
      priceAmount = priceAmount + Number(item.body.price) * Number(item.amount);
    }

    let goodAmount = this.data.goodAmount + 1;
    this.setData({
      "shopList": shopList,
      "goodAmount": goodAmount,
      "priceAmount": priceAmount
    });
    app.shopList = shopList;
  },
  shopListReduce: function(res) {
    let id = res.currentTarget.dataset.id;
    let shopList = app.shopList;

    for (let i = 0; i < shopList.length; i++) {
      let item = shopList[i];
      if (item.body.id = id) {
        item.amount = item.amount - 1;
        if (item.amount == 0) {
          let index = shopList.indexOf(item);
          shopList.splice(index, 1);
        }
        if (item.body.id == this.data.id) {
          this.setData({
            "amount": item.amount
          });
        }
        break;
      }
    }

    let priceAmount = 0;
    let goodAmount = 0;
    for (let i = 0; i < shopList.length; i++) {
      let item = shopList[i];
      priceAmount = priceAmount + Number(item.body.price) * Number(item.amount);
      goodAmount = goodAmount + item.amount;
    }

    this.setData({
      "shopList": shopList,
      "goodAmount": goodAmount,
      "priceAmount": priceAmount
    });

    app.shopList = shopList;
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
    let app = getApp();
    let title = this.data.name + "--" + app.appName;
    let imageUrl = this.data.header.imageList[0];
    return {
      title: title,
      //path: '/pages/delivery/index',
      imageUrl: imageUrl
    }
  },
})