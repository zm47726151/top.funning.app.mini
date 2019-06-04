// pages/order/index.js

const web = require("../../common/web.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "listMode": "1",
    "orders": {},
    "imageHost": app.imageHost
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData();
  },
  getData: function() {
    this.setData({
      "state": 'load',
    });
    let that = this;
    web.request("C1005", {}, {
      success: function(data) {
        if (!data.orders || data.orders.length < 1) {
          this.fail("-1", "没有订单");
          return;
        }
        that.setData({
          "state": 'show',
          "orders": data.orders
        });
      },
      fail: function(code, msg) {
        that.setData({
          "state": 'error',
          "errorMsg": msg
        });
      }
    });
  },

  toNomal: function() {
    wx.stopPullDownRefresh();
    this.setData({
      "listMode": "1"
    });
    let orders = this.data.orders;
    if (orders) {
      wx.stopPullDownRefresh();
      return;
    }

    wx.startPullDownRefresh();
  },

  toGroup: function() {
    this.setData({
      "listMode": "2"
    });

    let groups = this.data.groups;
    if (groups) {
      wx.stopPullDownRefresh();
      return;
    }
    wx.startPullDownRefresh();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (this.data.listMode == "1") {
      this.getOrders();
    } else if (this.data.listMode == "2") {
      this.getGroups();
    }
  },

  getGroups: function() {

    let that = this;
    web.request("C1020", {}, {
      success: function(data) {
        if (!data.groups || data.groups.length < 1) {
          this.fail("-1001", "没有订单");
          return;
        }

        that.setData({
          "nickName": data.nickName,
          "groups": data.groups
        });
        wx.stopPullDownRefresh();
      },
      fail: function(code, msg) {
        that.setData({
          "groupListViewMsg": msg
        });
        console.log(6);
        wx.stopPullDownRefresh();
      }
    });
  },

  getOrders: function() { 
    let that = this;
    web.request("C1005", {}, {
      success: function(data) {
        if (!data.orders || data.orders.length < 1) {
          this.fail("-1001", "没有订单");
          return;
        }
        that.setData({
          "orders": data.orders
        });
        wx.stopPullDownRefresh();
      },
      fail: function(code, msg) {
        that.setData({
          "orderListViewMsg": msg
        });
        wx.stopPullDownRefresh();
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      let data = res.target.dataset;
      console.log(res.target.dataset);
      let that = this;
      return {
        title: that.data.nickName + " 推荐,限购" + data.num + "个【" + data.name + "】",
        path: 'detail/index?teamId=' + data.teamId,
        imageUrl: data.shareimageurl,
      }
    } else {
      return {
        title: getApp().appName,
        path: '/pages/delivery/index',
        imageUrl: '/image/logo.png'
      }
    }
  },

  toOrderDetail: function(res) {
    wx.navigateTo({
      url: 'normal/detail/index?id=' + res.currentTarget.dataset.id,
    })
  },

  toGroupDetail: function(res) {
    wx.navigateTo({
      url: 'group/confirm/index?id=' + res.currentTarget.dataset.id,
    })
  },

  toSharePage: function(res) {

  }
})