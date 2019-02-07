//index.js
//获取应用实例
const app = getApp()

Page({

  onLoad: function() {
    
  },
  compute: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: "年龄岁数计算器",
      imageUrl: "/image/icon.png"
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