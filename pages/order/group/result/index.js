// pages/order/group/detail/index.js

const web = require("../../../../common/web.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let backPageCount = options.backPageCount;
    if (!backPageCount) {
      backPageCount = 1;
    }
    console.log(backPageCount);
    this.setData({
      "id": options.id,
      "backPageCount": backPageCount
    });
    this.getData();
  },
  getData: function() {
    this.setData({
      "state": "load"
    });
    let that = this;
    let id = this.data.id;
    web.request("C1019", {
      "id": id
    }, {
      success: function(data) {
        data.state = "show";
        let len = data.groupNum - data.userList.length;
        data.userUnknowList = [];
        for (let i = 0; i < len; i++) {
          data.userUnknowList.push({});
        }
        that.setData(data);
        that.showEndTime();
      },
      fail: function(code, msg) {
        if (code == "-1001") {
          setTimeout(function() {
            that.getData();
          }, 1500);

        } else {
          that.setData({
            "state": "error",
            "errorMsg": msg,
          });
        }
      }
    });
  },

  showEndTime: function() {
    let that = this;

    let dtStr = that.data.stopTime;
    let dtArr = dtStr.split(" ");
    let dArr = dtArr[0].split("-");
    let tArr = dtArr[1].split(":");

    let date1 = new Date(dArr[0], dArr[1] - 1, dArr[2], tArr[0], tArr[1], tArr[2]);
    let date2 = new Date();

    let tem = date1.getTime() - date2.getTime();
    let hour = parseInt(tem / 3600000);
    let minute = parseInt(tem % 3600000 / 60000);
    let second = parseInt(tem % 60000 / 1000);
    this.setData({
      stopTimeDetail: {
        hour: hour,
        minute: minute,
        second: second
      }
    });
    setTimeout(function() {
      that.showEndTime();
    }, 1000);
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
    let backPageCount = this.data.backPageCount;
    wx.navigateBack({
      delta: backPageCount
    });
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
    let that = this;

    return {
      title: that.data.nickName + " 推荐,限购" + that.data.groupNum + "个【" + that.data.goodName + "】",
      path: '../../../group/detail/index?teamId=' + that.data.teamId,
      imageUrl: that.data.shareImageUrl,
    }
  }
})