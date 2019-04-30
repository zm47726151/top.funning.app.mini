// pages/group/detail/index.js
const web = require("../../../common/web.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "state": "load"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    let that = this;
    web.request("C1015", {
      id: 15
    }, {
      success: function(data) {
        data.state = "show";
        let t1 = new Date(data.getTimeStart);
        data.getTimeStart = (t1.getMonth() + 1) + '月' + t1.getDate() + "日";

        let t2 = new Date(data.getTimeStop);
        data.getTimeStop = (t2.getMonth() + 1) + '月' + t2.getDate() + "日";

        data.detail = JSON.parse(data.detail);
        console.log(data);
        that.setData(data);
        that.showEndTime();
      },
      fail: function(code, msg) {
        that.setData({
          "state": "error",
          "errorMsg": msg
        });
      }
    })
  },
  showEndTime: function() {
    let that = this;

    let date1 = new Date(that.data.stopTime);
    let date2 = new Date();

    let tem = date1.getTime() - date2.getTime();
    let hour = parseInt(tem / 3600000);
    let minute = parseInt(tem % 3600000 / 60000);
    let second = parseInt(tem % 60000 / 1000);
    let millisecond = parseInt(tem % 1000 / 100);
    this.setData({
      stopTimeDetail: {
        hour: hour,
        minute: minute,
        second: second,
        millisecond: millisecond
      }
    });
    setTimeout(function() {
      that.showEndTime();
    }, 100);
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

  toHome: function() {
    wx.reLaunch({
      url: '../index'
    })
  },

  start: function() {
    let id = this.data.id;
    wx.showLoading({
      title: '处理中...',
    });
    web.request("C1016", {
      "id": id
    }, {
      success: function(data) {
        console.log(data);
        wx.hideLoading();
        wx.navigateTo({
          url: '/pages/order/group/confirm/index?id=' + data.id,
        });
      },
      fail: function(code, msg) {
        wx.hideLoading();
        wx.showToast({
          title: msg,
          image: "/image/failure.png"
        });
      },
    });
  }
})