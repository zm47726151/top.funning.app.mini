//app.js

const web = require("common/web.js");

App({
  appName: "KFS",
  isLogin: false,
  shopList: [],
  cookie: {},
  onLaunch: function() {
    this.cookie = new Map();
  }
})