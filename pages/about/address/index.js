// pages/about/address/index.js
Page({
  "navigationBarTitleText": " 修改后改变页面导航栏名称",
  /**
   * 页面的初始数据
   */
  data: {
    "address_list": [{
      "id": "1",
      "address": "广州市御发商务中心a062",
      "name": "尹伟杰",
      "phone": "18620552310"
    }, {
      "id": "2",
      "address": "广州市御发商务中心a062",
      "name": "尹伟杰",
      "phone": "18620552310"
    }, {
      "id": "3",
      "address": "广州市御发商务中心a062",
      "name": "尹伟杰",
      "phone": "18620552310"
    }, {
      "id": "3",
      "address": "广州市御发商务中心a062",
      "name": "尹伟杰",
      "phone": "18620552310"
    }, {
      "id": "3",
      "address": "广州市御发商务中心a062",
      "name": "尹伟杰",
      "phone": "18620552310"
    }, {
      "id": "3",
      "address": "广州市御发商务中心a062",
      "name": "尹伟杰",
      "phone": "18620552310"
    }, {
      "id": "3",
      "address": "广州市御发商务中心a062",
      "name": "尹伟杰",
      "phone": "18620552310"
    }, {
      "id": "3",
      "address": "广州市御发商务中心a062",
      "name": "尹伟杰",
      "phone": "18620552310"
    }, {
      "id": "3",
      "address": "广州市御发商务中心a062",
      "name": "尹伟杰",
      "phone": "18620552310"
    }]
  },

  navigateBack: function() {},
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
  addAddress: function() {
    wx.navigateTo({
      url: 'add/index',
    })
  }
})