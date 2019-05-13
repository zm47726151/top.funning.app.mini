// pages/order/group/confirm/index.js

const web = require("../../../../common/web.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "state": "load",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setBackgroundColor({
      backgroundColorTop: '#ff9800', // 顶部窗口的背景色为白色
      backgroundColor: "#ff9800",
      backgroundColorBottom: '#ffffff', // 底部窗口的背景色为白色
    })

    this.setData({
      id: options.id
    });
    this.getData();
  },
  getData: function() {
    this.setData({
      "state": "load"
    });
    let id = this.data.id;
    let that = this;
    web.request("C1017", {
      "id": id
    }, {
      success: function(data) {
        console.log(data);
        data.stateValue = data.state;
        data.stateImage = "../../image/detail/" + that.getStateImage(data.state) + ".png";
        data.state = "show";

        let d1Arr = data.getTimeStart.split(" ")[0].split("-");
        let d2Arr = data.getTimeStop.split(" ")[0].split("-");
        let getTimeStart = d1Arr[1] + "月" + d1Arr[2] + "日";
        let getTimeStop = d2Arr[1] + "月" + d2Arr[2] + "日";
        data.getTime = getTimeStart + " - " + getTimeStop + " 8:00-23:00";
        that.setData(data);
      },
      fail: function(code, msg) {
        that.setData({
          "state": "error",
          "errorMsg": msg
        });
      }
    });
  },
  getStateImage: function(stateValue) {
    switch (stateValue) {
      case "1":
        return "waitPay";
      case "2":
        return "group";
      case "3":
        return "group";
      case "4":
        return "finish";
      case "5":
        return "refund";
      case "6":
        return "cancel";
      case "7":
        return "refund";
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮 
      let that = this;
      return {
        title: that.data.nickName + " 推荐,限购" + that.data.groupNum + "个【" + that.data.name + "】",
        path: 'detail/index?teamId=' + that.data.teamId,
        imageUrl: that.data.shareImageUrl,
      }
    } else {
      return {
        title: getApp().appName,
        path: '/pages/delivery/index',
        imageUrl: '/image/logo.png'
      }
    }
  },
  contact: function() {
    wx.makePhoneCall({
      phoneNumber: '18826050039'
    })
  },
  confirm: function() {
    wx.showLoading({
      title: '处理中',
    });
    let id = this.data.id;
    let that = this;
    web.request("C1018", {
      groupOrderId: id
    }, {
      success: function(data) {
        wx.hideLoading();
        that.pay(data);
      },
      fail: function(code, msg) {
        wx.hideLoading();
        wx.showToast({
          image: "/image/failure.png",
          title: msg ? msg : "支付失败",
        });
      }
    });
  },
  pay: function(p) {
    console.log(p);
    let that = this;
    let id = this.data.id;
    wx.requestPayment({
      timeStamp: p.timeStamp,
      nonceStr: p.nonceStr,
      package: p.package,
      signType: 'MD5',
      paySign: p.sign,
      success(res) {
        wx.navigateTo({
          url: '../result/index?id=' + id + "&backPageCount=2",
        });
      },
      fail(res) {
        console.log(res);
        wx.hideLoading();
        wx.showToast({
          image: "/image/failure.png",
          title: "支付失败",
        });
      }
    });
  },
  refund: function() {
    let id = this.data.id;
    let that = this;
    wx.showModal({
      title: '确定申请退款吗?',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '处理中'
          }); 
          web.request("C1022", {
            "id": id
          }, {
              success: function (data) {
                wx.hideLoading();
                that.getData();
              },
              fail: function (code, msg) {
                wx.hideLoading();
                wx: wx.showToast({
                  title: msg,
                  image: '/image/failure.png'
                }); 
              },
            });
        } else if (res.cancel) {

        }
      }
    });
  },
  cancel: function() {

    let id = this.data.id;
    let that = this;
    wx.showModal({
      title: '确定取消吗?',
      success(res) {
        if (res.confirm) {　　　　　　　　　　　　
          wx.showLoading({
            title: '处理中',
          });
          web.request("C1021", {
            id: id
          }, {
            success: function(data) {
              wx.hideLoading();
              that.getData();
            },
            fail: function(code, msg) {
              wx.hideLoading();
              wx.showToast({
                image: "/image/failure.png",
                title: msg,
              });
            }
          });
        } else if (res.cancel) {

        }
      }
    });
  } 
})