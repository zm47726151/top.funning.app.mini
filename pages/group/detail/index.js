// pages/group/detail/index.js
const web = require("../../../common/web.js");
let userInfo = {};

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
    let data = {};
    data.id = options.id;
    if (options.teamId) {
      data.teamId = options.teamId;
      data.buttonValue = "参团";
    } else {
      data.buttonValue = "开团";
    }
    this.setData(data);
    this.getData();
  },
  getData: function() {

    this.setData({
      "state": "load"
    })
    let that = this;
    let id = this.data.id;
    web.request("C1015", {
      "id": id,
    }, {
      success: function(data) {
        data.state = "show";

        let d1Arr = data.getTimeStart.split(" ")[0].split("-");
        data.getTimeStart = d1Arr[1] + '月' + d1Arr[2] + "日";

        let d2Arr = data.getTimeStop.split(" ")[0].split("-");
        data.getTimeStop = d2Arr[1] + '月' + d2Arr[2] + "日";

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
    });
  },
  showEndTime: function() {
    let that = this;

    let dtStr = that.data.stopTime;
    let dtArr = dtStr.split(" ");
    let dArr = dtArr[0].split("-");
    let tArr = dtArr[1].split(":");
 
    let date1 = new Date(dArr[0], dArr[1]-1, dArr[2], tArr[0], tArr[1], tArr[2]);
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

  getUserInfo: function(res) {
    userInfo = res.detail.userInfo;
    this.start();
  },

  start: function() {
    console.log(userInfo);
    let id = this.data.id;
    let teamId = this.data.teamId;
    wx.showLoading({
      title: '处理中...',
    });
    this.postOrder(id, teamId);
  },

  postOrder: function(id, teamId) {
    let that = this;
    web.request("C1016", {
      "orderInfo": {
        "id": id,
        "teamId": teamId
      },
      "userInfo": userInfo
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
        if (code == "-1001") {
          wx.showModal({
            title: '拼团失败',
            content: '这个团已经满了，是否需要新开一个团？',
            confirmText: "重新开团",
            cancelText: "取消",
            success: function(res) {
              if (res.confirm) {
                that.postOrder(id);
              } else if (res.cancel) {

              }
            }
          });
        } else {
          wx.showToast({
            title: msg,
            image: "/image/failure.png"
          });
        }
      },
    });
  }
})