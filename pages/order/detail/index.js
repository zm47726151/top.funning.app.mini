// pages/order/detail/index.js

let web = require("../../../common/web.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "state": "show",
    "orders": []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      "orderId": options.id
    });
    this.getData();
  },
  getData: function(id) {
    let that = this;
    let orderId = that.data.orderId;
    that.setData({
      "state": "load"
    });
    web.request("C1006", {
      "id": orderId
    }, {
      success: function(data) {
        let titleStyle = that.getTitleStyle(data.state);
        wx.setNavigationBarColor({
          frontColor: '#ffffff', // 必写项
          backgroundColor: titleStyle.color, // 必写项
        });
        that.setData({
          "state": "show",
          "info": data,
          "titleColor": titleStyle.color,
          "titleImage": titleStyle.image
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
  getTitleStyle: function(state) {
    switch (state) {
      case "1":
        return {
          color: "#ff9800",
          image: "image/waitPay.png"
        };
      case "2":
        return {
          color: "#8bc34a",
          image: "image/doing.png"
        };
      case "3":
        return {
          color: "#03a9f4",
          image: "image/finish.png"
        };
      case "4":
        return {
          color: "#9e9e9e",
          image: "image/refund.png"
        };
      case "5":
      case "6":
        return {
          color: "#ff5722",
          image: "image/cancel.png"
        };
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
  copyText: function(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            wx.showToast({
              title: '复制成功',
              image: "/image/success.png"
            });
          }
        })
      }
    })
  },
  makePhoneCall: function() {
    wx.makePhoneCall({
      phoneNumber: '18620552310' // 仅为示例，并非真实的电话号码
    })
  },
  pay: function() {
    let that = this;
    wx.navigateTo({
      url: '../confirm/index?id=' + that.data.orderId,
    })
  },
  cancel: function() {
    wx.showLoading({
      title: '处理中'
    });
    let that = this;
    web.request("C1007", {
      "id": this.data.info.id
    }, {
      success: function(data) {
        that.getData();
        wx.hideLoading();
      },
      fail: function(code, msg) {
        wx: wx.showToast({
          title: msg,
          image: '/image/failure.png'
        });wx.hideLoading();
      },

    });
  },
  refund: function() {
    wx.showLoading({
      title: '处理中'
    });
    let that = this;
    web.request("C1008", {
      "id": this.data.info.id
    }, {
      success: function(data) {
        that.getData();
        wx.hideLoading();
      },
      fail: function(code, msg) {
        wx: wx.showToast({
          title: msg,
          image: '/image/failure.png'
        });wx.hideLoading();
      },
    });
  }
})