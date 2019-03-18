//index.js
//获取应用实例
const app = getApp()

Page({

  onLoad: function() {
    wx.setBackgroundColor({
      backgroundColor: "#ff9800",
      backgroundColorBottom: "#ffffff"
    });
  },
  compute: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: getApp().appName,
      path: '/pages/delivery/index',
      imageUrl: '/image/logo.png'
    }
  },
  toKnxy: function() {
    wx.navigateTo({
      url: 'knxy/index',
    })
  },
  login: function() {

  }
})