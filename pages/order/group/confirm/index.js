// pages/order/group/confirm/index.js

const web = require("../../../../common/web.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "state": "load",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    });
    this.getData();
  },
  getData: function() {
    this.setData({
      "state": "load"
    });
    let id = this.data.id;
    id = "088a116e4c4d439bb716880d03534392";
    let that = this;
    web.request("C1017", {
      "id": id
    }, {
      success: function(data) {
        console.log(data);
        data.stateValue = data.state;
        data.stateImage = "../../image/detail/" + that.getStateImage(data.state) + ".png";
        data.state = "show";
        let getTimeStart = new Date(data.getTimeStart);
        let getTimeStop = new Date(data.getTimeStop);
        getTimeStart = (getTimeStart.getMonth() + 1) + "月" + getTimeStart.getDate() + "日";
        getTimeStop = (getTimeStop.getMonth() + 1) + "月" + getTimeStop.getDate() + "日";
        data.getTime = getTimeStart + " - " + getTimeStop + " 8:00-23:00";
        that.setData(data);
      },
      fail: function(code, msg) {
        that.setData({
          "state": "error",
          "errorMsg": msg
        });
      }
    });
  },
  getStateImage: function(stateValue) {
    switch (stateValue) {
      case "1":
        return "waitPay";
      case "2":
        return "group";
      case "3":
        return "group";
      case "4":
        return "finish";
      case "5":
        return "refund";
      case "6":
        return "cancel";
      case "7":
        return "refund";
    }
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

  },
  contact: function() {
    wx.makePhoneCall({
      phoneNumber: '18826050039'
    })
  },
  cancel: function() {
    wx.makePhoneCall({
      phoneNumber: '18826050039'
    })
  },
  confirm: function() {
    wx.showLoading({
      title: '处理中',
    });
    let id = this.data.id;
    let that = this;
    web.request("C1018", {
      groupOrderId: id
    }, {
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
        wx.navigateTo({
          url: '../group/result/index?id=' + id,
        })
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
  }
})