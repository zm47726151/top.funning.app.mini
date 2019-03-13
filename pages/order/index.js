// pages/order/index.js

const web = require("../../common/web.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "state": 'load',
    "orders": {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      "state": 'load',
    });
    this.getData();
  },
  getData: function() {
    let that = this;
    web.request("C1005", {}, {
      success: function(data) {
        console.log(data);
        if (!data.orders || data.orders.length < 1) {
          this.fail("-1","没有订单");
          return;
        }
        that.setData({
          "state": 'show',
          "orders": data.orders
        });
        wx.stopPullDownRefresh();
      },
      fail: function(code, msg) {
        console.log(msg);
        that.setData({
          "state": 'error',
          "errorMsg": msg
        });
        wx.stopPullDownRefresh();
      }
    });
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
    this.getData();
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

  toDetail: function(res) {
    wx.navigateTo({
      url: 'detail/index?id=' + res.currentTarget.dataset.id,
    })
  }
})