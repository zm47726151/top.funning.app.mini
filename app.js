//app.js

const web = require("common/web.js");

App({
  isLogin: false,
  onLaunch: function () {
    this.cookie = new Map(); 
  }
})