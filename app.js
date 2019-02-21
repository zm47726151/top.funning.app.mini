//app.js

const web = require("common/web.js");

App({
  isLogin: false,
  onLaunch: function () {
    this.cookie = new Map();
    this.login();
  },
  login: function() {
    let that = this;
    wx.login({
      success(res) { 
        if (res.code) {
          // 发起网络请求
          web.request("C1003", {
            "jsCode": res.code
          }, {
            success: function(data) {
              that.isLogin = true;
            },
            fail: function(code, msg) {
              wx.showModal({
                title: '登录失败',
                content: msg,
                confirmText: "重新登录",
                success(res) {
                  if (res.confirm) {
                    that.login();
                  }
                }
              });
            }
          })
        } else {
          wx.showModal({
            title: '登录失败',
            content: "",
            confirmText: "重新登录",
            success(res) {
              if (res.confirm) {
                that.login();
              }
            }
          });
        }
      }
    });
  }
})