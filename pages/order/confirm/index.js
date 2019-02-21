// pages/order/confirm/index.js

let wq = require("../../../common/web.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "orderId": "",
    "state": "load", //error,load,show
    "goods": [],
    "price": "",
    "poster": "6",
    "amount": "",
    "note": "",
    "address": {
      "userName": "",
      "postalCode": "",
      "provinceName": "",
      "cityName": "",
      "countyName": "",
      "detailInfo": "",
      "nationalCode": "",
      "telNumber": ""
    },
    "addressExist": false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let json = JSON.parse(options.info);
    let goods = json.shopcarList;
    this.createOrder(goods);
  },
  createOrder: function(goods) {
    let that = this;
    that.setData({
      "state": "load"
    });

    wq.request("C1002", {
      goodList: goods
    }, {
      success: function(data) {
        let goods = that.data.goods;
        goods = goods.concat(data.goodList);
        that.setData({
          "state": "show",
          "orderId": data.id,
          "price": data.price,
          "goods": goods,
          "amount": (Number(data.price) + Number(that.data.poster))
        });
      },
      fail: function(code, msg) {
        that.setData({
          "state": "error",
          "errorMsg": msg,
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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

  noteInputBinder(e) {
    this.setData({
      note: e.detail.value
    });
  },

  addAddress: function(res) {
    let that = this;
    wx.chooseAddress({
      success(res) {
        that.setData({
          "address": {
            "userName": res.userName,
            "postalCode": res.postalCode,
            "provinceName": res.provinceName,
            "cityName": res.cityName,
            "countyName": res.countyName,
            "detailInfo": res.detailInfo,
            "nationalCode": res.nationalCode,
            "telNumber": res.telNumber
          },
          "addressExist": true
        });
      },
      fail(res) {
        wx.showToast({
          image: "/image/failure.png",
          title: '获取地址失败',
        })
      }
    });
  },
  confirm: function() {
    wx.showLoading({
      title: '处理中',
    })

    let orderId = this.data.orderId;
    let goodlist = this.data.goods;
    let poster = this.data.poster;
    let note = this.data.note;
    let address = this.data.address;


    if (!this.data.addressExist) {
      wx.showToast({
        image: "/image/failure.png",
        title: '请填写送货地址',
      });
      return;
    }

    let data = {
      "id": orderId,
      "goodlist": goodlist,
      "note": note,
      "address": address
    }
    wq.request("C1004", data, {
      success: function(data) {
          //TODO to order detail
      },
      fail: function(code, msg) {
        wx.showToast({
          image: "/image/failure.png",
          title: msg ? msg : "确认失败",
        });
      },
      complete:function(res){
        wx.hideLoading();
      }
    });
  }
})