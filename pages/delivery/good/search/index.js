// pages/delivery/good/search/index.js

const web = require("../../../../common/web.js");
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    "imageHost": app.imageHost,
    "state": "none"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  search: function(res) {
    console.log(res.detail.value);
    let that = this;
    this.setData({
      "state": "load"
    });
    web.request("C1012", {
      "word": res.detail.value
    }, {
      success: function(d) {
        that.setData({
          "dataList": d.dataList,
          "state": "list"
        });
      },
      fail: function(code, msg) {
        that.setData({
          "state": "none"
        });
      }
    });
  },

  itemClick: function(res) {
    let id = res.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/index?id=' + id,
    })
  }
})