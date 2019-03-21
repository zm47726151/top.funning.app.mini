// pages/order/confirm/index.js

const wq = require("../../../common/web.js");
const addrUtils = require("../../../common/address.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "state": "load", //error,load,show
    "id": "",
    "goodList": [],
    "price": "",
    "poster": "0",
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
    console.log(options);
    this.setData({
      "id": options.id
    });
    this.getData();
  },
  getData: function() {
    let that = this;
    let id = this.data.id;
    that.setData({
      "state": "load"
    });

    wq.request("C1006", {
      "id": id
    }, {
      success: function(data) {
        data.state = "show";
        data.amount = (Number(data.price) + Number(that.data.poster));
        that.setData(data);
        console.log(that.data);
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
        let address = {
          "userName": res.userName,
          "postalCode": res.postalCode,
          "provinceName": res.provinceName,
          "cityName": res.cityName,
          "countyName": res.countyName,
          "detailInfo": res.detailInfo,
          "nationalCode": res.nationalCode,
          "telNumber": res.telNumber
        }
        addrUtils.computer({
          "price": that.data.price,
          "address": address,
          onSuccess: function(poster) {

            that.setData({
              "address": address,
              "poster": poster,
              "amount": (Number(that.data.price) + Number(poster)),
              "addressExist": true
            });
          },
          onFail: function(msg) {
            wx.showToast({
              image: "/image/failure.png",
              title: '计算运费失败',
            })
          }
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

    let id = this.data.id;
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
      "id": id,
      "note": note,
      "address": address
    }
    let that = this;
    wq.request("C1010", data, {
      success: function(data) {
        wx.hideLoading();
        that.pay(data);

      },
      fail: function(code, msg) {
        wx.hideLoading();
        wx.showToast({
          image: "/image/failure.png",
          title: msg ? msg : "支付失败",
        });
      }
    });
  },
  pay: function(p) {
    console.log(p);
    let that = this;
    wx.requestPayment({
      timeStamp: p.timeStamp,
      nonceStr: p.nonceStr,
      package: p.package,
      signType: 'MD5',
      paySign: p.sign,
      success(res) {
        that.clientPaySuccess();
      },
      fail(res) {
        console.log(res);
        wx.hideLoading();
        wx.showToast({
          image: "/image/failure.png",
          title: "支付失败",
        });
      }
    });
  },
  clientPaySuccess: function() {
    console.log("clientPaySuccess");
    wx.showLoading({
      title: '处理中',
    })
    let id = this.data.id;
    wq.request("C1004", {
      "id": id,
    }, {
      success: function(data) {
        wx.hideLoading();
        wx.redirectTo({
          url: '../detail/index?id=' + id,
        });
      },
      fail: function(code, msg) {
        wx.hideLoading();
        wx.showToast({
          image: "/image/failure.png",
          title: msg ? msg : "支付失败",
        });
      }
    });
  }
})